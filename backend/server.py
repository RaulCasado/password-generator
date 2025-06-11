from flask import Flask, jsonify, request
from flask_cors import CORS
import secrets
import random
import string
import faker
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from wordfreq import top_n_list
import requests
import hashlib
from functools import wraps
import time
from collections import defaultdict
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

fake = faker.Faker('es_ES')

# Simulated email storage - this will be used as fallback if external API fails
email_storage = {}

# Guerrilla Mail API constants
GUERRILLA_API_URL = "https://api.guerrillamail.com/ajax.php"
GUERRILLA_DOMAINS = [
    "guerrillamail.com",
    "guerrillamail.net",
    "guerrillamail.org",
    "guerrillamailblock.com",
    "grr.la",
    "pokemail.net",
    "spam4.me"
]

# Keep session IDs for guerrilla mail
guerrilla_sessions = {}

request_counts = defaultdict(list)
failed_attempts = defaultdict(int)

def rate_limit(max_requests=10,window=60):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            client_ip = request.remote_addr

            now = time.time()

            request_counts[client_ip] = [
                req_time for req_time in request_counts[client_ip] if req_time > now - window
            ]

            if len(request_counts[client_ip]) >= max_requests:
                return jsonify({
                    'error': 'Demasiadas solicitudes. Por favor, inténtelo de nuevo más tarde.',
                    'retry_after': window,
                    'requests_remaining' : 0
                }), 429
            
            request_counts[client_ip].append(now)
            response = func(*args, **kwargs)
            return response
        return wrapper
    return decorator

