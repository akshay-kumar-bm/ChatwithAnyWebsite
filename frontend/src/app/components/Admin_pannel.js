'use client';
import Link from 'next/link';

export default function Admin() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-gray-800">WebAI Admin</h1>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Home
            </Link>
            <Link href="/url-processor" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Website Analysis
            </Link>
            <Link href="/text-processor" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Direct Input
            </Link>
            <Link href="/products" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Product Manage
            </Link>
            <Link href="/desciption" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Description Manage
            </Link>
            <Link href="/chatbot" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              AI Chat Support
            </Link>
          </nav>
          
          <div className="hidden md:block text-sm text-gray-500">
            © 2024 WebAI
          </div>
        </div>
      </div>
    </header>
  );
}