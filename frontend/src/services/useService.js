import { Axios } from '../axiosInstance';

export const userService = {
  async getProfile(userId) {
    try {
      const { data } = await Axios.get(`/users/${userId}/posts`);
      
      if (!data) {
        return { success: false, message: 'No data received' };
      }
      if (data.hasOwnProperty('success')) {
        return data;
      }
      
      return {
        success: true,
        user: data 
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  async getCurrentUser() {
    try {
      const { data } = await Axios.get('/users/me');
      return data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  
  async updateProfile(userData) {
    try {
      const { data } = await Axios.put('/users/me', userData);
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};
