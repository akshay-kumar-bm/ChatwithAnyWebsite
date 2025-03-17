'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white bg-opacity-95'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link href="/" className="flex items-center space-x-2 relative z-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Web<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { path: '/admin', label: 'Home' },
              { path: '/url-processor', label: 'Website Analysis' },
              { path: '/chatbot', label: 'AI Chat Support' },
              { path: '/text-processor', label: 'Direct Input' },
              { path: '/products', label: 'Product Management' },
              { path: '/desciption', label: 'Description Manager' },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.path 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href=""
              className="ml-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden relative z-10" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                className={`h-6 w-6 transition duration-300 ease-in-out ${mobileMenuOpen ? "transform rotate-90 text-blue-600" : "text-gray-500"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 z-50 bg-white shadow-lg rounded-b-xl border-t border-gray-100 transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/url-processor', label: 'Website Analysis' },
              { path: '/chatbot', label: 'AI Chat Support' },
              { path: '/text-processor', label: 'Direct Input' },
              { path: '/products', label: 'Product Management' },
              { path: '/desciption', label: 'Description Manager' },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.path 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block w-full mt-4 px-3 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-center text-white font-medium rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}