'use client'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// URL Item component that can be dragged
const DraggableUrlItem = ({ url, index, type, moveUrl }) => {
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
      className={`flex items-center space-x-2 p-2 rounded-lg cursor-move ${
        isDragging ? 'opacity-50 bg-gray-100' : ''
      }`}
    >
      <span className="text-blue-600">•</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline truncate"
        onClick={(e) => e.stopPropagation()}
      >
        {url}
      </a>
    </li>
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
        <h3 className="text-lg font-semibold">
          {type === 'desc' ? 'Description URLs' : 'Product/Service URLs'}
        </h3>
        <button
          onClick={() => onProcess(type)}
          disabled={processing || !urls.length}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Process URLs'}
        </button>
      </div>
      {processStatus && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            processStatus.startsWith('Error')
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {processStatus}
        </div>
      )}
      <div
        ref={drop}
        className={`border-2 rounded-lg p-2 min-h-32 ${
          isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
        }`}
      >
        {urls.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Drop URLs here</p>
        ) : (
          <ul className="space-y-2">{children}</ul>
        )}
      </div>
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-160px)]">
            {/* Input Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Website Analysis</h2>
                <p className="text-gray-600 mb-6">
                  Enter your website URL below to analyze its content and
                  structure using our AI.
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

                {classification && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Drag & Drop Instructions
                    </h3>
                    <p className="text-sm text-blue-600">
                      You can drag URLs between the Description and
                      Product/Service sections. Click and hold to drag, then
                      release to drop.
                    </p>
                  </div>
                )}
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
                  <DroppableUrlList
                    type="desc"
                    urls={descUrls}
                    onDrop={moveUrl}
                    onProcess={handleProcessUrls}
                    processing={processing.desc}
                    processStatus={processStatus.desc}
                  >
                    {descUrls.map((url, i) => (
                      <DraggableUrlItem
                        key={i}
                        url={url}
                        index={i}
                        type="desc"
                        moveUrl={moveUrl}
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
                  >
                    {productUrls.map((url, i) => (
                      <DraggableUrlItem
                        key={i}
                        url={url}
                        index={i}
                        type="product"
                        moveUrl={moveUrl}
                      />
                    ))}
                  </DroppableUrlList>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  )
}
