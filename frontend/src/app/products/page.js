'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Admin from '../components/Admin_pannel';

export default function ProductsPage() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    specifications: '',
    features: '',
    imageUrl: ''
  });
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ success: '', error: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsTableLoading(true);
    try {
      const response = await fetch('http://localhost:5000/view-all-products');
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products:', data.error);
        setStatus({ ...status, error: data.error || 'Failed to fetch products' });
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setStatus({ ...status, error: 'Error connecting to server' });
    } finally {
      setIsTableLoading(false);
    }
  };

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

      const response = await fetch('http://localhost:5000/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setStatus({ success: result.message, error: '' });
      resetForm();
      // Refresh the products list
      fetchProducts();
    } catch (err) {
      setStatus({ success: '', error: err.message || 'Failed to add product' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "₹{productName}"?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/remove-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId || '', name: productName })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatus({ success: `Successfully deleted "₹{productName}"`, error: '' });
        // Refresh the products list
        fetchProducts();
      } else {
        setStatus({ success: '', error: result.error || 'Failed to delete product' });
      }
    } catch (err) {
      setStatus({ success: '', error: err.message || 'Error connecting to server' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin />
      
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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="bg-blue-600 p-4 text-white">
                <h2 className="text-xl font-medium">Add New Product</h2>
                <p className="text-sm text-blue-100">Enter product details to add to your inventory</p>
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
                      {isLoading ? 'Processing...' : 'Add Product'}
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

            {/* Product Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-4 text-white">
                <h2 className="text-xl font-medium">Product Inventory</h2>
                <p className="text-sm text-blue-100">View and manage your product catalog</p>
              </div>
              
              <div className="p-6">
                {isTableLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No products found. Add your first product using the form above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((item, index) => (
                          <tr key={item.doc_id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {item.imageUrl ? (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "https://via.placeholder.com/40";
                                    }}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                    <span className="text-gray-500 text-sm">{item.name?.charAt(0)?.toUpperCase() || '?'}</span>
                                  </div>
                                )}
                                <div className="font-medium text-gray-900">{item.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-900">₹{parseFloat(item.price).toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-900 max-w-xs truncate">{item.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDelete(item.doc_id, item.name)}
                                className="text-red-600 hover:text-red-900 transition"
                                title="Delete product"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
            
            {/* Product Statistics */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-4 text-white">
                <h2 className="text-xl font-medium">Product Statistics</h2>
                <p className="text-sm text-blue-100">Overview of your product catalog</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Total Products</p>
                    <p className="text-2xl font-bold text-blue-800">{products.length}</p>
                  </div>
                  
                  {products.length > 0 && (
                    <>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">Average Price</p>
                        <p className="text-2xl font-bold text-green-800">
                          ₹{(products.reduce((sum, item) => sum + parseFloat(item.price || 0), 0) / products.length).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600 mb-1">Most Expensive</p>
                        <p className="text-2xl font-bold text-purple-800">
                          ₹{Math.max(...products.map(item => parseFloat(item.price || 0))).toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="text-center text-xs text-gray-500 py-4">
        Powered by WebAI • Your Restaurant/E-Commerce Assistant
      </div>
    </div>
  );
}