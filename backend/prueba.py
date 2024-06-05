from flask import Flask, jsonify, request
from flask_cors import CORS
import secrets
import requests
app = Flask(__name__)
CORS(app)

@app.route('/api/random_password', methods=['POST'])
def random_password():
    # Generate a random password using the secrets module
    random_password = secrets.token_urlsafe(16)

    return jsonify({'password': random_password})

@app.route('/request_password', methods=['POST'])
def request_password():
    response = requests.post('http://localhost:5000/api/random_password')

    if response.status_code == 200:
        data = response.json()
        return jsonify({'password': data['password']})
    else:
        return jsonify({'error': 'Failed to get password'})

if __name__ == '__main__':
    app.run(debug=True)