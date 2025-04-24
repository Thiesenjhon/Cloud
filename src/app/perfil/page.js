import React from 'react';
import Link from 'next/link';

export default function ProfilePage() {
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
              <Link href="/saude" className="nav-link">Saúde</Link>
              <Link href="/perfil" className="nav-link font-bold text-[#4CAF50]">Perfil</Link>
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
          <h2 className="text-3xl font-bold mb-2">Meu Perfil</h2>
          <p className="text-xl">Gerencie suas informações pessoais, metas e conquistas</p>
        </div>
        
        {/* Informações Pessoais */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Informações Pessoais</h3>
            <button className="btn-secondary">Editar perfil</button>
          </div>
          
          <div className="card">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6 flex flex-col items-center">
                <div className="bg-gray-200 h-48 w-48 rounded-full flex items-center justify-center mb-4">
                  <p className="text-gray-500">Foto de perfil</p>
                </div>
                <button className="text-[#4CAF50] hover:underline font-medium">Alterar foto</button>
              </div>
              
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 mb-1">Nome completo</p>
                    <p className="text-xl font-medium">Maria Silva</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">E-mail</p>
                    <p className="text-xl font-medium">maria.silva@email.com</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Idade</p>
                    <p className="text-xl font-medium">67 anos</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Membro desde</p>
                    <p className="text-xl font-medium">Janeiro de 2025</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Condições de saúde</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Hipertensão</span>
                      <span className="bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium">Artrite</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 mb-1">Nível de atividade</p>
                    <p className="text-xl font-medium">Iniciante</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Metas */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Minhas Metas</h3>
            <button className="btn-primary">Adicionar meta</button>
          </div>
          
          <div className="card">
            <div className="space-y-6">
              <div className="flex items-center">
                <input type="checkbox" className="h-6 w-6 text-[#4CAF50] border-gray-300 rounded mr-4" />
                <div className="flex-1">
                  <h4 className="text-xl font-bold">Caminhar 30 minutos por dia</h4>
                  <p className="text-gray-600">Meta para melhorar o condicionamento cardiovascular</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[#2196F3] hover:underline">Editar</button>
                  <button className="text-[#D32F2F] hover:underline">Excluir</button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" className="h-6 w-6 text-[#4CAF50] border-gray-300 rounded mr-4" checked />
                <div className="flex-1">
                  <h4 className="text-xl font-bold line-through">Fazer alongamento todos os dias</h4>
                  <p className="text-gray-600 line-through">Meta para melhorar a flexibilidade</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[#2196F3] hover:underline">Editar</button>
                  <button className="text-[#D32F2F] hover:underline">Excluir</button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" className="h-6 w-6 text-[#4CAF50] border-gray-300 rounded mr-4" />
                <div className="flex-1">
                  <h4 className="text-xl font-bold">Perder 3kg em 3 meses</h4>
                  <p className="text-gray-600">Meta para atingir peso saudável</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[#2196F3] hover:underline">Editar</button>
                  <button className="text-[#D32F2F] hover:underline">Excluir</button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" className="h-6 w-6 text-[#4CAF50] border-gray-300 rounded mr-4" />
                <div className="flex-1">
                  <h4 className="text-xl font-bold">Reduzir pressão arterial</h4>
                  <p className="text-gray-600">Meta para manter pressão abaixo de 130/85</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[#2196F3] hover:underline">Editar</button>
                  <button className="text-[#D32F2F] hover:underline">Excluir</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Conquistas */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Minhas Conquistas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="bg-[#4CAF50] text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl">emoji_events</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Primeira Semana</h4>
              <p className="text-gray-600">Completou uma semana de atividades</p>
              <p className="text-[#4CAF50] font-medium mt-2">Conquistado em 15/01/2025</p>
            </div>
            
            <div className="card text-center">
              <div className="bg-[#4CAF50] text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl">favorite</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Saúde em Dia</h4>
              <p className="text-gray-600">Registrou indicadores de saúde por 30 dias consecutivos</p>
              <p className="text-[#4CAF50] font-medium mt-2">Conquistado em 14/02/2025</p>
            </div>
            
            <div className="card text-center">
              <div className="bg-[#4CAF50] text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl">directions_run</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Maratonista</h4>
              <p className="text-gray-600">Completou 10 treinos de caminhada</p>
              <p className="text-[#4CAF50] font-medium mt-2">Conquistado em 05/03/2025</p>
            </div>
            
            <div className="card text-center bg-gray-100">
              <div className="bg-gray-400 text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl">fitness_center</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Mestre do Fortalecimento</h4>
              <p className="text-gray-600">Complete 20 treinos de fortalecimento</p>
              <p className="text-gray-500 font-medium mt-2">Ainda não conquistado</p>
            </div>
            
            <div className="card text-center bg-gray-100">
              <div className="bg-gray-400 text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl">self_improvement</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Yogi</h4>
              <p className="text-gray-600">Complete 15 treinos de yoga</p>
              <p className="text-gray-500 font-medium mt-2">Ainda não conquistado</p>
            </div>
            
            <div className="card text-center bg-gray-100">
              <div className="bg-gray-400 text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl">verified</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Meta Alcançada</h4>
              <p className="text-gray-600">Complete sua primeira meta</p>
              <p className="text-gray-500 font-medium mt-2">Ainda não conquistado</p>
            </div>
          </div>
        </section>
        
        {/* Configurações de Acessibilidade */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Configurações de Acessibilidade</h3>
          
          <div className="card">
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold mb-4">Tamanho da fonte</h4>
                <div className="flex space-x-4">
                  <button className="btn-secondary">Normal</button>
                  <button className="btn-primary">Grande</button>
                  <button className="btn-secondary">Extra grande</button>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-bold mb-4">Tema</h4>
                <div className="flex space-x-4">
                  <button className="btn-primary">Claro</button>
                  <button className="btn-secondary">Escuro</button>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-bold mb-4">Notificações</h4>
                <div className="flex items-center">
                  <input type="checkbox" className="h-6 w-6 text-[#4CAF50] border-gray-300 rounded mr-4" checked />
                  <label className="text-lg">Ativar notificações</label>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-bold mb-4">Compartilhar com família</h4>
                <div className="flex items-center mb-4">
                  <input type="checkbox" className="h-6 w-6 text-[#4CAF50] border-gray-300 rounded mr-4" checked />
                  <label className="text-lg">Permitir que familiares vejam meus dados</label>
                </div>
                <div>
                  <input type="email" className="input-large mb-2" placeholder="E-mail do familiar" />
                  <button className="btn-secondary">Adicionar familiar</button>
                </div>
                <div className="mt-4">
                  <p className="font-medium mb-2">Familiares com acesso:</p>
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <p>joao.silva@email.com (Filho)</p>
                    <button className="text-[#D32F2F] hover:underline">Remover</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>ana.medica@email.com (Médica)</p>
                    <button className="text-[#D32F2F] hover:underline">Remover</button>
                  </div>
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
