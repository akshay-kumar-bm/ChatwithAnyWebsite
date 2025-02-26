'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Web<span className="text-blue-600">AI</span>
            </span>
          </Link>

          <nav className="flex items-center">
            {[
              { path: '/url-processor', label: 'Website Analysis' },
              {path: "/text-processor", label: "Direct Input"},
              { path: '/chatbot', label: 'AI Chat Support' },
              { path: '/products', label: 'Product Management' },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-3 py-2 mx-1 text-sm font-medium transition-colors ${
                  pathname === link.path 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.label}
                {pathname === link.path && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></div>
                )}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}