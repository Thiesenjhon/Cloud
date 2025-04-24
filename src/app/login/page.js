import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="fade-in min-h-screen flex items-center justify-center bg-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
          <p className="text-xl">Entre na sua conta do ReVitaliza Fitness</p>
        </div>
        
        <form className="mt-8 space-y-6">
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
              autoComplete="current-password"
              required
              className="input-large"
              placeholder="Sua senha"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-6 w-6 text-[#4CAF50] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-lg">
                Lembrar de mim
              </label>
            </div>
            
            <div>
              <Link href="/recuperar-senha" className="text-[#2196F3] hover:underline text-lg">
                Esqueceu a senha?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Entrar
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-lg">
            Ainda não tem uma conta?{' '}
            <Link href="/registro" className="text-[#4CAF50] hover:underline font-medium">
              Criar conta
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-lg mb-4">Ou entre com</p>
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
