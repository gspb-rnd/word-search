import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { CollateralItem, searchCollateralItems } from '../services/collateral/collateralService';

interface SearchBarProps {
  placeholder?: string;
  maxDropdownItems?: number;
}

function SearchBar({ placeholder = "Search collateral...", maxDropdownItems = 5 }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownItems, setDropdownItems] = useState<CollateralItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchDropdownItems(searchTerm);
      } else {
        setDropdownItems([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchDropdownItems = async (term: string) => {
    setIsSearching(true);
    try {
      const items = await searchCollateralItems(term);
      setDropdownItems(items.slice(0, maxDropdownItems));
      setShowDropdown(items.length > 0);
    } catch (error) {
      console.error('Error fetching dropdown items:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleItemClick = (item: CollateralItem) => {
    setSearchTerm(item.name);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(item.name)}`);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <DropdownMenu open={showDropdown}>
          <DropdownMenuTrigger asChild>
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            ref={dropdownRef}
            className="w-[300px] max-h-[300px] overflow-y-auto"
            align="start"
          >
            {dropdownItems.map((item) => (
              <DropdownMenuItem 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="cursor-pointer"
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || !searchTerm.trim()}
          className="flex items-center gap-2"
        >
          <Search size={18} />
          Search
        </Button>
      </div>
    </div>
  );
}

export default SearchBar;
