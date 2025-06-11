# password-generator

### Project Description

Project made with React and Python. This project is made for those websites that will ask you for all your information to enter the site. Now you can just use this project to create fake data, generate temporal emails to get the verification code or create a new random password for this site.

## Features

- **Generate Random Passwords**: Create secure random passwords with customizable options
- **Password Strength Meter**: Visual indicator of password strength
- **Copy to Clipboard**: Easily copy generated passwords with one click
- **Password History**: Keep track of previously generated passwords
- **Save Passwords**: Save your favorite passwords with custom labels
- **Website-Specific Passwords**: Generate passwords that meet specific website requirements
- **Generate Fake Data**: Create realistic fake personal data
- **Temporary Email**: Generate disposable email addresses to receive verification codes

# Backend

## How to install

To set up and run this Flask backend:

1. **Clone the repository:**

    Make sure you have cloned the repository.

2. **Navigate to the project directory:**

    ```bash
    cd backend
    ```

3. **Create and activate a virtual environment:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  
    ```

4. **Install the required dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

5. **Run the application:**

    ```bash
    python server.py
    ```

    The application will start running at `http://localhost:5000`.

## Functions

### Generate Random Password

### Request Password

**Endpoint:** `/request_password`  
**Method:** `POST`  
Requests a random password from the backend.

### Generate Website Password

**Endpoint:** `/api/website_password`  
**Method:** `POST`  
Generates a password that meets specific website requirements.

### Generate Fake Data

**Endpoint:** `/api/generate_fake_data`  
**Method:** `POST`  
Generates fake data based on the provided criteria and user language.

### Generate Temporary Email

**Endpoint:** `/api/generate_email`  
**Method:** `GET`  
Generates a temporary email address.

### Get Emails

**Endpoint:** `/api/get_emails`  
**Method:** `GET`  
Retrieves emails from the provided temporary email address.

## Frontend

### How to Install

To install and run the frontend:

1. **Clone the repository:**

    Make sure you have cloned the repository.

2. **Navigate to the project directory:**

    ```bash
    cd frontend
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Run the application:**

    ```bash
    npm run dev
    ```

    The application will start running at `http://localhost:5173`.

### Features

- **Generate Password:** Create random passwords with customizable options including length, character types, and special requirements.
  - Password strength meter indicates how secure your generated password is
  - Copy to clipboard functionality for easy use
  - Password history tracking
  - Save favorite passwords with custom labels
  - Generate passwords that meet specific website requirements

- **Generate Fake Data:** Select various types of fake personal data to generate, such as name, address, postal code, phone number, credit card details, age, and DNI (national identity document).

- **Generate Email:** Create a temporary email address to receive messages without using your real email. View messages received at this address directly in the application.


add this to the manifest.json

    "icons": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    },