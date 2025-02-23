'use client';
import { useState } from 'react';
import Header from '../components/Header';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { type: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const result = await res.json();
      const botMessage = { type: 'bot', content: result.response };
      setMessages(prev => [...prev, botMessage]);
      setQuery('');
    } catch (err) {
      const errorMessage = { type: 'error', content: 'Sorry, there was an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h1 className="text-xl font-semibold">AI Support Assistant</h1>
            <p className="text-sm opacity-90">Ask anything about your website or business</p>
          </div>

          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 my-8">
                <p>👋 Hello! How can I help you today?</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-4 max-w-[80%] ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : msg.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 p-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}