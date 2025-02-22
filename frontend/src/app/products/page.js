'use client';

// src/app/products/page.js
import { useState } from 'react';
import { updateProduct, processProductUrls } from '@/utils/api';

export default function Products() {
  const [urls, setUrls] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    specifications: '',
    features: ''
  });

  const handleUrlsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const urlList = urls.split('\n').filter(url => url.trim());
      const response = await processProductUrls(urlList);
      setProducts(response.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateProduct({
        ...newProduct,
        price: parseFloat(newProduct.price)
      });
      setProducts([...products, response.product]);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        specifications: '',
        features: ''
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Product Management</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Process Product URLs</h2>
          <form onSubmit={handleUrlsSubmit}>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="Enter URLs (one per line)"
              className="w-full h-32 p-3 border rounded-lg mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              Process URLs
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              placeholder="Product Name"
              className="w-full p-3 border rounded-lg"
            />
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              placeholder="Description"
              className="w-full h-32 p-3 border rounded-lg"
            />
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              placeholder="Price"
              className="w-full p-3 border rounded-lg"
            />
            <textarea
              value={newProduct.specifications}
              onChange={(e) => setNewProduct({...newProduct, specifications: e.target.value})}
              placeholder="Specifications"
              className="w-full h-32 p-3 border rounded-lg"
            />
            <textarea
              value={newProduct.features}
              onChange={(e) => setNewProduct({...newProduct, features: e.target.value})}
              placeholder="Features"
              className="w-full h-32 p-3 border rounded-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300"
            >
              Add Product
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Products List</h2>
          <div className="grid gap-6">
            {products.map((product, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="font-bold mt-2">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}