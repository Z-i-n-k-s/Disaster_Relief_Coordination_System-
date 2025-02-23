import axios from "axios";

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    
    // Main axios client with interceptors
    this.client = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Separate axios instance for refreshing token (no interceptors)
    this.refreshClient = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor: Attach tokens and attempt refresh if access token is missing
    this.client.interceptors.request.use(
      async (config) => {
        let accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        // If no access token is available but a refresh token exists, try to refresh it.
        if (!accessToken && refreshToken) {
          try {
            accessToken = await this.refreshAccessToken();
          } catch (err) {
            // If refresh fails, reject the request with an error
            return Promise.reject(err);
          }
        }

        // Attach the access token if available.
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Always attach the refresh token if available.
        if (refreshToken) {
          config.headers["X-Refresh-Token"] = refreshToken;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor as a fallback: if a 401 is received, try refreshing once.
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear tokens and propagate the error.
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Call the dedicated refresh endpoint using the separate axios instance.
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("Refresh token not available");
    }
    try {
      const response = await this.refreshClient.get("api/token/refresh", {
        headers: { "X-Refresh-Token": refreshToken },
      });
      const newAccessToken = response.data.access_token;
      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.client.post("api/register", userData);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }

  async login(credentials) {
    try {
      console.log(credentials)
      const response = await this.client.post("api/login", credentials);
      console.log("res from login", response);

      // Store tokens after a successful login.
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async logout() {
    try {
      const response = await this.client.post("api/logout");
      console.log("response logout",response.data)
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    } 
  }

  async submitDonation(donationData) {
    try {
      console.log("donation data ",donationData)
      const response = await this.client.post("api/donations", donationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getReliefCenters() {
    try {
      const response = await this.client.get("api/relief-centers");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  async  createReliefCenter(reliefCenterData) {
    try {
      console.log('add relife data',reliefCenterData)
      const response = await this.client.post("api/relief-centers/", reliefCenterData, );
      return response.data;
    } catch (error) {
      // Handle errors (e.g., validation errors from the backend)
      throw error.response ? error.response.data : error;
    }
  }

  async getUser() {
    try {
      const response = await this.client.get("api/users/currentUser");
      
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getUsersDonations() {
    try {
      const response = await this.client.get("api/donations/history");
      
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAllUsers() {
    try {
      const response = await this.client.get("api/users");
      console.log("all users",response.data)
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAllReliefCenters() {
    try {
      const response = await this.client.get("api/relief-centers");
      console.log("all users",response.data)
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async updateUser(id, userData) {
    console.log("update data ",userData)
    try {
      const response = await this.client.put(`api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  
  async deleteUser(id) {
    try {
      const response = await this.client.delete(`api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  
  
  
}

const apiClient = new ApiClient("http://127.0.0.1:8000");
export default apiClient;
