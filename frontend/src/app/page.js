  'use client';
  import Header from './components/Header';
  import Link from 'next/link';
  import Footer from './components/Footer';

  export default function Home() {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section - More modern and clean with subtle patterns */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="md:flex">
              <div className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-cyan-50 md:w-3/5">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Smart AI Chat Support for Your Business
                </h1>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                  Enhance your {" "}
                  <span className="text-blue-600 font-medium">e-commerce store</span> or {" "}
                  <span className="text-blue-600 font-medium">restaurant website</span> {" "}
                  with 24/7 intelligent customer support that boosts sales and improves satisfaction.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/url-processor"
                    className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Analyze Your Website
                  </Link>
                  <Link 
                    href="/chatbot"
                    className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-blue-600 transition duration-200 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Try Demo Chat
                  </Link>
                </div>
              </div>
              <div className="md:w-2/5 bg-blue-600 p-8 md:p-12 flex items-center justify-center">
                <div className="relative w-full max-w-sm p-4 bg-white rounded-lg shadow-lg">
                  <div className="h-10 bg-blue-600 rounded-t-md mb-4"></div>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0"></div>
                      <div className="ml-3 bg-gray-100 rounded-lg p-3 text-sm max-w-xs">
                        How can I help you today?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="mr-3 bg-blue-100 rounded-lg p-3 text-sm max-w-xs">
                        Do you have this dish in vegetarian option?
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                    </div>
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0"></div>
                      <div className="ml-3 bg-gray-100 rounded-lg p-3 text-sm max-w-xs">
                        Yes! We offer a delicious vegetarian version with seasonal vegetables.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Testimonial Section */}
          <div className="mb-12 bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Trusted by Businesses Like Yours</h2>
              <div className="text-sm text-blue-600 font-medium">See all case studies →</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-gray-700">Customer Satisfaction</div>
                <div className="text-gray-500 text-sm mt-2">Based on 1,000+ reviews</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-700">Automated Support</div>
                <div className="text-gray-500 text-sm mt-2">Never miss a customer</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-3xl font-bold text-blue-600">60%</div>
                <div className="text-gray-700">Cost Reduction</div>
                <div className="text-gray-500 text-sm mt-2">Compared to human agents</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-3xl font-bold text-blue-600"> less then3s</div>
                <div className="text-gray-700">Response Time</div>
                <div className="text-gray-500 text-sm mt-2">Instant customer service</div>
              </div>
            </div>
          </div>

          {/* How It Works - Material Design inspired cards with clear icons and steps */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
              Seamless Integration in Three Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Analyze Your Website",
                  description: "Connect your website and our AI will automatically analyze your content structure and customer needs.",
                  icon: "🔍"
                },
                {
                  step: "2",
                  title: "Train Your AI Assistant",
                  description: "Our system creates a custom knowledge base from your menu items, products, and FAQs.",
                  icon: "🧠"
                },
                {
                  step: "3",
                  title: "Engage Your Customers",
                  description: "Deploy the chatbot to handle orders, reservations, and support requests around the clock.",
                  icon: "🚀"
                }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                  <div className="h-2 bg-blue-600"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="text-sm font-medium text-blue-600">Step {item.step}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry-Specific Features */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Industry-Tailored Solutions</h2>
              <div className="text-sm text-blue-600 font-medium">Explore all features →</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* E-commerce Section */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="text-2xl mb-4">🛍️</div>
                  <h3 className="text-xl font-semibold mb-2">E-Commerce Solutions</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Product recommendation engine
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Order status tracking
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Inventory availability checks
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Personalized shopping assistance
                    </li>
                  </ul>
                  <Link 
                    href="/url-processor"
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Analyze your e-commerce site →
                  </Link>
                </div>
              </div>
              
              {/* Restaurant Section */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="text-2xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold mb-2">Restaurant Solutions</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Automated reservation system
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Menu item ingredients & allergens
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Online ordering assistance
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Special requests handling
                    </li>
                  </ul>
                  <Link 
                    href="/url-processor"
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Enhance your restaurant site →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Section - More visual and engaging */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Experience the AI Difference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-4xl">
                  💬
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Chat Demo</h3>
                <p className="text-gray-600 mb-4">
                  See how our AI handles real customer questions about your menu items, 
                  operating hours, and special offers.
                </p>
                <Link 
                  href="/chatbot"
                  className="w-full inline-flex items-center justify-center h-10 px-6 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Try Live Demo
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-4xl">
                  🔍
                </div>
                <h3 className="text-xl font-semibold mb-2">Website Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Enter your website URL and watch as our AI scans your content to build 
                  a custom knowledge base for your business.
                </p>
                <Link 
                  href="/url-processor"
                  className="w-full inline-flex items-center justify-center h-10 px-6 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Scan Your Site
                </Link>
              </div>
            </div>
          </div>
          
          {/* FAQ Section - New addition */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
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
                <div key={i} className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link 
                href="/faq"
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                View all FAQs →
              </Link>
            </div>
          </div>
        </main>
        
        {/* Simple Call to Action Footer */}
        <div className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your customer experience?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of businesses that have increased sales and customer satisfaction with our AI chat solution.
            </p>
            <Link 
              href="/url-processor"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 mr-4"
            >
              Get Started Free
            </Link>
            <Link 
              href="/contact"
              className="inline-block bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 border border-blue-400"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
            <Footer />
      </div>
    );
  }