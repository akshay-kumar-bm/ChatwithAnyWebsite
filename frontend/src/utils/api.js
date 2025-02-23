// src/app/utils/api.js

const API_BASE_URL = 'http://localhost:5000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Network response was not ok');
  }
  return response.json();
};

export const extractUrls = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/extract-urls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to extract URLs. Please try again.');
  }
};

export const processDescUrls = async (urls) => {
  try {
    const response = await fetch(`${API_BASE_URL}/process-desc-urls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to process description URLs. Please try again.');
  }
};

export const processProductUrls = async (urls) => {
  try {
    const response = await fetch(`${API_BASE_URL}/process-product-urls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to process product URLs. Please try again.');
  }
};

export const updateProduct = async (product) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to update product. Please try again.');
  }
};

export const sendChatMessage = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};