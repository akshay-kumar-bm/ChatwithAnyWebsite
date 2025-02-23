'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[#131921] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              WebAI Demo
            </span>
          </Link>

          <nav className="flex items-center space-x-8">
            {[
              { path: '/url-processor', label: 'Website Analysis' },
              { path: '/chatbot', label: 'AI Chat Support' },
              { path: '/products', label: 'Product Management' }
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium hover:text-blue-400 transition-colors ${
                  pathname === link.path ? 'text-blue-400' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
