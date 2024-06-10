import axios from 'axios';

export const fetchPassword = async (length, includeUppercase, includeLowercase, includeNumbers, includeSpecialCharacters) => {
  try {
    const response = await axios.post('http://localhost:5000/request_password', {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSpecialCharacters
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

export const fetchFakeData = async (options) => {
  try {
    const response = await axios.post('http://localhost:5000/api/generate_fake_data', options);
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
    const response = await axios.get('http://localhost:5000/api/generate_email');
    return response.data.email; 
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
    const response = await axios.get(`http://localhost:5000/api/get_emails?email=${email}`);
    return response.data.emails;
  } catch (error) {
    if (error.response && error.response.status === 400){
      throw new Error(error.response.data.error)
    }else{
      throw new Error("Fallo al conectarse con el servidor. Por favor pruebe de nuevo.");
    }
  }
};