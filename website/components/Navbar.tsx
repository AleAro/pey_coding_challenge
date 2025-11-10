'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NotePencil, ListBullets, Globe } from 'phosphor-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold text-gray-900 tracking-tight">
            {t('navbar.appName')}
          </Link>
          
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                pathname === '/'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ListBullets size={20} weight={pathname === '/' ? 'fill' : 'regular'} />
              <span className="text-sm font-medium">{t('navbar.viewNotes')}</span>
            </Link>
            
            <Link
              href="/create"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                pathname === '/create'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <NotePencil size={20} weight={pathname === '/create' ? 'fill' : 'regular'} />
              <span className="text-sm font-medium">{t('navbar.createNote')}</span>
            </Link>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
              aria-label="Toggle language"
            >
              <Globe size={20} weight="regular" />
              <span className="text-sm font-medium uppercase">{language}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

