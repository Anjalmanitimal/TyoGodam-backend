import axios from 'axios';

const API_URL = 'http://localhost:5000/spaces'; // Your backend URL

export const getSpaces = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return [];
  }
};

export const createSpace = async (spaceData) => {
  try {
    const response = await axios.post(API_URL, spaceData);
    return response.data;
  } catch (error) {
    console.error('Error creating space:', error);
  }
};

export const updateSpace = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating space:', error);
  }
};

export const deleteSpace = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { message: 'Space deleted successfully' };
  } catch (error) {
    console.error('Error deleting space:', error);
  }
};
