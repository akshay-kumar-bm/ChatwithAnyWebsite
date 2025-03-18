'use client'
import { useState } from 'react'


import Header from '../components/Header'

export default function TextProcessorPage() {
  const [descText, setDescText] = useState('')
  const [productText, setProductText] = useState('')
  const [processing, setProcessing] = useState({
    desc: false,
    product: false,
  })
  const [processStatus, setProcessStatus] = useState({
    desc: '',
    product: '',
  })
  const [error, setError] = useState('')

  const validateText = (text, type) => {
    if (!text.trim()) {
      setProcessStatus((prev) => ({
        ...prev,
        [type]: 'Error: Text content cannot be empty',
      }))
      return false
    }
    // Check if text has a minimum length
    if (text.trim().length < 50) {
      setProcessStatus((prev) => ({
        ...prev,
        [type]: 'Error: Text content is too short (minimum 50 characters)',
      }))
      return false
    }
    return true
  }

  const handleProcessText = async (type) => {
    const text = type === 'desc' ? descText : productText
    
    if (!validateText(text, type)) {
      return
    }

    setProcessing((prev) => ({ ...prev, [type]: true }))
    setProcessStatus((prev) => ({ ...prev, [type]: '' }))

    try {
      const endpoint = type === 'desc' ? 'process-desc-text' : 'process-product-text'
      
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      setProcessStatus((prev) => ({
        ...prev,
        [type]: result.message || 'Processing completed successfully',
      }))
    } catch (err) {
      setProcessStatus((prev) => ({
        ...prev,
        [type]: `Error: ${err.message}`,
      }))
    } finally {
      setProcessing((prev) => ({ ...prev, [type]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-gray-900 mb-2">Direct Text Input</h1>
          <p className="text-gray-600">
            Enter text content directly to build a custom AI knowledge base
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description Text Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-normal text-gray-900">Description Content</h3>
              <button
                onClick={() => handleProcessText('desc')}
                disabled={processing.desc}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {processing.desc ? 'Processing...' : 'Process Content'}
              </button>
            </div>
            
            {processStatus.desc && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  processStatus.desc.startsWith('Error')
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-green-50 text-green-700 border border-green-100'
                }`}
              >
                {processStatus.desc}
              </div>
            )}
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter descriptive content about your company, services, etc.
              </label>
              <textarea
                value={descText}
                onChange={(e) => setDescText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-64"
                placeholder="Enter detailed information about your company, services, policies, etc."
              />
            </div>
            <div className="text-xs text-gray-500">
              This content will be processed and stored as descriptive knowledge about your business.
            </div>
          </div>

          {/* Product/Service Text Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-normal text-gray-900">Product/Service Content</h3>
              <button
                onClick={() => handleProcessText('product')}
                disabled={processing.product}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {processing.product ? 'Processing...' : 'Process Content'}
              </button>
            </div>
            
            {processStatus.product && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  processStatus.product.startsWith('Error')
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-green-50 text-green-700 border border-green-100'
                }`}
              >
                {processStatus.product}
              </div>
            )}
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter product or service details, features, specifications, etc.
              </label>
              <textarea
                value={productText}
                onChange={(e) => setProductText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-64"
                placeholder="Enter detailed information about your products/services, features, specifications, pricing, etc."
              />
            </div>
            <div className="text-xs text-gray-500">
              This content will be processed and stored as product/service knowledge for your AI.
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <a 
            href="/url-processor" 
            className="inline-block py-3 px-6 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Switch to URL Processing Mode
          </a>
        </div>
      </main>
    </div>
  )
}