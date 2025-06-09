import axios from 'axios';

// Add a base URL configuration to make it easier to switch between local and production
const API_BASE_URL = 'http://127.0.0.1:5000';

export const fetchPassword = async (length, includeUppercase, includeLowercase, includeNumbers, includeSpecialCharacters, disallowedChars = '', easyToRemember) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/request_password`, {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSpecialCharacters,
      disallowedChars: '',
      isEasyToRemember: easyToRemember
    });
    return response.data.password;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Fallo al conectarse con el servidor. Por favor pruebe de nuevo.");
    }
  }
};

export const fetchWebsitePassword = async (websiteRequirements) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/website_password`, websiteRequirements);
    return response.data.password;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Fallo al conectarse con el servidor. Por favor pruebe de nuevo.");
    }
  }
};

export const fetchFakeData = async (options) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/generate_fake_data`, options);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400){
        throw new Error(error.response.data.error)
    }else{
        throw new Error("Fallo al conectarse con el servidor. Por favor pruebe de nuevo.");
    }
  }
};

export const generateEmail = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/generate_email`);
    return {
      email: response.data.email,
      simulated: response.data.simulated === true,
      message: response.data.message
    };
  } catch (error) {
    if (error.response && error.response.status === 400){
      throw new Error(error.response.data.error)
    }else{
      throw new Error("Fallo al conectarse con el servidor. Por favor pruebe de nuevo.");
    }
  }
};

export const getEmails = async (email) => {
  try {
    console.log(`Fetching emails for: ${email}`);
    const response = await axios.get(`${API_BASE_URL}/api/get_emails?email=${email}`, { timeout: 15000 });
    console.log('Response:', response.data);
    
    // Return the emails array or empty array if not present
    return response.data.emails || [];
  } catch (error) {
    console.error('Error fetching emails:', error);
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      throw new Error("No se pudo conectar con el servidor. Verifique que el servidor backend esté en ejecución en http://127.0.0.1:5000");
    }
    
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(`Fallo al conectarse con el servidor: ${error.message}. Asegúrese de que el servidor está en ejecución.`);
    }
  }
};

export const checkPasswordBreach = async (password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/check_password_breach`, {
      password
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(`Error al verificar la contraseña: ${error.message}`);
    }
  }
};