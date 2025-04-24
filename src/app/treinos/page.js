import React from 'react';
import Link from 'next/link';

export default function TrainingPage() {
  return (
    <div className="fade-in min-h-screen bg-[#F5F5F5]">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#4CAF50]">ReVitaliza Fitness</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="nav-link">Início</Link>
              <Link href="/treinos" className="nav-link font-bold text-[#4CAF50]">Treinos</Link>
              <Link href="/saude" className="nav-link">Saúde</Link>
              <Link href="/perfil" className="nav-link">Perfil</Link>
              <Link href="/suporte" className="nav-link">Suporte</Link>
            </nav>
            
            <div className="md:hidden">
              <button className="text-[#212121]">
                <span className="material-icons">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Treinos</h2>
          <p className="text-xl">Exercícios adaptados para diferentes condições físicas</p>
        </div>
        
        {/* Agenda Semanal */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Agenda Semanal</h3>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-7 gap-4 mb-4">
                <div className="text-center font-bold">Segunda</div>
                <div className="text-center font-bold">Terça</div>
                <div className="text-center font-bold">Quarta</div>
                <div className="text-center font-bold">Quinta</div>
                <div className="text-center font-bold">Sexta</div>
                <div className="text-center font-bold">Sábado</div>
                <div className="text-center font-bold">Domingo</div>
              </div>
              
              <div className="grid grid-cols-7 gap-4">
                <div className="card p-4 min-h-[150px]">
                  <p className="font-bold mb-2">Alongamento</p>
                  <p className="text-sm text-gray-600 mb-2">09:00 - 09:15</p>
                  <button className="text-[#4CAF50] hover:underline text-sm">Ver detalhes</button>
                </div>
                
                <div className="card p-4 min-h-[150px]">
                  <p className="font-bold mb-2">Fortalecimento</p>
                  <p className="text-sm text-gray-600 mb-2">10:00 - 10:30</p>
                  <button className="text-[#4CAF50] hover:underline text-sm">Ver detalhes</button>
                </div>
                
                <div className="card p-4 min-h-[150px]">
                  <p className="font-bold mb-2">Descanso</p>
                  <p className="text-sm text-gray-600 mb-2">-</p>
                </div>
                
                <div className="card p-4 min-h-[150px]">
                  <p className="font-bold mb-2">Yoga</p>
                  <p className="text-sm text-gray-600 mb-2">09:30 - 10:15</p>
                  <button className="text-[#4CAF50] hover:underline text-sm">Ver detalhes</button>
                </div>
                
                <div className="card p-4 min-h-[150px]">
                  <p className="font-bold mb-2">Caminhada</p>
                  <p className="text-sm text-gray-600 mb-2">08:00 - 08:30</p>
                  <button className="text-[#4CAF50] hover:underline text-sm">Ver detalhes</button>
                </div>
                
                <div className="card p-4 min-h-[150px]">
                  <p className="font-bold mb-2">Alongamento</p>
                  <p className="text-sm text-gray-600 mb-2">10:00 - 10:15</p>
                  <button className="text-[#4CAF50] hover:underline text-sm">Ver detalhes</button>
                </div>
                
                <div className="card p-4 min-h-[150px]">
                  <p className="font-bold mb-2">Descanso</p>
                  <p className="text-sm text-gray-600 mb-2">-</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Catálogo de Treinos */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Catálogo de Treinos</h3>
            <div className="flex space-x-4">
              <select className="input-large py-2 px-4">
                <option>Todos os níveis</option>
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
              <select className="input-large py-2 px-4">
                <option>Todas as categorias</option>
                <option>Alongamento</option>
                <option>Fortalecimento</option>
                <option>Cardio</option>
                <option>Yoga</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Treino 1 */}
            <div className="card">
              <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                <p className="text-gray-500">Imagem do treino</p>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">Alongamento Matinal</h4>
                <p className="mb-4">Série de alongamentos suaves para começar o dia com mais disposição.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">15 minutos</span>
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Iniciante</span>
                </div>
                <button className="btn-primary w-full">Ver treino</button>
              </div>
            </div>
            
            {/* Treino 2 */}
            <div className="card">
              <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                <p className="text-gray-500">Imagem do treino</p>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">Fortalecimento de Pernas</h4>
                <p className="mb-4">Exercícios para fortalecer os músculos das pernas e melhorar a estabilidade.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">30 minutos</span>
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Intermediário</span>
                </div>
                <button className="btn-primary w-full">Ver treino</button>
              </div>
            </div>
            
            {/* Treino 3 */}
            <div className="card">
              <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                <p className="text-gray-500">Imagem do treino</p>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">Yoga para Iniciantes</h4>
                <p className="mb-4">Posturas básicas de yoga para melhorar a flexibilidade e reduzir o estresse.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">45 minutos</span>
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Iniciante</span>
                </div>
                <button className="btn-primary w-full">Ver treino</button>
              </div>
            </div>
            
            {/* Treino 4 */}
            <div className="card">
              <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                <p className="text-gray-500">Imagem do treino</p>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">Exercícios para Artrite</h4>
                <p className="mb-4">Movimentos suaves para aliviar a dor nas articulações e melhorar a mobilidade.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">20 minutos</span>
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Iniciante</span>
                </div>
                <button className="btn-primary w-full">Ver treino</button>
              </div>
            </div>
            
            {/* Treino 5 */}
            <div className="card">
              <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                <p className="text-gray-500">Imagem do treino</p>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">Caminhada Intervalada</h4>
                <p className="mb-4">Alternância entre caminhada leve e moderada para melhorar o condicionamento.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">30 minutos</span>
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Todos os níveis</span>
                </div>
                <button className="btn-primary w-full">Ver treino</button>
              </div>
            </div>
            
            {/* Treino 6 */}
            <div className="card">
              <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                <p className="text-gray-500">Imagem do treino</p>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">Equilíbrio e Coordenação</h4>
                <p className="mb-4">Exercícios para melhorar o equilíbrio e prevenir quedas.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">25 minutos</span>
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Intermediário</span>
                </div>
                <button className="btn-primary w-full">Ver treino</button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button className="btn-secondary">Carregar mais treinos</button>
          </div>
        </section>
        
        {/* Histórico de Treinos */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Histórico de Treinos</h3>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Data</th>
                    <th className="text-left py-4 px-4">Treino</th>
                    <th className="text-left py-4 px-4">Duração</th>
                    <th className="text-left py-4 px-4">Avaliação</th>
                    <th className="text-left py-4 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4">21/04/2025</td>
                    <td className="py-4 px-4">Alongamento Matinal</td>
                    <td className="py-4 px-4">15 minutos</td>
                    <td className="py-4 px-4">⭐⭐⭐⭐⭐</td>
                    <td className="py-4 px-4">
                      <button className="text-[#4CAF50] hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">20/04/2025</td>
                    <td className="py-4 px-4">Yoga para Iniciantes</td>
                    <td className="py-4 px-4">45 minutos</td>
                    <td className="py-4 px-4">⭐⭐⭐⭐</td>
                    <td className="py-4 px-4">
                      <button className="text-[#4CAF50] hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">19/04/2025</td>
                    <td className="py-4 px-4">Caminhada Intervalada</td>
                    <td className="py-4 px-4">30 minutos</td>
                    <td className="py-4 px-4">⭐⭐⭐⭐⭐</td>
                    <td className="py-4 px-4">
                      <button className="text-[#4CAF50] hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">17/04/2025</td>
                    <td className="py-4 px-4">Fortalecimento de Pernas</td>
                    <td className="py-4 px-4">30 minutos</td>
                    <td className="py-4 px-4">⭐⭐⭐</td>
                    <td className="py-4 px-4">
                      <button className="text-[#4CAF50] hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-center">
              <button className="text-[#4CAF50] hover:underline font-medium">Ver histórico completo</button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} ReVitaliza Fitness. Todos os direitos reservados.</p>
            <div className="mt-4">
              <Link href="/termos" className="text-[#4CAF50] hover:underline mx-2">Termos de Uso</Link>
              <Link href="/privacidade" className="text-[#4CAF50] hover:underline mx-2">Política de Privacidade</Link>
              <Link href="/suporte" className="text-[#4CAF50] hover:underline mx-2">Suporte</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
