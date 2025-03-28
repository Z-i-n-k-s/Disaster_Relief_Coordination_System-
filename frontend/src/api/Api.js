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
      console.log(credentials);
      const response = await this.client.post("api/login", credentials);
      console.log("res from login", response);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async logout() {
    try {
      const response = await this.client.post("api/logout");
      console.log("response logout", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async submitDonation(donationData) {
    try {
      console.log("donation data ", donationData);
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
  async createReliefCenter(reliefCenterData) {
    try {
      console.log("add relife data", reliefCenterData);
      const response = await this.client.post(
        "api/relief-centers/",
        reliefCenterData
      );
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

  async getAllReliefCenters() {
    try {
      const response = await this.client.get("api/relief-centers");
      console.log("all users", response.data);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async createAffectedArea(areaData) {
    try {
      console.log("new area ", areaData);
      const response = await this.client.post("api/affected-areas", areaData);

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAffectedArea() {
    try {
      const response = await this.client.get("api/affected-areas");
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async updateAffectedArea(id, areaData) {
    try {
      const response = await this.client.put(
        `api/affected-areas/${id}`,
        areaData
      );
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async deleteAffectedArea(id) {
    try {
      const response = await this.client.delete(`api/affected-areas/${id}`);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAllUsers() {
    try {
      const response = await this.client.get("api/users");
      console.log("all users", response.data);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAllVolunteers() {
    try {
      const response = await this.client.get("api/users/volunteers");
      console.log("all volunteers", response.data);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async updateUser(id, userData) {
    console.log("update data ", userData);
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

  async createAidRequest(reqData) {
    try {
      console.log("new req ", reqData);
      const response = await this.client.post("api/aid-requests", reqData);

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async createAidResource(reqData, preparationId) {
    try {
      console.log("new req ", reqData);
      const response = await this.client.post(
        `api/aid-preparation/${preparationId}/resources`,
        reqData
      );

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }

  async getUsersAidRequest(id) {
    try {
      //  console.log('new req ',reqData)
      const response = await this.client.get(`api/aid-requests/user/${id}`);
      //  console.log(response);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAllAidRequest() {
    try {
      //  console.log('new req ',reqData)
      const response = await this.client.get(`api/aid-requests`);
      // console.log(response);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async updateAidRequestStatus(id, status) {
    try {
      console.log("new req ", id, status);
      // Send the status as an object { status: "value" }
      const response = await this.client.patch(
        `api/aid-requests/${id}/status`,
        { status }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async updateAidRequestResponseTime(id, date) {
    try {
      console.log("new req ", id, date);
      // Pass the date as an object { date: "YYYY-MM-DD HH:mm:ss" }
      const response = await this.client.patch(
        `api/aid-requests/${id}/response-time`,
        { date }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  
  async createAidPrep(reqData) {
    try {
      console.log("new req ", reqData);
      const response = await this.client.post("api/aid-preparation", reqData);

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async createAidPrepVolunteer(preparationId, VolunteerID) {
    try {
      console.log("prep vol req ", preparationId, VolunteerID);
      const response = await this.client.post(
        `api/aid-preparation/${preparationId}/volunteers`,
        {
          VolunteerID: VolunteerID,
        }
      );

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAidResource(preparationId) {
    try {
      // console.log('new req ',reqData)
      const response = await this.client.get(
        `api/aid-preparation/${preparationId}/resources`
      );

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAidPrepVolunteer(preparationId) {
    try {
      //  console.log('prep vol req ',preparationId,VolunteerID)
      const response = await this.client.get(
        `api/aid-preparation/${preparationId}/volunteers`
      );

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAidPrepStatus(preparationId) {
    try {
      //  console.log('prep vol req ',preparationId,VolunteerID)
      const response = await this.client.get(
        `api/aid-preparation/${preparationId}/status`
      );

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getAidPrepDetails() {
    try {
      //  console.log('prep vol req ',preparationId,VolunteerID)
      const response = await this.client.get(
        `api/aid-preparation/full-details`
      );

      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  // Update times for a specific Aid Preparation entry by preparationId
  async updateAidPrepTimes(preparationId, timesData) {
    try {
      const response = await this.client.patch(
        `api/aid-preparation/${preparationId}/times`,
        timesData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getVolunteersAidPrepTasks(volunteerId) {
    try {
      //  console.log('prep vol req ',preparationId,VolunteerID)
      const response = await this.client.get(
        `api/volunteers/${volunteerId}/aid-prep-tasks`
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async getVolunteersResTasks(volunteerId) {
    try {
      //  console.log('prep vol req ',preparationId,VolunteerID)
      const response = await this.client.get(
        `api/volunteers/${volunteerId}/rescue-tracking-tasks`
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
  async updateAidPrepStatus(preparationId, reqData) {
    try {
      //  console.log('prep vol req ',preparationId,VolunteerID)
      const response = await this.client.patch(
        `api/aid-preparation/${preparationId}/status`,
        reqData
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }

  // Create a new Rescue Tracking entry
  async createRescueTracking(rescueData) {
    try {
      const response = await this.client.post(
        "api/rescue-tracking",
        rescueData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Update an existing Rescue Tracking entry by ID
  async updateRescueTracking(id, updateData) {
    try {
      const response = await this.client.patch(
        `api/rescue-tracking/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get details of a Rescue Tracking entry by ID
  async getRescueTracking(id) {
    try {
      const response = await this.client.get(`api/rescue-tracking/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  async getTracking() {
    try {
      const response = await this.client.get(`api/tracking`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  async updateRescueTracking(id,updateData) {
    try {
      const response = await this.client.patch(`api/rescue-tracking/${id}`,updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get all Rescue Tracking Volunteers
  async getRescueTrackingVolunteers() {
    try {
      const response = await this.client.get("api/rescue-tracking-volunteers");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Create a new Rescue Tracking Volunteer entry
  async createRescueTrackingVolunteer(volunteerData) {
    try {
      const response = await this.client.post(
        "api/rescue-tracking-volunteers",
        volunteerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

const apiClient = new ApiClient("http://127.0.0.1:8000");
export default apiClient;
