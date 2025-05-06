from flask import Flask, jsonify, request
from flask_cors import CORS
import secrets
import random
import string
import requests
import faker
from datetime import datetime, timedelta
from tempmail import EMail
from bs4 import BeautifulSoup
from wordfreq import top_n_list

app = Flask(__name__)
CORS(app)

fake = faker.Faker('es_ES')

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

@app.route('/api/random_password', methods=['POST'])
def random_password():
    data = request.json
    length = data.get('length', 16)
    include_uppercase = data.get('includeUppercase', False)
    include_lowercase = data.get('includeLowercase', False)
    include_numbers = data.get('includeNumbers', False)
    include_special_characters = data.get('includeSpecialCharacters', False)
    disallowed_chars = data.get('disallowedChars', '')
    is_easy_to_remember = data.get('isEasyToRemember', False)

    if not (include_uppercase or include_lowercase or include_numbers or include_special_characters or is_easy_to_remember):
        return jsonify({'error': 'Alguna opción tiene que ser seleccionada'}), 400

    random_password = generate_password(length, include_uppercase, include_lowercase, include_numbers, include_special_characters, disallowed_chars,is_easy_to_remember)
    print(f"Generated password: {random_password}")
    return jsonify({'password': random_password})

@app.route('/api/website_password', methods=['POST'])
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
def generate_email():
    try:
        email = EMail()
        return jsonify({'email': email.address}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/get_emails', methods=['GET'])
def get_emails():
    try:
        email_address = request.args.get('email')
        if not email_address:
            return jsonify({'error': 'El email es requerido'}), 400
        
        email = EMail(email_address)
        inbox = email.get_inbox()

        messages = []
        for msg_info in inbox:
            soup = BeautifulSoup(msg_info.message.body, 'html.parser')
            clean_body = soup.get_text()
            messages.append({
                'subject': msg_info.subject,
                'from_addr': msg_info.from_addr,
                'body': clean_body,
                'date': msg_info.date
            })
        
        return jsonify({'emails': messages}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
