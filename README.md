# password-generator

### Project Description

Project made with React and Python. This project is made for those websites that will ask you for all your information to enter the site. Now you can just use this project to create fake data, generate temporal emails to get the verification code or create a new random password for this site.

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

**Endpoint:** `/api/random_password`  
**Method:** `POST`  
Generates a random password based on the provided criteria.

### Request Password

**Endpoint:** `/request_password`  
**Method:** `POST`  
Requests a random password from the backend.

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

### Functions

- **Generate Fake Data:** Allows users to select various types of fake personal data they want to generate, such as name, address, postal code, phone number, credit card details, age, and DNI (national identity document). It sends the selected options to the backend API and displays the generated data.

- **Generate Email:** Allows users to create a temporal email once its created you can get the mails and check it.

- **Generate Password:** Allows users to select various types of options. This will be sended to the backend API, once the password is generated it will be displayed.