def handle_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as ve:
            return jsonify({'error': str(ve)}), 400
        except requests.exceptions.RequestException as re:
            return jsonify({'error': 'Error al comunicarse con el servicio externo. Por favor, inténtelo de nuevo más tarde.'}), 503
        except Exception as e:
            return jsonify({'error': 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.'}), 500
    return decorated_function

def generate_password(length, include_uppercase, include_lowercase, include_numbers, include_special_characters, disallowed_chars='',is_easy_to_remember=False):
    if is_easy_to_remember:
        words = top_n_list('es', 2000)
        sysrand = secrets.SystemRandom()
        selection = sysrand.sample(words, k=4)
        separator = sysrand.choice(['-', '_', ''])
        return separator.join(selection)
    
    characters = ''
    if include_uppercase:
        characters += string.ascii_uppercase
    if include_lowercase:
        characters += string.ascii_lowercase
    if include_numbers:
        characters += string.digits
    if include_special_characters:
        characters += string.punctuation
    

    # Remove disallowed characters
    if disallowed_chars:
        for char in disallowed_chars:
            characters = characters.replace(char, '')

    if not characters:
        return None

    # Generate password
    password = ''.join(secrets.choice(characters) for _ in range(length))
    
    # Verify the password meets requirements
    if include_uppercase and not any(c.isupper() for c in password):
        return generate_password(length, include_uppercase, include_lowercase, include_numbers, include_special_characters, disallowed_chars)
    if include_lowercase and not any(c.islower() for c in password):
        return generate_password(length, include_uppercase, include_lowercase, include_numbers, include_special_characters, disallowed_chars)
    if include_numbers and not any(c.isdigit() for c in password):
        return generate_password(length, include_uppercase, include_lowercase, include_numbers, include_special_characters, disallowed_chars)
    if include_special_characters and not any(c in string.punctuation for c in password):
        return generate_password(length, include_uppercase, include_lowercase, include_numbers, include_special_characters, disallowed_chars)
    
    return password

@app.route('/api/website_password', methods=['POST'])
@rate_limit(max_requests=30, window=60)
@handle_errors
def website_password():
    data = request.json
    min_length = data.get('minLength', 8)
    max_length = data.get('maxLength', 16) 
    requires_uppercase = data.get('requiresUppercase', False)
    requires_lowercase = data.get('requiresLowercase', False)
    requires_numbers = data.get('requiresNumbers', False)
    requires_special = data.get('requiresSpecial', False)
    disallowed_chars = data.get('disallowedChars', '')
    
    # Generate a random length between min and max
    length = random.randint(min_length, max_length)
    
    # Generate password
    password = generate_password(
        length, 
        requires_uppercase, 
        requires_lowercase, 
        requires_numbers, 
        requires_special, 
        disallowed_chars
    )
    
    if not password:
        return jsonify({'error': 'No se pudo generar una contraseña con los requisitos especificados'}), 400
    
    return jsonify({'password': password})

@app.route('/request_password', methods=['POST'])
@rate_limit(max_requests=30, window=60)
@handle_errors
def request_password():
    data = request.json
    length                     = data.get('length', 16)
    include_uppercase          = data.get('includeUppercase', False)
    include_lowercase          = data.get('includeLowercase', False)
    include_numbers            = data.get('includeNumbers', False)
    include_special_characters = data.get('includeSpecialCharacters', False)
    disallowed_chars           = data.get('disallowedChars', '')
    is_easy_to_remember        = data.get('isEasyToRemember', False)

    if not (include_uppercase or include_lowercase or include_numbers
            or include_special_characters or is_easy_to_remember):
        return jsonify({'error': 'Alguna opción tiene que ser seleccionada'}), 400

    pwd = generate_password(
        length,
        include_uppercase,
        include_lowercase,
        include_numbers,
        include_special_characters,
        disallowed_chars,
        is_easy_to_remember
    )
    return jsonify({'password': pwd})


@app.route('/api/generate_fake_data', methods=['POST'])
@rate_limit(max_requests=20, window=60)
@handle_errors
def generate_fake_data():
    data = request.json
    generated_data = {}

    if not any(data.values()):
        return jsonify({'error': 'No se ha seleccionado ningún tipo de dato falso'}), 400
    
    user_language = data.get('userLanguage').replace('-', '_')
    try:
        fake = faker.Faker(user_language) 
    except:
        fake = faker.Faker('es_ES')

    if data.get('name'):
        generated_data['Nombre'] = fake.name()

    if data.get('address'):
        generated_data['Dirección'] = fake.street_address()

    if data.get('postalCode'):
        generated_data['Código Postal'] = fake.postcode()

    if data.get('phoneNumber'):
        generated_data['Teléfono'] = fake.phone_number()

    if data.get('dni'):
        random_number_dni = fake.numerify(text='#########')
        random_letter = random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        random_dni = f"{random_number_dni}{random_letter}"
        generated_data["DNI"] = random_dni

    if data.get('creditCard'):
        generated_data['Número de Tarjeta de Crédito'] = fake.credit_card_number()
        generated_data['Fecha de Vencimiento'] = fake.credit_card_expire()
        generated_data['CVV'] = fake.credit_card_security_code()
        generated_data['IBAN'] = fake.iban()

    if data.get('age'):
        age = fake.random_int(min=18, max=90)
        generated_data['Edad'] = age
        birthdate = datetime.now() - timedelta(days=age * 365)
        generated_data['Fecha de Nacimiento'] = birthdate.date().isoformat()

    return jsonify(generated_data)


@app.route('/api/generate_email', methods=['GET'])
@rate_limit(max_requests=10, window=60)
@handle_errors
def generate_email():
    try:
        # Generate a username and select a random domain
        username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        domain = random.choice(GUERRILLA_DOMAINS)
        
        # Get session ID from Guerrilla Mail
        session_response = requests.get(f"{GUERRILLA_API_URL}?f=get_email_address&ip=127.0.0.1")
        if session_response.status_code != 200:
            return jsonify({'error': 'No se pudo obtener la sesión para el correo temporal'}), 500
        
        session_data = session_response.json()
        sid_token = session_data.get('sid_token')
        
        if not sid_token:
            return jsonify({'error': 'No se pudo obtener la sesión para el correo temporal'}), 500
        
        # Set custom email address
        set_email_response = requests.get(
            f"{GUERRILLA_API_URL}?f=set_email_user&email_user={username}&sid_token={sid_token}"
        )
        
        if set_email_response.status_code != 200:
            return jsonify({'error': 'No se pudo establecer la dirección de correo temporal'}), 500
        
        email_data = set_email_response.json()
        email_address = email_data.get('email_addr')
        
        if not email_address:
            return jsonify({'error': 'No se pudo establecer la dirección de correo temporal'}), 500
        
        # Store the session ID for later use
        guerrilla_sessions[email_address] = sid_token
        
        # Add a welcome message to explain the service
        if email_address not in email_storage:
            email_storage[email_address] = [{
                'subject': 'Bienvenido a tu correo temporal',
                'from_addr': 'system@passwordgenerator.app',
                'body': (
                    f'Tu correo temporal {email_address} está listo para usar.\n\n'
                    f'Puedes utilizar esta dirección para registrarte en sitios web donde no quieres '
                    f'usar tu correo personal.\n\n'
                    f'Los mensajes recibidos aparecerán automáticamente en esta página. '
                    f'También puedes hacer clic en "Verificar Mensajes" para actualizar.\n\n'
                    f'Este correo temporal es real y puede recibir mensajes de cualquier remitente.'
                ),
                'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }]
        
        return jsonify({
            'email': email_address,
            'message': 'Correo temporal creado exitosamente'
        }), 200
    except Exception as e:
        logger.error(f"Error generating email: {str(e)}")
        return jsonify({'error': 'No se pudo generar el email temporal'}), 500

@app.route('/api/get_emails', methods=['GET'])
@rate_limit(max_requests=15, window=60)
@handle_errors
def get_emails():
    try:
        email_address = request.args.get('email')
        
        if not email_address:
            return jsonify({'error': 'El email es requerido'}), 400
        
        if '@' not in email_address or len(email_address) > 100:
            return jsonify({'error': 'Formato de email inválido'}), 400
        # Parse the email address to get username and domain
        try:
            username, domain = email_address.split('@')
        except ValueError:
            return jsonify({'error': 'Formato de email inválido'}), 400
        
        # Check if the email is one of our Guerrilla Mail addresses
        if domain in GUERRILLA_DOMAINS:
            # Get the session ID for this email
            sid_token = guerrilla_sessions.get(email_address)
            
            if not sid_token:
                # Return welcome message only
                messages = email_storage.get(email_address, [])
                return jsonify({'emails': messages}), 200
            
            # Check for new emails
            try:
                check_email_url = f"{GUERRILLA_API_URL}?f=check_email&sid_token={sid_token}"
                check_response = requests.get(check_email_url, timeout=10)
                
                if check_response.status_code != 200:
                    messages = email_storage.get(email_address, [])
                    return jsonify({'emails': messages}), 200
                
                email_list_url = f"{GUERRILLA_API_URL}?f=get_email_list&sid_token={sid_token}&offset=0"
                list_response = requests.get(email_list_url, timeout=10)
                
                if list_response.status_code != 200:
                    messages = email_storage.get(email_address, [])
                    return jsonify({'emails': messages}), 200
                
                email_list = list_response.json().get('list', [])
                messages = []
                
                for email in email_list:
                    email_id = email.get('mail_id')
                    if not email_id:
                        continue
                    
                    # Get email details
                    fetch_url = f"{GUERRILLA_API_URL}?f=fetch_email&sid_token={sid_token}&email_id={email_id}"
                    fetch_response = requests.get(fetch_url, timeout=10)
                    
                    if fetch_response.status_code != 200:
                        continue
                    
                    email_data = fetch_response.json()
                    
                    # Format the email and add it to our list
                    message_body = email_data.get('mail_body', '')
                    
                    # If the body is HTML, extract plain text
                    if message_body.startswith('<') and ('</html>' in message_body or '</body>' in message_body):
                        try:
                            soup = BeautifulSoup(message_body, 'html.parser')
                            message_body = soup.get_text()
                        except:
                            pass  # Keep original if parsing fails
                    
                    messages.append({
                        'subject': email_data.get('mail_subject', 'Sin asunto'),
                        'from_addr': email_data.get('mail_from', 'Unknown'),
                        'body': message_body,
                        'date': email_data.get('mail_date', datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                    })
                
                # Also include our welcome message if messages is empty
                if not messages:
                    welcome_message = email_storage.get(email_address, [])
                    messages.extend(welcome_message)
                
                return jsonify({'emails': messages}), 200
            
            except Exception as e:
                messages = email_storage.get(email_address, [])
                return jsonify({'emails': messages}), 200
        
        # For any other domain, just return stored messages
        messages = email_storage.get(email_address, [])
        return jsonify({'emails': messages}), 200
    
    except Exception as e:
        error_msg = f"Error in get_emails: {str(e)}"
        return jsonify({'error': error_msg}), 500
    
@app.route('/api/check_password_breach', methods=['POST'])
@rate_limit(max_requests=5, window=60)
@handle_errors
def check_password_breach():
    data = request.json
    password  = data.get('password', '')

    if not password:
        return jsonify({'error': 'La contraseña es requerida'}), 400
    
    if len(password) > 100:
        return jsonify({'error': 'La contraseña es demasiado larga (máximo 100 caracteres)'}), 400
    
    try:
        sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
        prefix = sha1_hash[:5]
        suffix = sha1_hash[5:]

        headers = {
            'User-Agent': 'Password-Generator-App/1.0',
            'Add-Padding': 'true'  # HIBP padding for additional privacy
        }

        url = f"https://api.pwnedpasswords.com/range/{prefix}"
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return jsonify({'error': 'Error al verificar la contraseña'}), 500
        
        hashes = response.text.splitlines()

        for line in hashes:
            hash_suffix, count = line.split(':')
            if hash_suffix == suffix:
                count = int(count)
                severity = 'high' if count > 100000 else 'medium' if count > 1000 else 'low'
                return jsonify({
                    'breached': True, 
                    'count': count,
                    'severity': severity,
                    'message': f'⚠️ Esta contraseña ha sido encontrada {count:,} veces en filtraciones de datos'
                }), 200
            
        return jsonify({
            'breached': False, 
            'count': 0,
            'severity': 'safe',
            'message': '✅ Esta contraseña no ha sido encontrada en filtraciones conocidas'
        }), 200
    except Exception as e:
        error_msg = f"Error checking password breach: {str(e)}"
        return jsonify({'error': error_msg}), 500
    

@app.route('/api/health', methods=['GET'])
@rate_limit(max_requests=60, window=60)
def health_check():
    return jsonify({
        'status' : 'healthy',
        'timestamp' : datetime.now().isoformat(),
        'version' : '1.0.0',
        'services' : {
            'password_generator' : 'operational',
            'email_service' : 'operational',
            'breach_check' : 'operational'
        }
    })

@app.route('/api/info', methods=['GET'])
@rate_limit(max_requests=30, window=60)
def get_api_info():
    total_requests = sum(len(times) for times in request_counts.values())
    active_ips = len([ip for ip, requests in request_counts.items() if requests])

    return jsonify({
        'total_requests': total_requests,
        'active_ips': active_ips,
        'rate_limits': {
            'password_generation': '30/min',
            'breach_checking': '5/min',
            'general': '10/min'
        }
    })

@app.before_request
def before_request():
    logger.info(f"{request.method} {request.path} from {request.remote_addr}")

@app.after_request
def after_request(response):
    # Add security headers for XSS protection, content type options, etc.
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    return response

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Método no permitido'}), 405

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
