
const DICTIONARY_BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';
const THESAURUS_BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json';

const DICTIONARY_API_KEY = import.meta.env.VITE_DICTIONARY_API_KEY;
const THESAURUS_API_KEY = import.meta.env.VITE_THESAURUS_API_KEY;

export interface DictionaryEntry {
  meta: {
    id: string;
    uuid: string;
    stems: string[];
  };
  hwi: {
    hw: string; // Headword
    prs?: Array<{
      mw: string; // Pronunciation
      sound?: {
        audio: string;
      };
    }>;
  };
  fl: string; // Functional label (part of speech)
  def: Array<{
    sseq: Array<Array<Array<any>>>;
  }>;
  shortdef: string[]; // Short definitions
}

export interface ThesaurusEntry {
  meta: {
    id: string;
    uuid: string;
    stems: string[];
  };
  hwi: {
    hw: string; // Headword
  };
  fl: string; // Functional label (part of speech)
  def: Array<{
    sseq: Array<Array<Array<any>>>;
  }>;
  meta_ants?: Array<{
    ants: string[][]; // Antonyms
  }>;
  meta_syns?: Array<{
    syns: string[][]; // Synonyms
  }>;
}

export interface WordData {
  word: string;
  definitions: string[];
  partOfSpeech: string;
  synonyms: string[];
  pronunciation?: string;
}

/**
 * Fetches word definition from Merriam-Webster Dictionary API
 * @param word The word to look up
 * @returns Promise with word definition data
 */
export const fetchWordDefinition = async (word: string): Promise<DictionaryEntry[]> => {
  try {
    const response = await fetch(
      `${DICTIONARY_BASE_URL}/${encodeURIComponent(word)}?key=${DICTIONARY_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Dictionary API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching word definition:', error);
    throw error;
  }
};

/**
 * Fetches word synonyms from Merriam-Webster Thesaurus API
 * @param word The word to look up
 * @returns Promise with thesaurus data
 */
export const fetchWordSynonyms = async (word: string): Promise<ThesaurusEntry[]> => {
  try {
    const response = await fetch(
      `${THESAURUS_BASE_URL}/${encodeURIComponent(word)}?key=${THESAURUS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Thesaurus API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching word synonyms:', error);
    throw error;
  }
};

/**
 * Extracts definitions from the dictionary API response
 * @param entries Dictionary entries
 * @returns Array of definitions
 */
export const extractDefinitions = (entries: DictionaryEntry[]): string[] => {
  if (!entries || entries.length === 0 || !Array.isArray(entries)) {
    return [];
  }
  
  if (typeof entries[0] === 'string') {
    return [];
  }
  
  return entries[0]?.shortdef || [];
};

/**
 * Extracts synonyms from the thesaurus API response
 * @param entries Thesaurus entries
 * @returns Array of synonyms
 */
export const extractSynonyms = (entries: ThesaurusEntry[]): string[] => {
  if (!entries || entries.length === 0 || !Array.isArray(entries)) {
    return [];
  }
  
  if (typeof entries[0] === 'string') {
    return [];
  }
  
  const synonymsArrays = entries[0]?.meta_syns?.[0]?.syns || [];
  return synonymsArrays.flat();
};

/**
 * Fetches complete word data including definitions and synonyms
 * @param word The word to look up
 * @returns Promise with complete word data
 */
export const fetchWordData = async (word: string): Promise<WordData | null> => {
  try {
    const [definitionEntries, synonymEntries] = await Promise.all([
      fetchWordDefinition(word),
      fetchWordSynonyms(word)
    ]);
    
    if (!definitionEntries.length || typeof definitionEntries[0] === 'string') {
      return null;
    }
    
    const definitions = extractDefinitions(definitionEntries);
    const synonyms = extractSynonyms(synonymEntries);
    
    return {
      word,
      definitions,
      partOfSpeech: definitionEntries[0]?.fl || '',
      synonyms,
      pronunciation: definitionEntries[0]?.hwi?.prs?.[0]?.mw
    };
  } catch (error) {
    console.error('Error fetching word data:', error);
    return null;
  }
};
