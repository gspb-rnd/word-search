import React, { useState, KeyboardEvent } from 'react'
import { Search, Volume2, ExternalLink } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { fetchWordData, WordData } from '../services/dictionaryService'

function WordSearchApp() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [wordData, setWordData] = useState<WordData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    setError(null)
    
    try {
      const data = await fetchWordData(searchTerm.trim())
      
      if (!data) {
        setError(`No results found for "${searchTerm}". Please try another word.`)
        setWordData(null)
      } else {
        setWordData(data)
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const playAudio = (audioUrl: string) => {
    if (activeAudio) {
      activeAudio.pause()
    }
    
    const audio = new Audio(audioUrl)
    audio.play()
    setActiveAudio(audio)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Word Search</h1>
        
        <div className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="Enter a word..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !searchTerm.trim()}
            className="flex items-center gap-2"
          >
            <Search size={18} />
            Search
          </Button>
        </div>

        {isSearching && (
          <div className="text-center py-8">
            <p className="text-slate-600">Searching...</p>
          </div>
        )}

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {wordData && !isSearching && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold">{wordData.word}</CardTitle>
                  {wordData.phonetic && (
                    <CardDescription className="text-lg mt-1">{wordData.phonetic}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  {wordData.phonetics.filter(p => p.audio).map((phonetic, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => phonetic.audio && playAudio(phonetic.audio)}
                      title={phonetic.text || 'Listen to pronunciation'}
                    >
                      <Volume2 size={16} />
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={wordData.meanings[0]?.partOfSpeech || "tab-0"} className="mt-2">
                <TabsList className="mb-4">
                  {wordData.meanings.map((meaning, index) => (
                    <TabsTrigger key={index} value={meaning.partOfSpeech || `tab-${index}`}>
                      {meaning.partOfSpeech}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {wordData.meanings.map((meaning, index) => (
                  <TabsContent key={index} value={meaning.partOfSpeech || `tab-${index}`} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Definitions</h3>
                      <ul className="space-y-4">
                        {meaning.definitions.map((def, defIndex) => (
                          <li key={defIndex} className="pb-3">
                            <p className="text-slate-800 mb-1">{defIndex + 1}. {def.definition}</p>
                            
                            {def.example && (
                              <p className="text-slate-600 italic text-sm ml-5 mt-1">
                                "{def.example}"
                              </p>
                            )}
                            
                            {def.synonyms.length > 0 && (
                              <div className="mt-2 ml-5">
                                <span className="text-xs text-slate-500 mr-2">Synonyms:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {def.synonyms.map((syn, synIndex) => (
                                    <Badge key={synIndex} variant="secondary" className="text-xs">
                                      {syn}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {def.antonyms.length > 0 && (
                              <div className="mt-2 ml-5">
                                <span className="text-xs text-slate-500 mr-2">Antonyms:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {def.antonyms.map((ant, antIndex) => (
                                    <Badge key={antIndex} variant="outline" className="text-xs">
                                      {ant}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {defIndex < meaning.definitions.length - 1 && (
                              <Separator className="mt-3" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {(meaning.synonyms.length > 0 || meaning.antonyms.length > 0) && (
                      <div className="pt-2">
                        {meaning.synonyms.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Synonyms</h3>
                            <div className="flex flex-wrap gap-2">
                              {meaning.synonyms.map((synonym, synIndex) => (
                                <Badge key={synIndex} variant="secondary">
                                  {synonym}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {meaning.antonyms.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Antonyms</h3>
                            <div className="flex flex-wrap gap-2">
                              {meaning.antonyms.map((antonym, antIndex) => (
                                <Badge key={antIndex} variant="outline">
                                  {antonym}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
              
              {wordData.sourceUrls.length > 0 && (
                <div className="mt-8 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Sources</h3>
                  <ul className="space-y-1">
                    {wordData.sourceUrls.map((url, index) => (
                      <li key={index}>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default WordSearchApp
