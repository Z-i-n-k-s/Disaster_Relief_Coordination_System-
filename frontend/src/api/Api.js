import axios from 'axios';

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

 

  async register(userData) {
    try {
      const response = await this.client.post('api/register', userData);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }

  async login(credentials) {
    try {
      const response = await this.client.post('api/login', credentials);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async logout() {
    try {
      const response = await this.client.get('api/logout');
     
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

async submitDonation(donationData) {
    try {
      const response = await this.client.post('api/donations', donationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}
// Exporting an instance of the client
const apiClient = new ApiClient("http://127.0.0.1:8000");
export default apiClient;
