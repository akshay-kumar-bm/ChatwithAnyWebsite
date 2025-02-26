'use client';
import Header from './components/Header';
import Link from 'next/link';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Modern with animated elements */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden mb-16 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="md:flex">
            <div className="p-8 md:p-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 md:w-3/5">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Intelligent • Responsive • 24/7
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Elevate Your Customer Experience with <span className="text-blue-600 relative">Smart AI<span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-400 opacity-40 rounded"></span></span>
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                  Transform your {" "}
                  <span className="text-blue-600 font-medium">e-commerce store</span> or {" "}
                  <span className="text-blue-600 font-medium">restaurant website</span> {" "}
                  with intelligent customer support that drives sales and delights your customers around the clock.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link 
                    href="/url-processor"
                    className="inline-flex items-center justify-center h-14 px-8 font-medium tracking-wide text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Analyze Your Website
                  </Link>
                  <Link 
                    href="/chatbot"
                    className="inline-flex items-center justify-center h-14 px-8 font-medium tracking-wide text-blue-600 transition-all duration-200 bg-white border-2 border-blue-500 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    Try Demo Chat
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute opacity-10 top-0 right-0 h-64 w-64 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
              <div className="absolute opacity-10 bottom-0 left-0 h-64 w-64 rounded-full bg-white transform -translate-x-16 translate-y-16"></div>
              
              <div className="relative w-full max-w-sm p-4 bg-white rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-300">
                <div className="h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-md mb-4 flex items-center px-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
                    <div className="ml-3 bg-gray-100 rounded-2xl p-3 text-sm max-w-xs animate-fadeIn">
                      <p className="font-medium text-gray-800">How can I help you today?</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="mr-3 bg-blue-100 rounded-2xl p-3 text-sm max-w-xs">
                      <p className="font-medium text-gray-800">Do you have this dish in vegetarian option?</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-sm">👤</div>
                  </div>
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
                    <div className="ml-3 bg-gray-100 rounded-2xl p-3 text-sm max-w-xs animate-pulse">
                      <p className="font-medium text-gray-800">Yes! We offer a delicious vegetarian version with seasonal vegetables and house-made sauce.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Testimonial Section */}
        <div className={`mb-16 bg-white rounded-2xl p-8 shadow-xl transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Businesses Like Yours</h2>
            <div className="hidden md:block text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">See all case studies →</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "95%", label: "Customer Satisfaction", subtext: "Based on 1,000+ reviews" },
              { value: "24/7", label: "Automated Support", subtext: "Never miss a customer" },
              { value: "60%", label: "Cost Reduction", subtext: "Compared to human agents" },
              { value: "<3s", label: "Response Time", subtext: "Instant customer service" }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-800 font-medium text-lg">{stat.label}</div>
                <div className="text-gray-500 text-sm mt-2">{stat.subtext}</div>
              </div>
            ))}
          </div>
          <div className="block md:hidden text-center mt-6">
            <div className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">See all case studies →</div>
          </div>
        </div>

        {/* How It Works - Modern cards with visual indicators */}
        <div className={`mb-16 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
            Seamless Integration in Three Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Analyze Your Website",
                description: "Connect your website and our AI will automatically analyze your content structure and customer needs.",
                icon: "🔍",
                color: "from-blue-500 to-cyan-400"
              },
              {
                step: "2",
                title: "Train Your AI Assistant",
                description: "Our system creates a custom knowledge base from your menu items, products, and FAQs.",
                icon: "🧠",
                color: "from-indigo-500 to-purple-400"
              },
              {
                step: "3",
                title: "Engage Your Customers",
                description: "Deploy the chatbot to handle orders, reservations, and support requests around the clock.",
                icon: "🚀",
                color: "from-green-500 to-emerald-400"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} text-white rounded-2xl flex items-center justify-center text-2xl mb-6 transform transition-transform group-hover:scale-110 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="text-sm font-bold text-blue-600">Step {item.step}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry-Specific Features */}
        <div className={`mb-16 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Industry-Tailored Solutions</h2>
            <div className="hidden md:block text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">Explore all features →</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* E-commerce Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:-translate-y-2 hover:shadow-xl">
              <div className="h-3 bg-gradient-to-r from-blue-400 to-cyan-300"></div>
              <div className="p-8">
                <div className="inline-block p-4 bg-blue-100 text-blue-600 rounded-2xl text-3xl mb-6">🛍️</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">E-Commerce Solutions</h3>
                <ul className="space-y-3 text-gray-700">
                  {[
                    "Product recommendation engine",
                    "Order status tracking",
                    "Inventory availability checks",
                    "Personalized shopping assistance"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/url-processor"
                  className="mt-6 inline-block text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Analyze your e-commerce site →
                </Link>
              </div>
            </div>
            
            {/* Restaurant Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:-translate-y-2 hover:shadow-xl">
              <div className="h-3 bg-gradient-to-r from-indigo-400 to-purple-300"></div>
              <div className="p-8">
                <div className="inline-block p-4 bg-indigo-100 text-indigo-600 rounded-2xl text-3xl mb-6">🍽️</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Restaurant Solutions</h3>
                <ul className="space-y-3 text-gray-700">
                  {[
                    "Automated reservation system",
                    "Menu item ingredients & allergens",
                    "Online ordering assistance",
                    "Special requests handling"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/url-processor"
                  className="mt-6 inline-block text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Enhance your restaurant site →
                </Link>
              </div>
            </div>
          </div>
          <div className="block md:hidden text-center mt-6">
            <div className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">Explore all features →</div>
          </div>
        </div>

        {/* Demo Section - More visual and engaging */}
        <div className={`bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 rounded-2xl shadow-lg p-10 mb-16 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Experience the AI Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition hover:-translate-y-2 hover:shadow-xl">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl mb-6 flex items-center justify-center text-5xl relative overflow-hidden">
                <div className="absolute opacity-20 -top-10 -right-10 w-40 h-40 rounded-full bg-blue-400"></div>
                <div className="absolute opacity-20 -bottom-10 -left-10 w-40 h-40 rounded-full bg-indigo-400"></div>
                <span className="relative z-10">💬</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Interactive Chat Demo</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Experience how our AI effortlessly handles customer inquiries about your menu, 
                products, business hours, and promotions.
              </p>
              <Link 
                href="/chatbot"
                className="w-full inline-flex items-center justify-center h-12 px-6 font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow hover:shadow-lg transition-all duration-200"
              >
                Try Live Demo
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition hover:-translate-y-2 hover:shadow-xl">
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl mb-6 flex items-center justify-center text-5xl relative overflow-hidden">
                <div className="absolute opacity-20 -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400"></div>
                <div className="absolute opacity-20 -bottom-10 -left-10 w-40 h-40 rounded-full bg-teal-400"></div>
                <span className="relative z-10">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Website Analysis</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Just enter your website URL and watch as our AI instantly analyzes your content 
                to build a custom knowledge base tailored to your business.
              </p>
              <Link 
                href="/url-processor"
                className="w-full inline-flex items-center justify-center h-12 px-6 font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow hover:shadow-lg transition-all duration-200"
              >
                Scan Your Site
              </Link>
            </div>
          </div>
        </div>
          
        {/* FAQ Section - Modernized with accordion styling */}
        <div className={`mt-16 bg-white rounded-2xl shadow-lg p-10 transform transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "How long does it take to set up the AI chatbot?",
                answer: "Most businesses are up and running within 24 hours. Our system automatically analyzes your website content to create a knowledge base, which can be further customized as needed."
              },
              {
                question: "Can I customize the look and feel to match my brand?",
                answer: "Absolutely! You can customize colors, fonts, and the chat interface to perfectly match your brand identity and website design."
              },
              {
                question: "How does the AI handle complex customer requests?",
                answer: "Our AI is trained to handle common requests automatically. For more complex inquiries, it can collect information and seamlessly escalate to a human team member when necessary."
              },
              {
                question: "What languages does the AI support?",
                answer: "Our chatbot supports over 30 languages, making it perfect for businesses with an international customer base."
              }
            ].map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-between">
                    {faq.question}
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link 
              href="/faq"
              className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all FAQs
              <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Call to Action Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 relative overflow-hidden">
        <div className="absolute opacity-10 top-0 right-0 h-64 w-64 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
        <div className="absolute opacity-10 bottom-0 left-0 h-64 w-64 rounded-full bg-white transform -translate-x-16 translate-y-16"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your customer experience?</h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of businesses that have increased sales and customer satisfaction with our AI chat solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/url-processor"
              className="w-full sm:w-auto inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link 
              href="/contact"
              className="w-full sm:w-auto inline-block bg-blue-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-900 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-500"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}