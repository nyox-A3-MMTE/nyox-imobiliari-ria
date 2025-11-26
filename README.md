🏠 Nyox Imobiliária
Sistema completo, moderno e profissional para gerenciamento, listagem e administração de imóveis.
✨ Visão Geral

O Nyox Imobiliária foi desenvolvido para oferecer eficiência, velocidade e organização no gerenciamento de imóveis.
Com uma arquitetura moderna, o sistema entrega uma experiência fluida tanto no catálogo público quanto no painel administrativo.

🏡 Funcionalidades
🔍 Catálogo Público

Listagem aberta ao público

Interface moderna e responsiva

Visual limpo e direto

🔐 Autenticação

Criação de conta opcional

Login seguro com JWT

Controle de acesso inteligente

🛠️ Painel Administrativo

Exclusivo para administradores

CRUD completo de imóveis

Gerenciamento rápido e eficiente

⚙️ Tecnologias Utilizadas
Camada	Tecnologias
Frontend	React, Vite, React Router, Vitest, Testing Library
Backend	Node.js, Express, Supabase, JWT, Cucumber.js
Outros	LocationIQ (Geocodificação)
🚀 Como Executar o Projeto
🔧 1. Clonar o repositório
git clone https://github.com/nyox-A3-MMTE/nyox-imobiliari-ria.git
cd nyox-imobiliari-ria/

🔧 2. Configurar Variáveis de Ambiente
📌 Backend
cd src/api


Crie o arquivo .env:

SUPABASE_URL=<sua_url_supabase>
SUPABASE_KEY=<sua_chave_supabase>
STORAGE_NAME=<nome_storage_utilizado>
LOCATIONIQ_API_KEY=<sua_chave_locationiq>

📌 Frontend
cd ../..


Crie o arquivo .env:

VITE_API_URL=http://localhost:8800

▶️ 3. Iniciar Backend e Frontend
Backend
cd src/api
npm install
npm run dev


📍 Rodando em: http://localhost:8800

Frontend
cd ../..
npm install
npm run dev


📍 Rodando em: http://localhost:5173

🧪 Testes
🟦 Frontend — Vitest
npm test


Gerar cobertura:

npm run test -- --coverage

🟩 Backend — Cucumber.js
cd src/api
npm test

📂 Estrutura de Pastas
nyox-imobiliari-ria/
├── .github/
├── public/
├── src/
│   ├── api/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── .env.example
│   │   └── package.json
│   ├── assets/
│   ├── Components/
│   ├── Pages/
│   ├── main.jsx
│   └── setupTests.js
├── tests/
├── package.json
└── vite.config.js

👥 Contribuidores
Nome	RA
Carlos Eduardo da Silva	42413109
Gustavo Henrique dos Santos	42424538
Henrique Oliveira Ferreira	42414581
João Vitor Martins Matos	42414921
Heitor Zeferino Siqueira	42521884
Pedro Henriques Ferreira	42411210
Rodrigo Queiroz Vieira Freire	42414808
📜 Licença

Projeto de uso acadêmico distribuído sob a licença MIT.
