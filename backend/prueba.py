from flask import Flask, jsonify, request
from flask_cors import CORS
import secrets
import string
import requests

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True)
