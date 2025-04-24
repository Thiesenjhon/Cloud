import React from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="fade-in min-h-screen flex items-center justify-center bg-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Criar sua conta</h1>
          <p className="text-xl">Junte-se ao ReVitaliza Fitness e comece sua jornada para uma vida mais saudável</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Nome completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input-large"
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-large"
              placeholder="Seu e-mail"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-lg font-medium mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input-large"
              placeholder="Crie uma senha"
            />
            <p className="text-sm text-gray-500 mt-1">A senha deve ter pelo menos 8 caracteres</p>
          </div>
          
          <div>
            <label htmlFor="age" className="block text-lg font-medium mb-2">
              Idade
            </label>
            <input
              id="age"
              name="age"
              type="number"
              required
              className="input-large"
              placeholder="Sua idade"
              min="18"
              max="120"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-6 w-6 text-[#4CAF50] border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-lg">
              Concordo com os <Link href="/termos" className="text-[#2196F3] hover:underline">Termos de Uso</Link> e <Link href="/privacidade" className="text-[#2196F3] hover:underline">Política de Privacidade</Link>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Criar Conta
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-lg">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[#4CAF50] hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-lg mb-4">Ou registre-se com</p>
            <div className="flex justify-center space-x-4">
              <button className="btn-secondary px-6">
                Google
              </button>
              <button className="btn-secondary px-6">
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
