'use client';
import { useState } from 'react';
import Header from '../components/Header';

export default function UrlProcessorPage() {
  const [url, setUrl] = useState('');
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState({
    desc: false,
    product: false
  });
  const [processStatus, setProcessStatus] = useState({
    desc: '',
    product: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/extract-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setClassification(result);
      
      // Process URLs in parallel
      await Promise.all([
        fetch('http://localhost:5000/process-desc-urls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: result.desc_urls })
        }),
        fetch('http://localhost:5000/process-product-urls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: result.product_service_urls })
        })
      ]);
    } catch (err) {
      setError(err.message || 'Failed to process URL');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessUrls = async (type) => {
    setProcessing(prev => ({ ...prev, [type]: true }));
    setProcessStatus(prev => ({ ...prev, [type]: '' }));
    
    try {
      const endpoint = type === 'desc' ? 'process-desc-urls' : 'process-product-urls';
      const urls = type === 'desc' ? classification.desc_urls : classification.product_service_urls;
      
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setProcessStatus(prev => ({ 
        ...prev, 
        [type]: result.message || 'Processing completed successfully' 
      }));
    } catch (err) {
      setProcessStatus(prev => ({ 
        ...prev, 
        [type]: `Error: ${err.message}` 
      }));
    } finally {
      setProcessing(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-160px)]">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Website Analysis</h2>
              <p className="text-gray-600 mb-6">
                Enter your website URL below to analyze its content and structure using our AI.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://your-website.com"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Analyze Website'}
                </button>
              </form>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {classification && (
              <div className="bg-white rounded-lg shadow-lg divide-y">
                {/* Description URLs Section */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Description URLs</h3>
                    <button
                      onClick={() => handleProcessUrls('desc')}
                      disabled={processing.desc || !classification.desc_urls.length}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processing.desc ? 'Processing...' : 'Process URLs'}
                    </button>
                  </div>
                  {processStatus.desc && (
                    <div className={`p-3 rounded-lg mb-4 ${
                      processStatus.desc.startsWith('Error') 
                        ? 'bg-red-50 text-red-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {processStatus.desc}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {classification.desc_urls.map((url, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="text-blue-600">•</span>
                        <a href={url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline truncate">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Product/Service URLs Section */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Product/Service URLs</h3>
                    <button
                      onClick={() => handleProcessUrls('product')}
                      disabled={processing.product || !classification.product_service_urls.length}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processing.product ? 'Processing...' : 'Process URLs'}
                    </button>
                  </div>
                  {processStatus.product && (
                    <div className={`p-3 rounded-lg mb-4 ${
                      processStatus.product.startsWith('Error') 
                        ? 'bg-red-50 text-red-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {processStatus.product}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {classification.product_service_urls.map((url, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="text-blue-600">•</span>
                        <a href={url} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline truncate">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}