import { Outlet } from 'react-router-dom';
import BarraNavegacao from './BarraNavegacao';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../context/ThemeContext';
import { ShoppingListProvider } from '../context/ShoppingListContext';
import Neve from './Neve';
import ChatBot from './ChatBot';
import ScrollToTop from './ScrollToTop';
import Migalhas from './Migalhas';

const LayoutPrincipal = () => {
  return (
    <ThemeProvider>
      <ShoppingListProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-500 ease-in-out relative overflow-x-hidden">
          
          {/* Fundo Decorativo Reforçado */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Gradiente Laranja (Mais forte e visível) */}
            <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            
            {/* Gradiente Amarelo (Mais forte e visível) */}
            <div className="absolute -bottom-[10%] -left-[10%] w-[700px] h-[700px] bg-yellow-300/20 dark:bg-yellow-600/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
            
            {/* Padrão de Grelha (Grid Pattern) */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.6] dark:opacity-[0.4]"></div>
          </div>

          {/* Neve (Opcional) */}
          <Neve />
          
          <Toaster 
            position="top-center"
            containerStyle={{
              top: 20,
              left: 20,
              bottom: 20,
              right: 20,
              pointerEvents: 'none',
            }}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
              },
              success: {
                style: {
                  background: '#10B981',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
          
          {/* Conteúdo Principal */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <BarraNavegacao />
            <main className="flex-grow container mx-auto px-4 py-8 transition-all duration-500">
              <Migalhas />
              <Outlet />
            </main>
            <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 py-8 text-center mt-auto transition-colors duration-500">
              <div className="container mx-auto">
                <p className="font-medium">© 2025 CookBook</p>
                <p className="text-sm mt-2">Desenvolvido por Guilherme Ventura - Projeto Final React</p>
              </div>
            </footer>
          </div>

          {/* Componentes Flutuantes */}
          <ScrollToTop />
          <ChatBot />
        </div>
      </ShoppingListProvider>
    </ThemeProvider>
  );
};

export default LayoutPrincipal;
