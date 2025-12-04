import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const Estatisticas = ({ favoritos }) => {
  // Processar dados para o Gráfico de Categorias (Pie)
  const dadosCategoria = favoritos.reduce((acc, curr) => {
    const cat = curr.strCategory;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(dadosCategoria).map(key => ({
    name: key,
    value: dadosCategoria[key]
  })).sort((a, b) => b.value - a.value); // Ordenar por valor

  // Processar dados para o Gráfico de Áreas (Bar)
  const dadosArea = favoritos.reduce((acc, curr) => {
    const area = curr.strArea;
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(dadosArea).map(key => ({
    name: key,
    quantidade: dadosArea[key]
  })).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5); // Top 5 áreas

  // Cores para o Pie Chart
  const COLORS = ['#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'];

  if (favoritos.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="grid md:grid-cols-2 gap-6 mb-10"
    >
      {/* Gráfico de Categorias (Pizza) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">Por Categoria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#333' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Áreas (Barras) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">Top 5 Origens</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="quantidade" fill="#EA580C" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default Estatisticas;
