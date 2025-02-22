// src/app/utils/api.js

const API_BASE_URL = 'http://localhost:5000';

export const extractUrls = async (url) => {
  const response = await fetch(`${API_BASE_URL}/extract-urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  return response.json();
};

export const processDescUrls = async (urls) => {
  const response = await fetch(`${API_BASE_URL}/process-desc-urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls })
  });
  return response.json();
};

export const processProductUrls = async (urls) => {
  const response = await fetch(`${API_BASE_URL}/process-product-urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls })
  });
  return response.json();
};

export const updateProduct = async (product) => {
  const response = await fetch(`${API_BASE_URL}/update-product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  return response.json();
};

export const sendChatMessage = async (query) => {
  const response = await fetch(`${API_BASE_URL}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return response.json();
};