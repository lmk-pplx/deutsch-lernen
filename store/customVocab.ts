import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabSet, VocabWord, Difficulty } from '../types';

const CUSTOM_SETS_KEY = 'deutsch_custom_sets';

export async function getCustomSets(): Promise<VocabSet[]> {
  try {
    const data = await AsyncStorage.getItem(CUSTOM_SETS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch {
    return [];
  }
}

export async function createCustomSet(
  name: string,
  topic: string,
  difficulty: Difficulty
): Promise<VocabSet> {
  const sets = await getCustomSets();
  const newSet: VocabSet = {
    id: `custom-${Date.now()}`,
    name,
    topic,
    difficulty,
    words: [],
    isCustom: true,
  };
  sets.push(newSet);
  await AsyncStorage.setItem(CUSTOM_SETS_KEY, JSON.stringify(sets));
  return newSet;
}

export async function addWordToSet(
  setId: string,
  word: Omit<VocabWord, 'id'>
): Promise<VocabSet | null> {
  const sets = await getCustomSets();
  const setIndex = sets.findIndex((s) => s.id === setId);
  if (setIndex === -1) return null;

  const newWord: VocabWord = {
    ...word,
    id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  };
  sets[setIndex].words.push(newWord);
  await AsyncStorage.setItem(CUSTOM_SETS_KEY, JSON.stringify(sets));
  return sets[setIndex];
}

export async function removeWordFromSet(setId: string, wordId: string): Promise<void> {
  const sets = await getCustomSets();
  const setIndex = sets.findIndex((s) => s.id === setId);
  if (setIndex === -1) return;

  sets[setIndex].words = sets[setIndex].words.filter((w) => w.id !== wordId);
  await AsyncStorage.setItem(CUSTOM_SETS_KEY, JSON.stringify(sets));
}

export async function deleteCustomSet(setId: string): Promise<void> {
  const sets = await getCustomSets();
  const filtered = sets.filter((s) => s.id !== setId);
  await AsyncStorage.setItem(CUSTOM_SETS_KEY, JSON.stringify(filtered));
}

export async function updateWord(
  setId: string,
  wordId: string,
  updates: Partial<VocabWord>
): Promise<void> {
  const sets = await getCustomSets();
  const setIndex = sets.findIndex((s) => s.id === setId);
  if (setIndex === -1) return;

  const wordIndex = sets[setIndex].words.findIndex((w) => w.id === wordId);
  if (wordIndex === -1) return;

  sets[setIndex].words[wordIndex] = { ...sets[setIndex].words[wordIndex], ...updates };
  await AsyncStorage.setItem(CUSTOM_SETS_KEY, JSON.stringify(sets));
}
