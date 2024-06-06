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
      throw new Error("Failed to fetch password. Please try again.");
    }
  }
};

export const fetchFakeData = async (options) => {
  try {
    const response = await axios.post('http://localhost:5000/api/generate_fake_data', options);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch fake data. Please try again.");
  }
};
