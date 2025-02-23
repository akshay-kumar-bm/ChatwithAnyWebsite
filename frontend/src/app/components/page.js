'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/url-processor', label: 'URL Analysis' },
    { path: '/chatbot', label: 'AI Chat' },
    { path: '/products', label: 'Add Product' }
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                WebAI
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="relative group"
              >
                <span className={`text-sm font-medium ${
                  pathname === item.path 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}>
                  {item.label}
                </span>
                {pathname === item.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 h-0.5 bg-blue-600 bottom-0"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
