'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-black py-4 px-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex justify-center sm:justify-start">
          <Image
            src="/Logo_Cielocanto_cielocanto-3.png"
            alt="Cielocanto Logo"
            width={200}
            height={67}
            className="object-contain h-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 items-center">
          <Link
            href="/local1a/servicios"
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Local 1A
          </Link>
          <Link
            href="/local1b/servicios"
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Local 1B
          </Link>
          <Link
            href="/local3/servicios"
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Local 3
          </Link>
          <Link
            href="/admin/servicios"
            className="text-gray-300 hover:text-white transition-colors text-sm bg-gray-800 px-3 py-1 rounded"
          >
            🔧 Admin
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="md:hidden text-gray-300 hover:text-white"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {showMenu ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
          <div className="flex flex-col gap-3">
            <Link
              href="/local1a/servicios"
              onClick={() => setShowMenu(false)}
              className="text-gray-300 hover:text-white transition-colors py-2"
            >
              Local 1A - Servicios
            </Link>
            <Link
              href="/local1b/servicios"
              onClick={() => setShowMenu(false)}
              className="text-gray-300 hover:text-white transition-colors py-2"
            >
              Local 1B - Servicios
            </Link>
            <Link
              href="/local3/servicios"
              onClick={() => setShowMenu(false)}
              className="text-gray-300 hover:text-white transition-colors py-2"
            >
              Local 3 - Servicios
            </Link>
            <Link
              href="/admin/servicios"
              onClick={() => setShowMenu(false)}
              className="text-gray-300 hover:text-white transition-colors py-2 bg-gray-800 px-3 py-2 rounded"
            >
              🔧 Administración
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header; 