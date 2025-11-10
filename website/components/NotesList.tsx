'use client';

import { useState, useEffect } from 'react';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { getNotes as getNotesQuery } from '@/lib/graphql/queries';
import type { Note, Sentiment } from '@/types/note';
import NoteCard from './NoteCard';
import { ListBullets, Smiley, SmileySad, SmileyMeh, SmileyXEyes } from 'phosphor-react';
import { useLanguage } from '@/contexts/LanguageContext';

const client = generateClient();

const sentimentFilterIcons = {
  all: ListBullets,
  happy: Smiley,
  sad: SmileySad,
  neutral: SmileyMeh,
  angry: SmileyXEyes,
};

export default function NotesList({ refresh }: { refresh: number }) {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const sentimentFilters = [
    { value: null, key: 'all' },
    { value: 'happy' as Sentiment, key: 'happy' },
    { value: 'sad' as Sentiment, key: 'sad' },
    { value: 'neutral' as Sentiment, key: 'neutral' },
    { value: 'angry' as Sentiment, key: 'angry' },
  ];

  const fetchNotes = async (sentiment: Sentiment | null, token: string | null = null) => {
    setIsLoading(true);
    try {
      const variables: any = {
        limit: 10,
      };
      
      if (sentiment) {
        variables.sentiment = sentiment;
      }
      
      if (token) {
        variables.nextToken = token;
      }

      const response = await client.graphql({
        query: getNotesQuery,
        variables,
      });

      const result = (response as GraphQLResult<any>).data?.getNotes;
      
      if (token) {
        // Paginación: agregar a las notas existentes
        setNotes((prev) => [...prev, ...result.items]);
      } else {
        // Nueva búsqueda: reemplazar notas
        setNotes(result.items);
      }
      
      setNextToken(result.nextToken || null);
      setHasMore(!!result.nextToken);
    } catch (error) {
      console.error('Error fetching notes:', error);
      alert(t('notesList.errorLoading'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(selectedSentiment);
  }, [selectedSentiment, refresh]);

  const handleFilterChange = (sentiment: Sentiment | null) => {
    setSelectedSentiment(sentiment);
    setNextToken(null);
  };

  const loadMore = () => {
    if (nextToken && !isLoading) {
      fetchNotes(selectedSentiment, nextToken);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-medium text-gray-700 mb-4">{t('notesList.filterTitle')}</h2>
        <div className="flex flex-wrap gap-2">
          {sentimentFilters.map((filter) => {
            const Icon = sentimentFilterIcons[filter.key as keyof typeof sentimentFilterIcons];
            return (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                  selectedSentiment === filter.value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon size={18} weight={selectedSentiment === filter.value ? 'fill' : 'regular'} />
                {t(`sentiments.${filter.key}`)}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">{t('notesList.loadingNotes')}</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-base">{t('notesList.noNotes')}</p>
          <p className="text-gray-400 text-sm mt-2">{t('notesList.createFirstNote')}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {notes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onUpdated={() => fetchNotes(selectedSentiment)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="bg-gray-900 text-white py-2.5 px-6 rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                {isLoading ? t('notesList.loading') : t('notesList.loadMore')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}