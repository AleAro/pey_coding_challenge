'use client';

import { useState } from 'react';
import NotesList from '@/components/NotesList';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/lib/amplify-config';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {t('home.title')}
          </h1>
          <p className="text-gray-500">
            {t('home.subtitle')}
          </p>
        </div>

        <NotesList refresh={refreshKey} />
      </div>
    </main>
  );
}