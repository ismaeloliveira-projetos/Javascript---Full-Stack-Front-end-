# 📘 Front-end – Encurtador de URL (Next.js + TypeScript)

Este é o front-end do sistema de encurtamento de URLs, desenvolvido em **Next.js**, utilizando **TypeScript** e consumindo a API hospedada em:

🔗 **https://shortener-backend-7qu0.onrender.com**

---

## 🖼️ Interface

<img width="1884" height="899" alt="Captura de tela" src="https://github.com/user-attachments/assets/a9aa925a-964f-451f-9ae4-91436815573d" />

---

## 🚀 Funcionalidades

- Interface simples e intuitiva para encurtar URLs  
- Consumo da API backend (NestJS)  
- Exibição do código encurtado  
- Copiar URL encurtada para a área de transferência  
- Tratamento básico de erros  
- Tipagem completa com TypeScript  

---

## 🛠️ Tecnologias

- **Next.js 14+ (App Router)**
- **TypeScript**
- **CSS / Tailwind** (se estiver usando)
- **Fetch API / Axios**
- **Deploy opcional em Vercel**

---

## 🔧 Variáveis de Ambiente

Crie um arquivo **.env.local** na raiz:

```env
NEXT_PUBLIC_API_URL=https://shortener-backend-7qu0.onrender.com
NEXT_PUBLIC_API_KEY=f47ac10b-58cc-4372-a567-0e02b2c3d479
📦 Instalação
1️⃣ Instalar dependências
npm install


ou

yarn install

▶️ Executar o Projeto
Ambiente de desenvolvimento
npm run dev


A aplicação estará disponível em:

👉 http://localhost:3000

🔗 Integração com o Backend
Exemplo de chamada POST /shorten:
export async function shortenUrl(originalUrl: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({ originalUrl }),
  });

  if (!res.ok) {
    throw new Error('Erro ao encurtar URL');
  }

  return res.json();
}

🧱 Scripts úteis
Comando	Descrição
npm run dev	Inicia o ambiente de desenvolvimento
npm run build	Gera build de produção
npm run start	Executa o build
npm run lint	Verifica o código
🌐 Deploy

Frontend hospedado em:

🔗 https://javascript-full-stack-front-end.vercel.app/

Variáveis de ambiente na Vercel:

NEXT_PUBLIC_API_URL
NEXT_PUBLIC_API_KEY
