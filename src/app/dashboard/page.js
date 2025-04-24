import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
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
              <Link href="/dashboard" className="nav-link font-bold text-[#4CAF50]">Início</Link>
              <Link href="/treinos" className="nav-link">Treinos</Link>
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
          <h2 className="text-3xl font-bold mb-2">Olá, Maria!</h2>
          <p className="text-xl">Bem-vinda de volta. Vamos cuidar da sua saúde hoje?</p>
        </div>
        
        {/* Treino do Dia */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Seu treino de hoje</h3>
          <div className="card">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                <h4 className="text-xl font-bold mb-4">Alongamento Matinal</h4>
                <p className="mb-4">Série de alongamentos suaves para começar o dia com mais disposição.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">15 minutos</span>
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Iniciante</span>
                  <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Alongamento</span>
                </div>
                <div className="flex space-x-4">
                  <button className="btn-primary">Ver vídeo</button>
                  <button className="btn-secondary">Marcar como concluído</button>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Imagem do treino</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mensagem do Dia */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Mensagem do dia</h3>
          <div className="card bg-[#E8F5E9] border-l-4 border-[#4CAF50]">
            <blockquote className="text-xl italic">
              "Cada pequeno passo é uma vitória. Continue cuidando da sua saúde!"
            </blockquote>
            <p className="mt-4 font-medium">— Equipe ReVitaliza</p>
          </div>
        </section>
        
        {/* Monitoramento de Saúde */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Monitoramento de saúde</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="text-xl font-bold mb-4">Registrar indicadores</h4>
              <form>
                <div className="mb-4">
                  <label className="block text-lg font-medium mb-2">Pressão arterial</label>
                  <input type="text" className="input-large" placeholder="Ex: 120/80" />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium mb-2">Peso (kg)</label>
                  <input type="number" className="input-large" placeholder="Ex: 70.5" />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium mb-2">Glicemia (mg/dL)</label>
                  <input type="number" className="input-large" placeholder="Ex: 100" />
                </div>
                <button type="submit" className="btn-primary w-full">Salvar registro</button>
              </form>
            </div>
            
            <div className="card">
              <h4 className="text-xl font-bold mb-4">Últimos registros</h4>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="font-medium">21/04/2025</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Pressão</p>
                      <p className="font-medium">130/85</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Peso</p>
                      <p className="font-medium">72.5 kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Glicemia</p>
                      <p className="font-medium">110 mg/dL</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <p className="font-medium">20/04/2025</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Pressão</p>
                      <p className="font-medium">128/82</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Peso</p>
                      <p className="font-medium">72.8 kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Glicemia</p>
                      <p className="font-medium">105 mg/dL</p>
                    </div>
                  </div>
                </div>
                
                <Link href="/saude" className="text-[#4CAF50] hover:underline font-medium block text-center">
                  Ver histórico completo
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Próximos Treinos */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Próximos treinos</h3>
          <div className="card">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-bold">Fortalecimento de Pernas</h4>
                  <p className="text-gray-600">Amanhã, 09:00</p>
                </div>
                <button className="text-[#4CAF50] hover:underline font-medium">
                  Ver detalhes
                </button>
              </div>
              
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-bold">Yoga para Iniciantes</h4>
                  <p className="text-gray-600">24/04/2025, 10:30</p>
                </div>
                <button className="text-[#4CAF50] hover:underline font-medium">
                  Ver detalhes
                </button>
              </div>
              
              <Link href="/treinos" className="text-[#4CAF50] hover:underline font-medium block text-center">
                Ver todos os treinos
              </Link>
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
