<div align="center"> <h1 style="font-size: 42px; font-weight: 900;">🏠 Nyox Imobiliária</h1> <p style="font-size: 18px; max-width: 700px;"> Sistema completo, moderno e profissional para gerenciamento, listagem e administração de imóveis — com arquitetura escalável e tecnologias eficientes. </p> <br> <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge"/> <img src="https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/Backend-Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/> <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/> </div>
<br>
✨ Visão Geral
<div style="background: #f6f8fa; padding: 18px; border-radius: 10px; border-left: 6px solid #4CAF50;"> <b>Nyox Imobiliária</b> é um sistema de gerenciamento imobiliário projetado para oferecer eficiência, velocidade e organização no cadastro, listagem e administração de imóveis. Construído com tecnologias modernas, entrega uma experiência elegante e fluida, tanto no catálogo público quanto no painel administrativo. </div>
🏡 Funcionalidades
<div style="display: flex; gap: 20px; flex-wrap: wrap;"> <div style="flex: 1; min-width: 230px; background: #fff; border-radius: 12px; padding: 18px; border: 1px solid #e4e4e4;"> <h3>🔍 Catálogo Público</h3> <ul> <li>Listagem aberta ao público</li> <li>Interface rápida e responsiva</li> <li>Visual moderno</li> </ul> </div> <div style="flex: 1; min-width: 230px; background: #fff; border-radius: 12px; padding: 18px; border: 1px solid #e4e4e4;"> <h3>🔐 Autenticação</h3> <ul> <li>Criação de conta opcional</li> <li>Login com JWT</li> <li>Segurança e controle de acesso</li> </ul> </div> <div style="flex: 1; min-width: 230px; background: #fff; border-radius: 12px; padding: 18px; border: 1px solid #e4e4e4;"> <h3>🛠 Painel Admin</h3> <ul> <li>Acesso exclusivo para administradores</li> <li>CRUD completo de imóveis</li> <li>Gerenciamento simples e eficiente</li> </ul> </div> </div>
⚙️ Tecnologias Utilizadas
<table> <tr> <td><b>Frontend</b></td> <td>React, Vite, React Router, Vitest, Testing Library</td> </tr> <tr> <td><b>Backend</b></td> <td>Node.js, Express, Supabase, JWT, Cucumber.js</td> </tr> <tr> <td><b>Outros</b></td> <td>LocationIQ (geocodificação)</td> </tr> </table>
🚀 Como Executar o Projeto
🔧 1. Clonar o repositório
git clone https://github.com/nyox-A3-MMTE/nyox-imobiliari-ria.git
cd nyox-imobiliari-ria/

🔧 2. Configuração das Variáveis de Ambiente
📌 Backend
cd src/api


Crie um arquivo .env:

SUPABASE_URL=<sua_url_supabase>
SUPABASE_KEY=<sua_chave_supabase>
STORAGE_NAME=<nome_storage_utilizado>
LOCATIONIQ_API_KEY=<sua_chave_locationiq>

📌 Frontend
cd ../..


Crie um .env:

VITE_API_URL=http://localhost:8800

▶️ 3. Iniciar Backend e Frontend
Backend
cd src/api
npm install
npm run dev


📌 Rodando em: http://localhost:8800

Frontend
cd ../..
npm install
npm run dev


📌 Rodando em: http://localhost:5173

🧪 Testes
🟦 Frontend (Vitest)
npm test


Cobertura:

npm run test -- --coverage

🟩 Backend (Cucumber.js)
cd src/api
npm test

📂 Estrutura de Pastas
<div style="background:#111; color:#0f0; padding:20px; border-radius:10px; font-family:monospace; font-size:14px;"> nyox-imobiliari-ria/ ├── .github/ ├── public/ ├── src/ │ ├── api/ │ │ ├── src/ │ │ ├── tests/ │ │ ├── .env.example │ │ └── package.json │ ├── assets/ │ ├── Components/ │ ├── Pages/ │ ├── main.jsx │ └── setupTests.js ├── tests/ ├── package.json └── vite.config.js </div>
👥 Contribuidores
<div align="center">
Nome	RA
Carlos Eduardo da Silva	42413109
Gustavo Henrique dos Santos	42424538
Henrique Oliveira Ferreira	42414581
João Vitor Martins Matos	42414921
Heitor Zeferino Siqueira	42521884
Pedro Henriques Ferreira	42411210
Rodrigo Queiroz Vieira Freire	42414808
</div>
📜 Licença
<div style="background:#f0f7ff; border-left:5px solid #007bff; padding:14px; border-radius:8px;"> Este projeto é de uso acadêmico e distribuído sob a licença <b>MIT</b>. </div>
