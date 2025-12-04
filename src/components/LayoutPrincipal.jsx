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
          
          {/* Fundo Decorativo (Background Pattern & Gradients) */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Gradiente Laranja Suave (Topo Direito) */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-300/30 dark:bg-orange-900/20 rounded-full blur-[100px] opacity-50 dark:opacity-30 animate-pulse-slow"></div>
            
            {/* Gradiente Amarelo Suave (Baixo Esquerdo) */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-200/30 dark:bg-yellow-900/10 rounded-full blur-[120px] opacity-40 dark:opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            
            {/* Padrão de Pontos (Dot Pattern) */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 dark:opacity-10"></div>
          </div>

          {/* Neve cai sobre tudo (opcional, para Natal) */}
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
          
          {/* Conteúdo Principal (com z-10 para ficar acima do fundo) */}
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