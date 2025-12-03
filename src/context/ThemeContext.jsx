import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Inicializa o estado lendo do localStorage ou da preferência do sistema
  const [temaEscuro, setTemaEscuro] = useState(() => {
    const temaGuardado = localStorage.getItem('theme');
    // Se houver preferência guardada, usa-a. Se não, verifica a preferência do sistema.
    if (temaGuardado) {
      return temaGuardado === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (temaEscuro) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [temaEscuro]);

  const alternarTema = () => {
    setTemaEscuro(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ temaEscuro, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);