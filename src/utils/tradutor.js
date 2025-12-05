// Dicionário simples para traduzir termos comuns de culinária PT -> EN
// Isto permite que o utilizador pesquise em Português e a API (que é em Inglês) entenda.

const dicionario = {
  // Proteínas
  'frango': 'chicken',
  'carne': 'beef',
  'carne de vaca': 'beef',
  'vaca': 'beef',
  'porco': 'pork',
  'peixe': 'fish',
  'salmão': 'salmon',
  'atum': 'salmon', // MealDB tem pouco tuna, salmon funciona melhor como fallback genérico de peixe
  'camarão': 'shrimp',
  'ovo': 'egg',
  'ovos': 'eggs',
  'bacon': 'bacon',
  'pato': 'duck',
  'peru': 'duck', // Fallback
  'cordeiro': 'lamb',
  'cabrito': 'lamb',

  // Hidratos e Acompanhamentos
  'arroz': 'rice',
  'massa': 'pasta',
  'esparguete': 'spaghetti',
  'batata': 'potato',
  'batatas': 'potatoes',
  'pão': 'bread',
  'queijo': 'cheese',
  'cogumelos': 'mushroom',

  // Tipos de Prato
  'sopa': 'soup',
  'salada': 'salad',
  'tarte': 'pie',
  'bolo': 'cake',
  'sobremesa': 'dessert',
  'pequeno almoço': 'breakfast',
  'lanche': 'starter',
  'hamburguer': 'burger',
  'pizza': 'pizza',
  'sandes': 'sandwich',
  'lasanha': 'lasagna',

  // Sabores / Ingredientes Chave
  'chocolate': 'chocolate',
  'morango': 'strawberry',
  'banana': 'banana',
  'limão': 'lemon',
  'laranja': 'orange',
  'maçã': 'apple',
  'tomate': 'tomato',
  'abacate': 'avocado'
};

/**
 * Tenta traduzir um termo de PT para EN.
 * Se não encontrar no dicionário, devolve o termo original.
 * @param {string} termo - O termo em português
 * @returns {string} - O termo em inglês ou o original
 */
export const traduzirTermo = (termo) => {
  if (!termo) return '';
  const termoLimpo = termo.toLowerCase().trim();
  return dicionario[termoLimpo] || termo;
};
