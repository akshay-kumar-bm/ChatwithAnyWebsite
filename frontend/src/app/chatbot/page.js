'use client';
import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import ReactMarkdown from 'react-markdown';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { type: 'user', content: query };
    const currentQuery = query; // Store query to use in the API call
    
    // Immediately update UI with user message and clear input
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery })
      });
      
      const result = await res.json();
      const botMessage = { type: 'bot', content: result.response, isMarkdown: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error calling chatbot API:', err);
      const errorMessage = { 
        type: 'error', 
        content: 'Sorry, there was an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Function to render message content with or without markdown
  const renderMessageContent = (msg) => {
    if (msg.isMarkdown) {
      return (
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
              code: ({node, inline, ...props}) => 
                inline ? 
                  <code className="bg-opacity-5 bg-black px-1 py-0.5 rounded font-mono" {...props} /> :
                  <code className="block bg-opacity-5 bg-black p-3 rounded font-mono my-2 overflow-x-auto" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-opacity-5 bg-black p-3 rounded overflow-x-auto my-2" {...props} />,
              ul: ({node, ...props}) => <ul className="ml-6 mb-3 list-disc" {...props} />,
              ol: ({node, ...props}) => <ol className="ml-6 mb-3 list-decimal" {...props} />,
              h1: ({node, ...props}) => <h1 className="text-xl font-semibold mt-4 mb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-4 mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-base font-semibold mt-4 mb-2" {...props} />,
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
      );
    }
    return msg.content;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto p-6">
        <div className="bg-blue-600 rounded-t-lg p-4 text-white">
          <h1 className="text-xl font-medium">AI Support Assistant</h1>
          <p className="text-sm text-blue-100">Ask anything about your website or business</p>
        </div>
        
        <div className="bg-white rounded-b-lg shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 && (
              <div className="flex items-start mb-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    🤖
                  </div>
                </div>
                <div>
                  <p className="font-medium">Hello! How can I help you today?</p>
                  <p className="text-sm text-gray-600 mt-1">Ask me about your menu, business hours, or special offers.</p>
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                {msg.type !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 mt-1">
                    {msg.type === 'error' ? '!' : '🤖'}
                  </div>
                )}
                <div 
                  className={`p-3 rounded-lg max-w-xs sm:max-w-md ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white ml-3' 
                      : msg.type === 'error'
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-gray-100 text-gray-800'
                  } ${msg.isMarkdown ? 'markdown-wrapper' : ''}`}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 mt-1">
                  🤖
                </div>
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg inline-flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Type your message..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 px-5 font-medium transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : (
                  <>
                    Send
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="text-xs text-center text-gray-500 mt-2">
          Powered by AI • Your Restaurant/E-Commerce Assistant
        </div>
      </div>
    </div>
  );
}