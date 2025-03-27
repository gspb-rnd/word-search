
const FREE_DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const DATAMUSE_API_URL = 'https://api.datamuse.com/sug';

export interface Phonetic {
  text: string;
  audio?: string;
  sourceUrl?: string;
  license?: {
    name: string;
    url: string;
  };
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryApiResponse {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

export interface WordData {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls: string[];
}

export interface WordSuggestion {
  word: string;
  score: number;
}

/**
 * Fetches word data from the Free Dictionary API
 * @param word The word to look up
 * @returns Promise with word data
 */
export const fetchWordData = async (word: string): Promise<WordData | null> => {
  try {
    const response = await fetch(`${FREE_DICTIONARY_API_URL}/${encodeURIComponent(word.trim())}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Dictionary API error: ${response.status}`);
    }
    
    const data: DictionaryApiResponse[] = await response.json();
    
    if (!data || data.length === 0) {
      return null;
    }
    
    return {
      word: data[0].word,
      phonetic: data[0].phonetic,
      phonetics: data[0].phonetics,
      meanings: data[0].meanings,
      sourceUrls: data[0].sourceUrls
    };
  } catch (error) {
    console.error('Error fetching word data:', error);
    return null;
  }
};

/**
 * Fetches word suggestions for autocomplete
 * @param query The partial word to get suggestions for
 * @returns Promise with word suggestions
 */
export const fetchWordSuggestions = async (query: string): Promise<WordSuggestion[]> => {
  if (!query.trim()) {
    return [];
  }
  
  try {
    const response = await fetch(`${DATAMUSE_API_URL}?s=${encodeURIComponent(query.trim())}`);
    
    if (!response.ok) {
      throw new Error(`Datamuse API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      word: item.word,
      score: item.score
    }));
  } catch (error) {
    console.error('Error fetching word suggestions:', error);
    return [];
  }
};
