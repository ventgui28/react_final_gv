import { Outlet } from 'react-router-dom';
import BarraNavegacao from './BarraNavegacao';

const LayoutPrincipal = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BarraNavegacao />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-gray-400 py-6 text-center mt-auto">
        <p>© 2025 CookBook - Guilherme Ventura - Projeto Final React</p>
      </footer>
    </div>
  );
};

export default LayoutPrincipal;
