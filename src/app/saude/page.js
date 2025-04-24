import React from 'react';
import Link from 'next/link';

export default function HealthPage() {
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
              <Link href="/treinos" className="nav-link">Treinos</Link>
              <Link href="/saude" className="nav-link font-bold text-[#4CAF50]">Saúde</Link>
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
          <h2 className="text-3xl font-bold mb-2">Monitoramento de Saúde</h2>
          <p className="text-xl">Acompanhe seus indicadores de saúde e mantenha-se informado</p>
        </div>
        
        {/* Registrar Indicadores */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Registrar Indicadores</h3>
          <div className="card">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-2">Pressão arterial</label>
                  <input type="text" className="input-large" placeholder="Ex: 120/80" />
                  <p className="text-sm text-gray-500 mt-1">Formato: sistólica/diastólica</p>
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-2">Peso (kg)</label>
                  <input type="number" step="0.1" className="input-large" placeholder="Ex: 70.5" />
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-2">Glicemia (mg/dL)</label>
                  <input type="number" className="input-large" placeholder="Ex: 100" />
                  <p className="text-sm text-gray-500 mt-1">Em jejum ou após refeição</p>
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-2">Como está se sentindo?</label>
                  <select className="input-large">
                    <option>Muito bem</option>
                    <option>Bem</option>
                    <option>Regular</option>
                    <option>Mal</option>
                    <option>Muito mal</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-lg font-medium mb-2">Observações</label>
                  <textarea className="input-large min-h-[100px]" placeholder="Alguma observação sobre sua saúde hoje?"></textarea>
                </div>
              </div>
              
              <div className="mt-6">
                <button type="submit" className="btn-primary">Salvar registro</button>
              </div>
            </form>
          </div>
        </section>
        
        {/* Gráficos */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Evolução dos Indicadores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="text-xl font-bold mb-4">Pressão Arterial</h4>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de pressão arterial</p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg">Média dos últimos 7 dias: <span className="font-bold">128/82</span></p>
              </div>
            </div>
            
            <div className="card">
              <h4 className="text-xl font-bold mb-4">Peso</h4>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de peso</p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg">Média dos últimos 7 dias: <span className="font-bold">72.6 kg</span></p>
              </div>
            </div>
            
            <div className="card">
              <h4 className="text-xl font-bold mb-4">Glicemia</h4>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de glicemia</p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg">Média dos últimos 7 dias: <span className="font-bold">105 mg/dL</span></p>
              </div>
            </div>
            
            <div className="card">
              <h4 className="text-xl font-bold mb-4">Bem-estar</h4>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de bem-estar</p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg">Estado predominante: <span className="font-bold">Bem</span></p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Histórico */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Histórico de Registros</h3>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Data</th>
                    <th className="text-left py-4 px-4">Pressão</th>
                    <th className="text-left py-4 px-4">Peso</th>
                    <th className="text-left py-4 px-4">Glicemia</th>
                    <th className="text-left py-4 px-4">Bem-estar</th>
                    <th className="text-left py-4 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4">22/04/2025</td>
                    <td className="py-4 px-4">130/85</td>
                    <td className="py-4 px-4">72.5 kg</td>
                    <td className="py-4 px-4">110 mg/dL</td>
                    <td className="py-4 px-4">Bem</td>
                    <td className="py-4 px-4">
                      <button className="text-[#4CAF50] hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">21/04/2025</td>
                    <td className="py-4 px-4">128/82</td>
                    <td className="py-4 px-4">72.8 kg</td>
                    <td className="py-4 px-4">105 mg/dL</td>
                    <td className="py-4 px-4">Muito bem</td>
                    <td className="py-4 px-4">
                      <button className="text-[#4CAF50] hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">20/04/2025</td>
                    <td className="py-4 px-4">132/84</td>
                    <td className="py-4 px-4">73.0 kg</td>
                    <td className="py-4 px-4">108 mg/dL</td>
                    <td className="py-4 px-4">Regular</td>
                    <td className="py-4 px-4">
                      <button className="text-[#4CAF50] hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">19/04/2025</td>
                    <td className="py-4 px-4">126/80</td>
                    <td className="py-4 px-4">73.2 kg</td>
                    <td className="py-4 px-4">102 mg/dL</td>
                    <td className="py-4 px-4">Bem</td>
                    <td className="py-4 px-4">
                      <button className="text-[#4CAF50] hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button className="text-[#4CAF50] hover:underline font-medium">Ver histórico completo</button>
              <button className="btn-secondary">Gerar relatório PDF</button>
            </div>
          </div>
        </section>
        
        {/* Lembretes */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Lembretes Personalizados</h3>
            <button className="btn-primary">Adicionar lembrete</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold mb-2">Medicação: Pressão</h4>
                  <p className="mb-2">Todos os dias às 08:00</p>
                  <p className="text-gray-600">Tomar medicamento para pressão após o café da manhã</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[#2196F3] hover:underline">Editar</button>
                  <button className="text-[#D32F2F] hover:underline">Excluir</button>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold mb-2">Beber água</h4>
                  <p className="mb-2">A cada 2 horas</p>
                  <p className="text-gray-600">Lembrete para beber um copo de água</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[#2196F3] hover:underline">Editar</button>
                  <button className="text-[#D32F2F] hover:underline">Excluir</button>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold mb-2">Medir glicemia</h4>
                  <p className="mb-2">Segunda, quarta e sexta às 07:30</p>
                  <p className="text-gray-600">Medir glicemia em jejum</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[#2196F3] hover:underline">Editar</button>
                  <button className="text-[#D32F2F] hover:underline">Excluir</button>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold mb-2">Consulta médica</h4>
                  <p className="mb-2">28/04/2025 às 14:00</p>
                  <p className="text-gray-600">Consulta com Dr. Silva - Cardiologista</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[#2196F3] hover:underline">Editar</button>
                  <button className="text-[#D32F2F] hover:underline">Excluir</button>
                </div>
              </div>
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
