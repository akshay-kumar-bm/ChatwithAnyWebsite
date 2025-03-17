'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
   
      
      <div className="flex-1 flex flex-col w-full mx-auto p-2 sm:p-4 md:p-6 max-w-4xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl p-3 sm:p-4 md:p-6 text-white shadow-lg">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">AI Support Assistant</h1>
          <p className="text-blue-100 text-sm sm:text-base">Get instant answers about products, services, and more</p>
          <div className="flex flex-wrap mt-2 sm:mt-4 gap-2 sm:space-x-4">
            <div className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">24/7 Support</div>
            <div className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">Instant Responses</div>
            <div className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">Product Information</div>
          </div>
        </div>
        
        <div className="bg-white rounded-b-xl shadow-lg flex-1 overflow-hidden flex flex-col border border-gray-100">
          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-pattern">
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row items-start mb-6 bg-blue-50 p-3 sm:p-6 rounded-xl border border-blue-100"
              >
                <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 flex justify-center w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-lg text-blue-800 mb-2">Welcome to WebAI Assistant!</h3>
                  <p className="text-gray-700 mb-3">How can I help you today?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "What are your business hours?",
                      "Tell me about your menu options",
                      "Do you offer delivery services?",
                      "What special offers are available?"
                    ].map((suggestion, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setQuery(suggestion);
                          document.querySelector('form button[type="submit"]').click();
                        }}
                        className="text-left px-3 py-2 bg-white rounded-lg border border-blue-200 text-sm text-blue-600 hover:bg-blue-50 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6`}
                >
                  {msg.type !== 'user' && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mr-2 sm:mr-3 mt-1 shadow-md flex-shrink-0">
                      {msg.type === 'error' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      )}
                    </div>
                  )}
                  <div 
                    className={`p-3 sm:p-4 rounded-xl max-w-[75%] sm:max-w-xs md:max-w-md lg:max-w-lg shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-2 sm:ml-3' 
                        : msg.type === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-white border border-gray-100 text-gray-800'
                    } ${msg.isMarkdown ? 'markdown-wrapper' : ''}`}
                  >
                    {renderMessageContent(msg)}
                  </div>
                  {msg.type === 'user' && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center ml-2 sm:ml-3 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <div className="flex justify-start mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mr-2 sm:mr-3 mt-1 shadow-md flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="bg-white text-gray-800 p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 inline-flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 sm:p-4 md:p-6 border-t border-gray-100 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm sm:text-base"
                placeholder="Type your message here..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl p-3 sm:p-4 px-4 sm:px-6 font-medium transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm sm:text-base"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Processing</span>
                  </span>
                ) : (
                  <>
                    <span>Send</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between items-center text-xs text-gray-500">
              <div className="mb-2 sm:mb-0 text-center sm:text-left">
                Powered by WebAI • Your intelligent assistant
              </div>
              <div className="flex space-x-2 text-center">
                <button className="hover:text-blue-600 transition">Help</button>
                <span>•</span>
                <button className="hover:text-blue-600 transition">Privacy</button>
                <span>•</span>
                <button className="hover:text-blue-600 transition">Feedback</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .bg-pattern {
          background-color: #f9fafc;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}