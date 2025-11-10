'use client';

import { useState } from 'react';
import type { Note } from '@/types/note';
import { Smiley, SmileySad, SmileyMeh, SmileyXEyes, Pencil, Trash } from 'phosphor-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { deleteNote as deleteNoteMutation } from '@/lib/graphql/queries';
import EditNoteModal from './EditNoteModal';

const client = generateClient();

const sentimentConfig = {
  happy: { 
    icon: Smiley, 
    color: 'bg-yellow-50 border-yellow-200', 
    iconColor: 'text-yellow-600',
  },
  sad: { 
    icon: SmileySad, 
    color: 'bg-blue-50 border-blue-200', 
    iconColor: 'text-blue-600',
  },
  neutral: { 
    icon: SmileyMeh, 
    color: 'bg-gray-50 border-gray-200', 
    iconColor: 'text-gray-600',
  },
  angry: { 
    icon: SmileyXEyes, 
    color: 'bg-red-50 border-red-200', 
    iconColor: 'text-red-600',
  },
};

interface NoteCardProps {
  note: Note;
  onUpdated?: () => void;
}

export default function NoteCard({ note, onUpdated }: NoteCardProps) {
  const { t, language } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const config = sentimentConfig[note.sentiment];
  const Icon = config.icon;
  const date = new Date(note.dateCreated);

  const handleDelete = async () => {
    if (!confirm(t('noteCard.confirmDelete'))) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await client.graphql({
        query: deleteNoteMutation,
        variables: { 
          id: note.id,
          dateCreated: note.dateCreated 
        },
      });
      console.log('Delete response:', response);
      
      // Even if response is null, try to refresh
      // The resolver might be working but returning null
      if ((response as GraphQLResult<any>).data) {
        onUpdated?.();
      } else {
        // If no data returned, still refresh to check if it was deleted
        setTimeout(() => {
          onUpdated?.();
        }, 500);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      alert(t('noteCard.errorDeleting'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`rounded-2xl border p-5 ${config.color} shadow-sm transition-all hover:shadow-md group relative`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={20} weight="fill" className={config.iconColor} />
            <span className="text-sm font-medium text-gray-700">{t(`sentiments.${note.sentiment}`)}</span>
          </div>
          <div className="flex items-center gap-2">
            <time className="text-xs text-gray-500 font-medium">
              {date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-1.5 rounded-lg hover:bg-white/60 transition-colors"
                aria-label={t('noteCard.edit')}
                title={t('noteCard.edit')}
              >
                <Pencil size={16} weight="regular" className="text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-lg hover:bg-white/60 transition-colors disabled:opacity-50"
                aria-label={t('noteCard.delete')}
                title={t('noteCard.delete')}
              >
                <Trash size={16} weight="regular" className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{note.text}</p>
      </div>

      <EditNoteModal
        note={note}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={() => {
          onUpdated?.();
          setIsEditModalOpen(false);
        }}
      />
    </>
  );
}