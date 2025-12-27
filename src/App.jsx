import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LayoutPrincipal from './components/LayoutPrincipal';
import Inicio from './pages/Inicio';
import Pesquisa from './pages/Pesquisa';
import Favoritos from './pages/Favoritos';
import DetalhesReceita from './pages/DetalhesReceita';
import ListaCompras from './pages/ListaCompras';
import Frigorifico from './pages/Frigorifico';
import Definicoes from './pages/Definicoes';
import NaoEncontrado from './pages/NaoEncontrado';

// Componente para gerir as animações de rota
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LayoutPrincipal />}>
          <Route 
            index 
            element={
              <PageTransition>
                <Inicio />
              </PageTransition>
            } 
          />
          <Route 
            path="pesquisa" 
            element={
              <PageTransition>
                <Pesquisa />
              </PageTransition>
            } 
          />
          <Route 
            path="frigorifico" 
            element={
              <PageTransition>
                <Frigorifico />
              </PageTransition>
            } 
          />
          <Route 
            path="receita/:id" 
            element={
              <PageTransition>
                <DetalhesReceita />
              </PageTransition>
            } 
          />
          <Route 
            path="favoritos" 
            element={
              <PageTransition>
                <Favoritos />
              </PageTransition>
            } 
          />
          <Route 
            path="lista-compras" 
            element={
              <PageTransition>
                <ListaCompras />
              </PageTransition>
            } 
          />
          <Route 
            path="definicoes" 
            element={
              <PageTransition>
                <Definicoes />
              </PageTransition>
            } 
          />
          <Route 
            path="*" 
            element={
              <PageTransition>
                <NaoEncontrado />
              </PageTransition>
            } 
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

// Componente Wrapper para a Animação
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }} basename={import.meta.env.BASE_URL}>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;