import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutPrincipal from './components/LayoutPrincipal';
import Inicio from './pages/Inicio';
import Pesquisa from './pages/Pesquisa';
import Favoritos from './pages/Favoritos';
import DetalhesReceita from './pages/DetalhesReceita';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
          <Route index element={<Inicio />} />
          <Route path="pesquisa" element={<Pesquisa />} />
          <Route path="receita/:id" element={<DetalhesReceita />} />
          <Route path="favoritos" element={<Favoritos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
