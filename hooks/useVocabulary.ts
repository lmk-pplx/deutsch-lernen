import { useState, useEffect, useCallback } from 'react';
import { VocabSet, Difficulty, VocabWord } from '../types';
import { vocabularySets } from '../data/vocabulary';
import { getCustomSets, createCustomSet, addWordToSet, deleteCustomSet, removeWordFromSet } from '../store/customVocab';

export function useVocabulary() {
  const [customSets, setCustomSets] = useState<VocabSet[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const sets = await getCustomSets();
    setCustomSets(sets);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const allSets = [...vocabularySets, ...customSets];

  const getSetById = useCallback(
    (id: string): VocabSet | undefined => {
      return allSets.find((s) => s.id === id);
    },
    [allSets]
  );

  const getSetsByDifficulty = useCallback(
    (difficulty: Difficulty): VocabSet[] => {
      return allSets.filter((s) => s.difficulty === difficulty);
    },
    [allSets]
  );

  const addSet = useCallback(
    async (name: string, topic: string, difficulty: Difficulty) => {
      const newSet = await createCustomSet(name, topic, difficulty);
      setCustomSets((prev) => [...prev, newSet]);
      return newSet;
    },
    []
  );

  const addWord = useCallback(
    async (setId: string, word: Omit<VocabWord, 'id'>) => {
      const updated = await addWordToSet(setId, word);
      if (updated) {
        await refresh();
      }
      return updated;
    },
    [refresh]
  );

  const removeSet = useCallback(
    async (setId: string) => {
      await deleteCustomSet(setId);
      setCustomSets((prev) => prev.filter((s) => s.id !== setId));
    },
    []
  );

  const removeWord = useCallback(
    async (setId: string, wordId: string) => {
      await removeWordFromSet(setId, wordId);
      await refresh();
    },
    [refresh]
  );

  return {
    allSets,
    customSets,
    builtInSets: vocabularySets,
    loading,
    getSetById,
    getSetsByDifficulty,
    addSet,
    addWord,
    removeSet,
    removeWord,
    refresh,
  };
}
