'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { updateNote as updateNoteMutation } from '@/lib/graphql/queries';
import type { Note, Sentiment } from '@/types/note';
import { Smiley, SmileySad, SmileyMeh, SmileyXEyes, X } from 'phosphor-react';
import { useLanguage } from '@/contexts/LanguageContext';

const client = generateClient();

const sentimentIcons = {
  happy: Smiley,
  sad: SmileySad,
  neutral: SmileyMeh,
  angry: SmileyXEyes,
};

interface EditNoteModalProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditNoteModal({ note, isOpen, onClose, onUpdated }: EditNoteModalProps) {
  const { t } = useLanguage();
  const [text, setText] = useState(note.text);
  const [sentiment, setSentiment] = useState<Sentiment>(note.sentiment);
  const [isLoading, setIsLoading] = useState(false);

  const sentiments: Sentiment[] = ['happy', 'sad', 'neutral', 'angry'];

  useEffect(() => {
    if (isOpen) {
      setText(note.text);
      setSentiment(note.sentiment);
    }
  }, [isOpen, note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await client.graphql({
        query: updateNoteMutation,
        variables: { 
          id: note.id, 
          dateCreated: note.dateCreated,
          text: text.trim(), 
          sentiment 
        },
      });
      console.log('Update response:', response);
      
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating note:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      alert(t('form.errorUpdating'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-gray-200/60 p-8 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{t('noteCard.editNote')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={24} weight="regular" className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="edit-text" className="block text-sm font-medium text-gray-700 mb-3">
              {t('form.noteTextLabel')}
            </label>
            <textarea
              id="edit-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all resize-none text-gray-900 placeholder:text-gray-400 bg-gray-50/50"
              rows={8}
              placeholder={t('form.noteTextPlaceholder')}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl hover:bg-gray-200 transition-all font-medium text-sm"
            >
              {t('noteCard.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-2xl hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm hover:shadow-md disabled:shadow-none"
            >
              {isLoading ? t('form.updating') : t('form.updateNote')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

