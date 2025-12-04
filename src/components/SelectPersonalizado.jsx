import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SelectPersonalizado = ({ options, value, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Encontrar o label da opção selecionada
  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Botão Principal (Trigger) */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm 
          flex items-center justify-between transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-orange-300'}
          ${isOpen ? 'ring-2 ring-orange-200 dark:ring-orange-900 border-orange-500' : ''}
        `}
      >
        <span className={`block truncate font-medium ${!value ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
          {selectedLabel}
        </span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Lista de Opções (Dropdown) */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-auto scrollbar-hide"
          >
            <ul className="py-1">
              {/* Opção "Limpar" / Placeholder */}
              <li
                onClick={() => handleSelect('')}
                className="px-4 py-2 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer italic"
              >
                {placeholder} (Limpar)
              </li>

              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors
                    ${value === option.value 
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-bold' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check size={16} className="text-orange-500" />}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectPersonalizado;
