
'use client';

import React from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="fade-in min-h-screen bg-[#F5F5F5]">
      {/* conteúdo original omitido por brevidade */}
      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p>&copy; {currentYear} ReVitaliza Fitness. Todos os direitos reservados.</p>
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
