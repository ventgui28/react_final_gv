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
        {/* Fundo Base: Ajustado para gray-950 no dark mode para maior contraste com os cartões */}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-500 ease-in-out relative overflow-x-hidden">
          
          {/* Fundo Decorativo Reforçado */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Gradiente Laranja */}
            <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            
            {/* Gradiente Amarelo */}
            <div className="absolute -bottom-[10%] -left-[10%] w-[700px] h-[700px] bg-yellow-300/20 dark:bg-yellow-600/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
            
            {/* Padrão de Grelha */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.6] dark:opacity-[0.3]"></div>
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
                background: '#1f2937', // dark:bg-gray-800
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
              },
              success: {
                style: {
                  background: '#ecfdf5', // green-50
                  color: '#065f46', // green-800
                  border: '1px solid #a7f3d0',
                },
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                style: {
                  background: '#fef2f2', // red-50
                  color: '#991b1b', // red-800
                  border: '1px solid #fecaca',
                },
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* Conteúdo Principal */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <BarraNavegacao />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-500">
              <Migalhas />
              <Outlet />
            </main>
            <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 py-10 text-center mt-auto transition-colors duration-500">
              <div className="container mx-auto px-4">
                <p className="font-bold text-lg mb-2">CookBook</p>
                <p className="text-sm">O teu companheiro de cozinha digital.</p>
                <p className="text-xs mt-4 opacity-70">© 2025 Guilherme Ventura</p>
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