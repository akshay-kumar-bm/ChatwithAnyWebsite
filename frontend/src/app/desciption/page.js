'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DescriptionPage() {
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  
  // Form state
  const [formAction, setFormAction] = useState('add');
  const [formText, setFormText] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDocId, setFormDocId] = useState('');
  const [formSource, setFormSource] = useState('direct_input');
  
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  // Fetch all descriptions
  const fetchDescriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/view-all-descriptions`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDescriptions(data.descriptions || []);
    } catch (err) {
      setError(`Failed to fetch descriptions: ${err.message}`);
      console.error("Error fetching descriptions:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        action: formAction,
        text: formText,
        title: formTitle,
        source: formSource
      };
      
      // Include doc_id for update and remove actions
      if (formAction !== 'add') {
        payload.doc_id = formDocId || selectedDocId;
      }
      
      const response = await fetch(`${API_URL}/manage-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      alert(data.message);
      
      // Reset form and refresh data
      resetForm();
      fetchDescriptions();
    } catch (err) {
      setError(`Operation failed: ${err.message}`);
      console.error("Error managing description:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form fields
  const resetForm = () => {
    setFormAction('add');
    setFormText('');
    setFormTitle('');
    setFormDocId('');
    setSelectedDocId(null);
  };
  
  // Set form for editing
  const handleEdit = (description) => {
    setFormAction('update');
    setFormText(description.content);
    setFormTitle(description.metadata?.title || '');
    setFormDocId(description.doc_id);
    setSelectedDocId(description.doc_id);
  };
  
  // Set form for deletion
  const handleDelete = (docId) => {
    setFormAction('remove');
    setFormDocId(docId);
    setSelectedDocId(docId);
    
    if (confirm('Are you sure you want to delete this description?')) {
      handleSubmit({ preventDefault: () => {} });
    } else {
      resetForm();
    }
  };
  
  // Load descriptions on component mount
  useEffect(() => {
    fetchDescriptions();
  }, []);
  
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={() => {setError(null); fetchDescriptions();}}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Description Management</h1>
      
      {/* Management Form */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {formAction === 'add' ? 'Add New Description' : 
           formAction === 'update' ? 'Update Description' : 'Remove Description'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Action</label>
            <select
              value={formAction}
              onChange={(e) => setFormAction(e.target.value)}
              className="w-full border rounded p-2"
              disabled={loading}
            >
              <option value="add">Add</option>
              <option value="update">Update</option>
              <option value="remove">Remove</option>
            </select>
          </div>
          
          {formAction !== 'add' && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Document ID</label>
              <input
                type="text"
                value={formDocId}
                onChange={(e) => setFormDocId(e.target.value)}
                className="w-full border rounded p-2"
                disabled={loading || selectedDocId}
                required={formAction !== 'add'}
              />
              {selectedDocId && (
                <p className="text-sm text-gray-500 mt-1">
                  Using selected document: {selectedDocId}
                </p>
              )}
            </div>
          )}
          
          {formAction !== 'remove' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border rounded p-2"
                  disabled={loading}
                  placeholder="Enter document title"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description Text</label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full border rounded p-2 h-32"
                  disabled={loading}
                  required
                  placeholder="Enter description text (minimum 50 characters)"
                />
              </div>
              
              {formAction === 'add' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Source</label>
                  <input
                    type="text"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full border rounded p-2"
                    disabled={loading}
                    placeholder="Source of this description"
                  />
                </div>
              )}
            </>
          )}
          
          <div className="flex gap-2">
            <button
              type="submit"
              className={`py-2 px-4 rounded font-bold text-white ${
                loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      
      {/* Description List */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">All Descriptions</h2>
        
        {loading && !descriptions.length ? (
          <p className="text-center py-4">Loading descriptions...</p>
        ) : descriptions.length === 0 ? (
          <p className="text-center py-4">No descriptions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Content Preview</th>
                  <th className="py-2 px-4 border-b text-left">Source</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {descriptions.map((desc, index) => (
                  <tr key={desc.doc_id || index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {desc.metadata?.title || 'Untitled'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {desc.content.substring(0, 100)}...
                    </td>
                    <td className="py-2 px-4 border-b">
                      {desc.metadata?.source || 'Unknown'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(desc)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(desc.doc_id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <button
          onClick={fetchDescriptions}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
}