'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createNote as createNoteMutation } from '@/lib/graphql/queries';
import type { Sentiment } from '@/types/note';
import { Smiley, SmileySad, SmileyMeh, SmileyXEyes } from 'phosphor-react';
import { useLanguage } from '@/contexts/LanguageContext';

const client = generateClient();

const sentimentIcons = {
  happy: Smiley,
  sad: SmileySad,
  neutral: SmileyMeh,
  angry: SmileyXEyes,
};

export default function CreateNoteForm({ onNoteCreated }: { onNoteCreated: () => void }) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment>('neutral');
  const [isLoading, setIsLoading] = useState(false);

  const sentiments: Sentiment[] = ['happy', 'sad', 'neutral', 'angry'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      await client.graphql({
        query: createNoteMutation,
        variables: { text: text.trim(), sentiment },
      });
      
      setText('');
      setSentiment('neutral');
      onNoteCreated();
    } catch (error) {
      console.error('Error creating note:', error);
      alert(t('form.errorCreating'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/60 p-10 shadow-sm backdrop-blur-sm">
      <div className="mb-8">
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-4">
          {t('form.noteTextLabel')}
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all resize-none text-gray-900 placeholder:text-gray-400 bg-gray-50/50"
          rows={8}
          placeholder={t('form.noteTextPlaceholder')}
          required
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          {t('form.sentimentLabel')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sentiments.map((sentimentValue) => {
            const Icon = sentimentIcons[sentimentValue];
            return (
              <button
                key={sentimentValue}
                type="button"
                onClick={() => setSentiment(sentimentValue)}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group ${
                  sentiment === sentimentValue
                    ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon 
                  size={28} 
                  weight={sentiment === sentimentValue ? 'fill' : 'regular'} 
                  className={sentiment === sentimentValue ? '' : 'group-hover:scale-110 transition-transform'}
                />
                <div className="text-sm font-medium">{t(`sentiments.${sentimentValue}`)}</div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full bg-gray-900 text-white py-4 px-6 rounded-2xl hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm hover:shadow-md disabled:shadow-none"
      >
        {isLoading ? t('form.creating') : t('form.createNote')}
      </button>
    </form>
  );
}