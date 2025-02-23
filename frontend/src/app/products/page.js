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
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold mb-6">Product Management</h1>
              <div className="mb-6">
                <p className="text-gray-600">
                  This demo showcases AI-powered product management capabilities. 
                  Add your product details below and see how our system processes and organizes the information.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={product.imageUrl}
                    onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
                    Specifications
                  </label>
                  <textarea
                    id="specifications"
                    value={product.specifications}
                    onChange={(e) => setProduct({ ...product, specifications: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700">
                    Features
                  </label>
                  <textarea
                    id="features"
                    value={product.features}
                    onChange={(e) => setProduct({ ...product, features: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? 'Updating...' : 'Update Product'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">AI Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 text-xl">✨</span>
                  <span className="text-gray-600">Automatic content optimization</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 text-xl">🔍</span>
                  <span className="text-gray-600">Smart category classification</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 text-xl">📊</span>
                  <span className="text-gray-600">SEO recommendations</span>
                </li>
              </ul>

              {status.success && (
                <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
                  {status.success}
                </div>
              )}

              {status.error && (
                <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
                  {status.error}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}