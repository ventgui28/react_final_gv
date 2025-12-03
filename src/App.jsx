import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutPrincipal from './components/LayoutPrincipal';
import Inicio from './pages/Inicio';
import Pesquisa from './pages/Pesquisa';
import Favoritos from './pages/Favoritos';
import DetalhesReceita from './pages/DetalhesReceita';
import ListaCompras from './pages/ListaCompras';
import NaoEncontrado from './pages/NaoEncontrado';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
          <Route index element={<Inicio />} />
          <Route path="pesquisa" element={<Pesquisa />} />
          <Route path="receita/:id" element={<DetalhesReceita />} />
          <Route path="favoritos" element={<Favoritos />} />
          <Route path="lista-compras" element={<ListaCompras />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
