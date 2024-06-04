from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/greet', methods=['POST'])
def greet():
    data = request.get_json()
    name = data.get('name', 'World')
    greeting = f'Hello, {name}!'
    return jsonify({'greeting': greeting})

if __name__ == '__main__':
    app.run(debug=True)
