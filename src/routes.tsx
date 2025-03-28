
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SearchResults from './pages/SearchResults';
import WordSearchApp from './pages/WordSearchApp';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/search',
    element: <SearchResults />,
  },
  {
    path: '/word-search',
    element: <WordSearchApp />,
  },
]);

export default router;
