
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Admin from "../components/Admin_pannel";

export default function DescriptionPage() {
  // State management
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    source: "direct_input"
  });

  // Fetch all descriptions on page load
  useEffect(() => {
    fetchDescriptions();
  }, []);

  // Fetch all descriptions
  const fetchDescriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/view-all-descriptions");
      
      // Add unique client-side IDs if backend doesn't provide them
      const processedDescriptions = (response.data.descriptions || []).map((doc, index) => {
        return {
          ...doc,
          clientId: `client-id-${index}-${Date.now()}` // Generate a unique client ID
        };
      });
      
      setDescriptions(processedDescriptions);
      
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch descriptions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.text.trim().length < 50) {
      toast.error("Description must be at least 50 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/add-description", formData);
      
      toast.success("Description added successfully");
      resetForm();
      fetchDescriptions();
      
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (docId) => {
    if (!confirm("Are you sure you want to delete this description?")) {
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post("http://localhost:5000/remove-description", { doc_id: docId });
      
      toast.success("Description removed successfully");
      fetchDescriptions();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove description");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      text: "",
      source: "direct_input"
    });
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <>
    <Admin/>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Description Management
        </h1>
        <p className="text-gray-600 mb-8">
          Enhance your e-commerce or restaurant website with AI-powered description management
        </p>
        
        {/* Add Description Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-blue-500 text-white p-4">
            <h2 className="text-lg font-semibold">Add New Description</h2>
            <p className="text-sm text-blue-100">Enter description details to add to your inventory</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Description Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Source of the description"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                  Description Content
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description content here..."
                  rows="6"
                  required
                ></textarea>
                <div className="text-xs text-gray-500 mt-1">
                  Character count: {formData.text.length} / 50 minimum
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Add Description"}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* AI Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 text-white p-4">
              <h2 className="text-lg font-semibold">AI Features</h2>
              <p className="text-sm text-blue-100">WebAI enhances your description management</p>
            </div>
            <div className="p-4">
              <div className="flex items-start mb-4">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <span className="text-yellow-600 text-lg">✨</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Automatic Optimization</h3>
                  <p className="text-sm text-gray-600">AI optimizes descriptions for search engines</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <span className="text-blue-600 text-lg">🔍</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Smart Classification</h3>
                  <p className="text-sm text-gray-600">Descriptions are automatically categorized</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <span className="text-green-600 text-lg">📊</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">SEO Recommendations</h3>
                  <p className="text-sm text-gray-600">Get smart suggestions to improve visibility</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description Statistics */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-2">
            <div className="bg-blue-500 text-white p-4">
              <h2 className="text-lg font-semibold">Description Statistics</h2>
              <p className="text-sm text-blue-100">Overview of your description catalog</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm text-blue-800 mb-1">Total Descriptions</h3>
                  <p className="text-3xl font-bold text-blue-900">{descriptions.length}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm text-green-800 mb-1">Average Length</h3>
                  <p className="text-3xl font-bold text-green-900">
                    {descriptions.length > 0 
                      ? Math.round(descriptions.reduce((sum, doc) => sum + (doc.content?.length || 0), 0) / descriptions.length) 
                      : 0}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm text-purple-800 mb-1">Last Updated</h3>
                  <p className="text-lg font-bold text-purple-900">
                    {descriptions.length > 0 
                      ? formatDate(Math.max(...descriptions.map(doc => doc.metadata?.updated_at || 0)))
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description Inventory */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h2 className="text-lg font-semibold">Description Inventory</h2>
            <p className="text-sm text-blue-100">View and manage your description catalog</p>
          </div>
          
          <div className="p-4">
            {loading && descriptions.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-block animate-pulse">
                  <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
                </div>
                <p className="mt-4 text-gray-600">Loading descriptions...</p>
              </div>
            ) : descriptions.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500">No descriptions found. Add your first one!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {descriptions.map((doc) => (
                      <tr key={doc.clientId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">{(doc.metadata.title || "?")[0]}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doc.metadata.title || "Untitled"}</div>
                              <div className="text-sm text-gray-500">ID: {doc.doc_id || "No ID"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2">{doc.content}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{doc.metadata.source || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(doc.metadata.updated_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteDocument(doc.doc_id)}
                            className="text-red-600 hover:text-red-900"
                          >
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {descriptions.length} description(s)
              </div>
              <button
                onClick={fetchDescriptions}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Descriptions
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Description Management System © {new Date().getFullYear()}</p>
          <p className="mt-1">Built with React, Tailwind CSS, and Axios</p>
        </div>
      </div>
    </div>
    </>
  );
}