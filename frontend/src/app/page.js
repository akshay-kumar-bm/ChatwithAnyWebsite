'use client';
import Header from './components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-12 mb-12 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Enhance Your Website with AI-Powered Support
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Transform your website into an intelligent platform with automated support, 
              content analysis, and smart product management. Perfect for businesses 
              looking to streamline their online presence.
            </p>
            <div className="space-x-4">
              <Link 
                href="/url-processor"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100"
              >
                Analyze Your Website
              </Link>
              <Link 
                href="/chatbot"
                className="inline-block bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800"
              >
                Try AI Chat Support
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { number: "95%", label: "Customer Satisfaction" },
            { number: "24/7", label: "Automated Support" },
            { number: "60%", label: "Cost Reduction" },
            { number: "<1s", label: "Response Time" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Analyze Your Website",
                description: "Enter your website URL and let our AI analyze your content structure."
              },
              {
                step: "2",
                title: "Setup AI Support",
                description: "Our system automatically creates a knowledge base from your content."
              },
              {
                step: "3",
                title: "Start Supporting Users",
                description: "Deploy the AI chatbot to handle customer inquiries 24/7."
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "URL Analysis",
              description: "Process and analyze website content automatically",
              path: "/url-processor",
              icon: "🔍"
            },
            {
              title: "Product Management",
              description: "Efficiently manage and update product information",
              path: "/products",
              icon: "📦"
            },
            {
              title: "AI Support",
              description: "Get instant answers with our intelligent chatbot",
              path: "/chatbot",
              icon: "🤖"
            }
          ].map((feature) => (
            <Link
              key={feature.path}
              href={feature.path}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>

        {/* Demo Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">See It in Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Live Chat Demo</h3>
              <p className="text-gray-600">
                Experience our AI chatbot's capabilities firsthand. Ask questions, 
                get product recommendations, and see how it handles customer inquiries.
              </p>
              <Link 
                href="/chatbot"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Start Chat Demo
              </Link>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">URL Analysis Demo</h3>
              <p className="text-gray-600">
                See how our AI analyzes websites, extracts key information, and 
                provides actionable insights for your business.
              </p>
              <Link 
                href="/url-processor"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Try URL Analysis
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}