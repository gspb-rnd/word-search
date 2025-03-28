
import { Link } from 'react-router-dom'
import { Button } from './components/ui/button'
import SearchBar from './components/SearchBar'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Collateral Tracker</h1>
        
        <div className="mb-8">
          <SearchBar placeholder="Search collateral items..." />
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button asChild>
            <Link to="/word-search">Word Search App</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/search">Collateral Search</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
