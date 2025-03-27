import { useState, KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { fetchWordData, WordData } from './services/dictionaryService'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [wordData, setWordData] = useState<WordData | null>(null)
  const [error, setError] = useState<string | null>(null)

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
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">{wordData.word}</h2>
              
              {wordData.pronunciation && (
                <p className="text-slate-500 mb-4">/{wordData.pronunciation}/</p>
              )}
              
              {wordData.partOfSpeech && (
                <p className="text-sm font-medium text-slate-600 mb-2">{wordData.partOfSpeech}</p>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Definitions</h3>
                {wordData.definitions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {wordData.definitions.map((definition, index) => (
                      <li key={index} className="text-slate-700">{definition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">No definitions found.</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Synonyms</h3>
                {wordData.synonyms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {wordData.synonyms.map((synonym, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-sm"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No synonyms found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App
