'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateNoteForm from '@/components/CreateNoteForm';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/lib/amplify-config';

export default function CreatePage() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useLanguage();

  const handleNoteCreated = () => {
    setRefreshKey((prev) => prev + 1);
    // Redirect to home page after successful creation
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
            {t('create.title')}
          </h1>
          <p className="text-gray-500 text-base">
            {t('create.subtitle')}
          </p>
        </div>

        <CreateNoteForm onNoteCreated={handleNoteCreated} />
      </div>
    </main>
  );
}

