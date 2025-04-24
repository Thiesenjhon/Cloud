// src/app/layout.js (atualizado)
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'ReVitaliza Fitness',
  description: 'Plataforma de saúde e bem-estar para o público 50+',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
