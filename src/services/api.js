// src/services/api.js
import axios from 'axios';

const API_KEY = '88a87724f6345a87bc9ebc6ca811fb84';
const API_BASE_URL = 'https://financialdata.net/api/v1';
const JSON_SERVER_URL = 'http://localhost:3001';

// Stock data functions
export const searchStock = async (symbol) => {
  try {
    // Use the stock-prices endpoint with the user's symbol
    const url = `${API_BASE_URL}/stock-prices?identifier=${symbol}&key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error searching for stock:', error);
    throw error;
  }
};

export const getStockDetail = async (symbol) => {
  try {
    // Same endpoint but potentially with different parameters
    const url = `${API_BASE_URL}/stock-prices?identifier=${symbol}&key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting stock details:', error);
    throw error;
  }
};


// Favorites and Portfolio functions
export const getFavorites = async () => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/favorites`);
    return response.data;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const getFavoriteBySymbol = async (symbol) => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/favorites?symbol=${symbol}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error getting favorite by symbol:', error);
    throw error;
  }
};

export const addToFavorites = async (stockData) => {
  try {
    const response = await axios.post(`${JSON_SERVER_URL}/favorites`, stockData);
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const updateFavorite = async (stockData) => {
  try {
    const response = await axios.put(`${JSON_SERVER_URL}/favorites/${stockData.id}`, stockData);
    return response.data;
  } catch (error) {
    console.error('Error updating favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (id) => {
  try {
    await axios.delete(`${JSON_SERVER_URL}/favorites/${id}`);
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const getPortfolio = async () => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/portfolio`);
    return response.data;
  } catch (error) {
    console.error('Error getting portfolio:', error);
    throw error;
  }
};