import axios from 'axios';

// Use environment variable for API URL
const API_URL = 'http://localhost:8001';

// Helper function to get the access token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Function to create axios instance with auth token
const createAxiosInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};

// Update a single product by ID
export const updateProduct = async (id: number, product_name: string, price: number) => {
  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.put(`/products/${id}`, { product_name, price });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};
// Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const token = response.data.access_token;
    const expirationTime = Date.now() + 40 * 60 * 1000; // 40 minutes from now

    // Store token and expiration time
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiration', expirationTime.toString());

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Check Task Status
export const taskStatus = async (taskId: number) => {
  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`/tasks/${taskId}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching task status:', error);
    throw error;
  }
};
//stores
export const fetchStores = async () => {
  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`/stores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};
// Register User
export const createUser = async (email: string, password: string,store_id:number) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password,store_id });
    return response.data;
  } catch (error) {
    console.error('User registration failed:', error);
    throw error;
  }
};

// Upload File
export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.post(`/product/batch`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};
// Fetch Products with Cursor-Based Pagination, Product Name, and Price Range Filter
export const fetchProducts = async (
  cursor: number | null,
  limit: number,
  min?: number,
  max?: number,
  productName?: string
) => {
  try {
    const axiosInstance = createAxiosInstance();
    const params: Record<string, string | number | null> = { cursor, limit };

    if (min !== undefined && max !== undefined && (min !== max || min !== 0 || min <= max)) {
      params.minPrice = min;
      params.maxPrice = max;
    }

    if (productName && productName.trim() !== '') {
      params.product_name = productName; // Send product name as a search filter
    }

    const response = await axiosInstance.get(`/products`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
