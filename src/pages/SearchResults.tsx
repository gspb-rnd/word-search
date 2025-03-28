import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CollateralItem, searchCollateralItems } from '../services/collateral/collateralService';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CollateralItem[]>([]);

  useEffect(() => {
    if (initialSearchTerm) {
      performSearch(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const performSearch = async (term: string) => {
    setIsSearching(true);
    try {
      const items = await searchCollateralItems(term);
      setResults(items);
    } catch (error) {
      console.error('Error searching collateral items:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    performSearch(searchTerm);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Collateral Search</h1>
        
        <div className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="Search collateral..."
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

        {!isSearching && results.length === 0 && initialSearchTerm && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-amber-600">No collateral items found matching "{initialSearchTerm}".</p>
            </CardContent>
          </Card>
        )}

        {!isSearching && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Search Results ({results.length})</h2>
            {results.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-500">Type:</div>
                    <div>{item.type}</div>
                    <div className="text-slate-500">Value:</div>
                    <div>${item.value.toLocaleString()}</div>
                    <div className="text-slate-500">Description:</div>
                    <div>{item.description}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
