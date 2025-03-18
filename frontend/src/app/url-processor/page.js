'use client'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Admin from '../components/Admin_pannel';

// URL Item component that can be dragged
const DraggableUrlItem = ({ url, index, type, moveUrl, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'URL_ITEM',
    item: { url, index, sourceType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (

    <li
      ref={drag}
      className={`flex items-center p-3 mb-2 rounded-lg cursor-move transition-all ${
        isDragging ? 'opacity-50 bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-xs">
        ≡
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline truncate flex-grow"
        onClick={(e) => e.stopPropagation()}
      >
        {url}
      </a>
      <button 
        onClick={() => onDelete(url, type)}
        className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
        title="Delete URL"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </li>
  )
}

// URL Add Form component
const UrlAddForm = ({ type, onAddUrl }) => {
  const [newUrl, setNewUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Basic URL validation
    if (!newUrl) {
      setError('URL is required')
      return
    }

    try {
      // Check if it's a valid URL
      new URL(newUrl)
      onAddUrl(newUrl, type)
      setNewUrl('')
    } catch (err) {
      setError('Please enter a valid URL')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-start">
      <div className="flex-grow">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
    </form>
  )
}

// Droppable URL List container
const DroppableUrlList = ({
  type,
  urls,
  onDrop,
  onProcess,
  processing,
  processStatus,
  onDelete,
  onAddUrl,
  children,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'URL_ITEM',
    drop: (item) => onDrop(item.url, item.sourceType, type),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-normal text-gray-900">
          {type === 'desc' ? 'Description URLs' : 'Product/Service URLs'}
        </h3>
        <button
          onClick={() => onProcess(type)}
          disabled={processing || !urls.length}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {processing ? 'Processing...' : 'Process URLs'}
        </button>
      </div>
      {processStatus && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            processStatus.startsWith('Error')
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-green-50 text-green-700 border border-green-100'
          }`}
        >
          {processStatus}
        </div>
      )}
      <div
        ref={drop}
        className={`border rounded-xl p-4 min-h-48 transition-all ${
          isOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
        }`}
      >
        {urls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <div className="text-3xl mb-2">⟱</div>
            <p>Drop URLs here</p>
          </div>
        ) : (
          <ul className="space-y-1">{children}</ul>
        )}
      </div>
      
      {/* Add URL Form */}
      <UrlAddForm type={type} onAddUrl={onAddUrl} />
    </div>
  )
}

export default function UrlProcessorPage() {
  const [url, setUrl] = useState('')
  const [classification, setClassification] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState({
    desc: false,
    product: false,
  })
  const [processStatus, setProcessStatus] = useState({
    desc: '',
    product: '',
  })

  // Enhanced state for draggable URLs
  const [descUrls, setDescUrls] = useState([])
  const [productUrls, setProductUrls] = useState([])

  // Update local state when classification changes
  useEffect(() => {
    if (classification) {
      setDescUrls(classification.desc_urls)
      setProductUrls(classification.product_service_urls)
    }
  }, [classification])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/extract-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      console.log(result)

      setClassification(result)
    } catch (err) {
      setError(err.message || 'Failed to process URL')
    } finally {
      setLoading(false)
    }
  }

  const handleProcessUrls = async (type) => {
    setProcessing((prev) => ({ ...prev, [type]: true }))
    setProcessStatus((prev) => ({ ...prev, [type]: '' }))

    try {
      const endpoint =
        type === 'desc' ? 'process-desc-urls' : 'process-product-urls'
      const urls = type === 'desc' ? descUrls : productUrls

      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
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

  // Handle URL movement between lists
  const moveUrl = (url, sourceType, targetType) => {
    if (sourceType === targetType) return

    if (sourceType === 'desc' && targetType === 'product') {
      setDescUrls(descUrls.filter((item) => item !== url))
      setProductUrls([...productUrls, url])
    } else {
      setProductUrls(productUrls.filter((item) => item !== url))
      setDescUrls([...descUrls, url])
    }
  }

  // Handle URL deletion
  const handleDeleteUrl = (url, type) => {
    if (type === 'desc') {
      setDescUrls(descUrls.filter((item) => item !== url))
    } else {
      setProductUrls(productUrls.filter((item) => item !== url))
    }
  }

  // Handle URL addition
  const handleAddUrl = (url, type) => {
    if (type === 'desc') {
      if (!descUrls.includes(url)) {
        setDescUrls([...descUrls, url])
      }
    } else {
      if (!productUrls.includes(url)) {
        setProductUrls([...productUrls, url])
      }
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <Admin />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Website Analysis</h1>
            <p className="text-gray-600">Analyze your website content to build a custom AI knowledge base</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-240px)]">
            {/* Input Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-xl shadow-sm sticky top-24">
                <h2 className="text-xl font-medium mb-6">Enter Website URL</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      id="website-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://your-website.com"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Website'}
                  </button>
                </form>

                {classification && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-3">
                      Drag & Drop Instructions
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Drag URLs between the two sections to recategorize them</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Delete URLs by clicking the trash icon</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Add new URLs using the form below each section</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Process each section individually by clicking the "Process URLs" button</span>
                      </li>
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <a 
                    href="/text-processor" 
                    className="block text-center py-3 px-6 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Switch to Text Input Mode
                  </a>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-2">
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {classification ? (
                <div className="bg-white rounded-xl shadow-sm divide-y">
                  {/* Description URLs Section */}
                  <DroppableUrlList
                    type="desc"
                    urls={descUrls}
                    onDrop={moveUrl}
                    onProcess={handleProcessUrls}
                    processing={processing.desc}
                    processStatus={processStatus.desc}
                    onDelete={handleDeleteUrl}
                    onAddUrl={handleAddUrl}
                  >
                    {descUrls.map((url, i) => (
                      <DraggableUrlItem
                        key={i}
                        url={url}
                        index={i}
                        type="desc"
                        moveUrl={moveUrl}
                        onDelete={handleDeleteUrl}
                      />
                    ))}
                  </DroppableUrlList>

                  {/* Product/Service URLs Section */}
                  <DroppableUrlList
                    type="product"
                    urls={productUrls}
                    onDrop={moveUrl}
                    onProcess={handleProcessUrls}
                    processing={processing.product}
                    processStatus={processStatus.product}
                    onDelete={handleDeleteUrl}
                    onAddUrl={handleAddUrl}
                  >
                    {productUrls.map((url, i) => (
                      <DraggableUrlItem
                        key={i}
                        url={url}
                        index={i}
                        type="product"
                        moveUrl={moveUrl}
                        onDelete={handleDeleteUrl}
                      />
                    ))}
                  </DroppableUrlList>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center min-h-64">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No data yet</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Enter your website URL in the form and click "Analyze Website" to start the process.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  )
}