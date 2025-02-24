'use client';
import { useState } from 'react';
import Header from '../components/Header';

export default function ProductsPage() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    specifications: '',
    features: '',
    imageUrl: ''
  });
  const [status, setStatus] = useState({ success: '', error: '' });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setProduct({
      name: '',
      description: '',
      price: 0,
      specifications: '',
      features: '',
      imageUrl: ''
    });
    setStatus({ success: '', error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ success: '', error: '' });

    try {
      if (product.price < 0) {
        throw new Error('Price cannot be negative');
      }

      const response = await fetch('http://localhost:5000/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setStatus({ success: result.message, error: '' });
      resetForm();
    } catch (err) {
      setStatus({ success: '', error: err.message || 'Failed to update product' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600 mt-2">
            Enhance your e-commerce or restaurant website with AI-powered product management
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-4 text-white">
                <h2 className="text-xl font-medium">Add or Update Product</h2>
                <p className="text-sm text-blue-100">Enter product details to manage your inventory</p>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                        className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={product.description}
                      onChange={(e) => setProduct({ ...product, description: e.target.value })}
                      className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      value={product.imageUrl}
                      onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
                      className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">
                        Specifications
                      </label>
                      <textarea
                        id="specifications"
                        value={product.specifications}
                        onChange={(e) => setProduct({ ...product, specifications: e.target.value })}
                        className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
                        Features
                      </label>
                      <textarea
                        id="features"
                        value={product.features}
                        onChange={(e) => setProduct({ ...product, features: e.target.value })}
                        className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
                    >
                      {isLoading ? 'Processing...' : 'Update Product'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="bg-blue-600 p-4 text-white">
                <h2 className="text-xl font-medium">AI Features</h2>
                <p className="text-sm text-blue-100">WebAI enhances your product management</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                      ✨
                    </div>
                    <div>
                      <p className="font-medium">Automatic Optimization</p>
                      <p className="text-sm text-gray-600">AI optimizes descriptions for search engines</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                      🔍
                    </div>
                    <div>
                      <p className="font-medium">Smart Classification</p>
                      <p className="text-sm text-gray-600">Products are automatically categorized</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                      📊
                    </div>
                    <div>
                      <p className="font-medium">SEO Recommendations</p>
                      <p className="text-sm text-gray-600">Get smart suggestions to improve visibility</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Status Messages */}
            {status.success && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-green-500">
                <div className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        {status.success}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status.error && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-red-500">
                <div className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {status.error}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <div className="text-center text-xs text-gray-500 py-4">
        Powered by WebAI • Your Restaurant/E-Commerce Assistant
      </div>
    </div>
  );
}