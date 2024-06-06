from flask import Flask, jsonify, request
from flask_cors import CORS
import secrets
import string
import requests
import faker

app = Flask(__name__)
CORS(app)

fake = faker.Faker()

def generate_password(length, include_uppercase, include_lowercase, include_numbers, include_special_characters):
    characters = ''
    if include_uppercase:
        characters += string.ascii_uppercase
    if include_lowercase:
        characters += string.ascii_lowercase
    if include_numbers:
        characters += string.digits
    if include_special_characters:
        characters += string.punctuation

    if not characters:
        return None

    return ''.join(secrets.choice(characters) for _ in range(length))

@app.route('/api/random_password', methods=['POST'])
def random_password():
    data = request.json
    length = data.get('length', 16)
    include_uppercase = data.get('includeUppercase', False)
    include_lowercase = data.get('includeLowercase', False)
    include_numbers = data.get('includeNumbers', False)
    include_special_characters = data.get('includeSpecialCharacters', False)

    if not (include_uppercase or include_lowercase or include_numbers or include_special_characters):
        return jsonify({'error': 'At least one character type must be selected'}), 400

    random_password = generate_password(length, include_uppercase, include_lowercase, include_numbers, include_special_characters)
    
    if random_password is None:
        return jsonify({'error': 'Failed to generate password'}), 400

    return jsonify({'password': random_password})

@app.route('/request_password', methods=['POST'])
def request_password():
    response = requests.post('http://localhost:5000/api/random_password', json=request.json)

    if response.status_code == 200:
        data = response.json()
        return jsonify({'password': data['password']})
    else:
        error_message = response.json().get('error', 'Failed to get password')
        return jsonify({'error': error_message}), response.status_code

@app.route('/api/generate_fake_data', methods=['POST'])
def generate_fake_data():
    data = request.json
    generated_data = {}

    if data.get('name'):
        generated_data['Nombre'] = fake.name()

    if data.get('address'):
        generated_data['Dirección'] = fake.address()

    if data.get('postalCode'):
        generated_data['Código Postal'] = fake.zipcode()

    if data.get('phoneNumber'):
        generated_data['Teléfono'] = fake.phone_number()

    if data.get('creditCard'):
        generated_data['Número de Tarjeta de Crédito'] = fake.credit_card_number()
        generated_data['Fecha de Vencimiento'] = fake.credit_card_expire()
        generated_data['CVV'] = fake.credit_card_security_code()

    if data.get('birthdate'):
        generated_data['Fecha de Nacimiento'] = fake.date_of_birth().isoformat()

    if data.get('age'):
        generated_data['Edad'] = fake.random_int(min=18, max=90)

    if data.get('dni'):
        generated_data['DNI'] = fake.random_number(digits=8)

    return jsonify(generated_data)

if __name__ == '__main__':
    app.run(debug=True)
