import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Placeholder pages (created temporarily to avoid errors)
const Home = () => <div className="text-center"><h1 className="text-2xl">Home</h1></div>;
const Search = () => <div className="text-center"><h1 className="text-2xl">Pesquisa</h1></div>;
const Favorites = () => <div className="text-center"><h1 className="text-2xl">Favoritos</h1></div>;
const RecipeDetails = () => <div className="text-center"><h1 className="text-2xl">Detalhes</h1></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="recipe/:id" element={<RecipeDetails />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;