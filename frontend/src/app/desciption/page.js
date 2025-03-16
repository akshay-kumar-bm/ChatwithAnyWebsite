"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Description Documents Management
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Add New Description
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Document Title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                  Description Content <span className="text-xs text-gray-500">(min. 50 characters)</span>
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-40"
                  placeholder="Enter description content here..."
                  rows="10"
                  required
                ></textarea>
                <div className="text-xs text-gray-500 mt-1">
                  Character count: {formData.text.length} / 50 minimum
                </div>
              </div>
              
              <div className="mb-4">
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
              
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Add Description"}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
          
          {/* Description List Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Descriptions</h2>
            
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
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {descriptions.map((doc) => (
                  <div 
                    key={doc.clientId}
                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg text-gray-800">{doc.metadata.title || "Untitled"}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteDocument(doc.doc_id)}
                          className="p-1 text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{doc.content}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        ID: {doc.doc_id || "No ID"}
                      </span>
                      <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded">
                        Source: {doc.metadata.source || "N/A"}
                      </span>
                      {doc.metadata.created_at && (
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                          Created: {formatDate(doc.metadata.created_at)}
                        </span>
                      )}
                      {doc.metadata.updated_at && (
                        <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                          Updated: {formatDate(doc.metadata.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-right">
              <button
                onClick={fetchDescriptions}
                disabled={loading}
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}