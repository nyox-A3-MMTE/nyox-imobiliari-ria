🏠 Nyox Imobiliária — Plataforma Completa de Gerenciamento Imobiliário
<p align="center"> <img src="https://img.shields.io/badge/status-online-brightgreen?style=for-the-badge" /> <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/frontend-React-61dafb?style=for-the-badge&logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/backend-Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" /> <img src="https://img.shields.io/badge/tests-Vitest/Cucumber.js-yellow?style=for-the-badge" /> </p>
🌟 Sobre o Projeto

O Nyox Imobiliária é um sistema completo de gerenciamento imobiliário, projetado para otimizar a listagem, busca e administração de propriedades.
Com uma arquitetura moderna e escalável, o projeto utiliza tecnologias de ponta para garantir uma experiência rápida, segura e profissional, tanto para usuários quanto para administradores.

A plataforma conta com:

Catálogo público de imóveis

Criação de conta opcional

Autenticação por JWT

Painel administrativo restrito a administradores

CRUD completo de imóveis

Testes automatizados no frontend e backend

Deploy simplificado e arquitetura clara

🚀 Tecnologias Utilizadas
Backend

Node.js

Express

Supabase (PostgreSQL + Auth + Storage)

JWT

Cucumber.js

Docker

Frontend

React

Vite

React Router

Vitest

React Testing Library

DevOps

GitHub Actions

Docker

🛠️ Como Executar o Projeto
1. Clonar o repositório
git clone https://github.com/nyox-A3-MMTE/nyox-imobiliari-ria.git
cd nyox-imobiliari-ria/

⚙️ 2. Configurar Variáveis de Ambiente
Backend (API)
cd src/api


Crie um arquivo .env:

SUPABASE_URL=<sua_url_supabase>
SUPABASE_KEY=<sua_chave_supabase>
STORAGE_NAME=<nome_storage_utilizado>
LOCATIONIQ_API_KEY=<sua_chave_locationiq>


SUPABASE_URL / SUPABASE_KEY → Credenciais do Supabase
STORAGE_NAME → Storage utilizado para imagens dos imóveis
LOCATIONIQ_API_KEY → Chave do LocationIQ para geocodificação

Frontend

Volte para o diretório raiz:

cd ../..


Crie um arquivo .env:

VITE_API_URL=http://localhost:8800

▶️ 3. Instalar Dependências e Iniciar
Backend
cd src/api
npm install
npm run dev


A API estará em:
http://localhost:8800

Frontend
cd ../..
npm install
npm run dev


A aplicação estará em:
http://localhost:5173

🧪 Testes
Frontend — Vitest
npm test


Gerar cobertura:

npm run test -- --coverage

Backend — Cucumber.js
cd src/api
npm test


Executa os cenários BDD definidos nos arquivos .feature.

📂 Estrutura do Projeto
nyox-imobiliari-ria/
├── .github/                # Workflows do CI/CD
├── public/                 # Arquivos estáticos do frontend
├── src/
│   ├── api/                # Backend (Node + Express)
│   │   ├── src/
│   │   │   ├── Connection/
│   │   │   ├── Routes/
│   │   │   └── ...
│   │   ├── tests/          # Testes BDD (Cucumber)
│   │   │   ├── features/
│   │   │   └── steps/
│   │   ├── .env.example
│   │   ├── cucumber.js
│   │   └── package.json
│   ├── assets/             # Imagens e recursos
│   ├── Components/         # Componentes React
│   ├── Pages/              # Páginas React
│   ├── main.jsx            # Entrada do frontend
│   └── setupTests.js       # Configuração Vitest
├── tests/                  # Testes unitários do frontend
│   ├── Components/
│   └── Pages/
├── .gitignore
├── package.json            # Dependências do frontend
├── README.md
└── vite.config.js

👥 Contribuidores

Carlos Eduardo da Silva — RA: 42413109

Gustavo Henrique dos Santos — RA: 42424538

Henrique Oliveira Ferreira — RA: 42414581

João Vitor Martins Matos — RA: 42414921

Heitor Zeferino Siqueira — RA: 42521884

Pedro Henriques Ferreira — RA: 42411210

Rodrigo Queiroz Vieira Freire — RA: 42414808

Para contribuir: abra uma issue ou envie um pull request descrevendo as alterações propostas.

📄 Licença

Este projeto é de uso acadêmico e está disponível sob a licença MIT.

Se quiser, posso adicionar imagens, GIF de demonstração, badges extras, tabela de rotas da API ou um roadmap ilustrado. Quer alguma dessas versões?

Você disse:
coloca mais uns efeitos desse ou melhora esse ai q ta meio feio
O ChatGPT disse:

Perfeito — aqui está uma versão MUITO mais bonita, estética, bem alinhada e moderna, com efeitos visuais, blocos destacados, seções separadas com ícones e detalhes que deixam o README com cara de documentação premium.
Tudo 100% pronto pra copiar e colar.

<div align="center">🏠✨ Nyox Imobiliária
Plataforma Completa e Moderna de Gerenciamento Imobiliário</div>
<p align="center"> <img src="https://img.shields.io/badge/status-online-brightgreen?style=for-the-badge" /> <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/frontend-React-61dafb?style=for-the-badge&logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/backend-Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" /> <img src="https://img.shields.io/badge/tests-Vitest/Cucumber.js-yellow?style=for-the-badge" /> </p>
📌 Visão Geral

O Nyox Imobiliária é um sistema completo, moderno e escalável para listagem, busca, administração e gerenciamento de imóveis, desenvolvido com tecnologias de ponta e arquitetura profissional.

Ele combina:

Catálogo público de imóveis

Autenticação com JWT

Painel administrativo completo

CRUD de propriedades

Testes automatizados (frontend e backend)

Deploy simples e arquitetura bem organizada

✨ Destaques do Sistema
🏡 Catálogo Público

Acesso livre

Imóveis organizados por categorias

UI rápida, responsiva e intuitiva

🔐 Autenticação & Segurança

Criação de conta opcional

Login seguro com JWT

Armazenamento de imagens via Supabase Storage

🛠️ Painel Administrativo

Área exclusiva para administradores

CRUD completo de propriedades

Gerenciamento simples e rápido

🧪 Testes Automatizados

Frontend: Vitest + React Testing Library

Backend: Cucumber.js com BDD

Relatórios de cobertura

🚀 Tecnologias Utilizadas
Frontend
Tecnologia	Uso
React	Interface e componentes
Vite	Build rápido
React Router	Rotas
Vitest	Testes
RTL	Testes de UI
Backend
Tecnologia	Uso
Node.js	Ambiente backend
Express	Servidor e rotas
Supabase	Banco, auth e storage
JWT	Autenticação
Cucumber.js	Testes BDD
DevOps

Docker

GitHub Actions

⚙️ Como Executar o Projeto
1️⃣ Clonar o repositório
git clone https://github.com/nyox-A3-MMTE/nyox-imobiliari-ria.git
cd nyox-imobiliari-ria/

🔧 2️⃣ Configurar Variáveis de Ambiente
Backend
cd src/api


Crie o arquivo .env:

SUPABASE_URL=<sua_url_supabase>
SUPABASE_KEY=<sua_chave_supabase>
STORAGE_NAME=<nome_storage_utilizado>
LOCATIONIQ_API_KEY=<sua_chave_locationiq>

Frontend
cd ../..


Crie o arquivo .env:

VITE_API_URL=http://localhost:8800

▶️ 3️⃣ Instalar e Iniciar
Backend
cd src/api
npm install
npm run dev


📌 API ativa em: http://localhost:8800

Frontend
cd ../..
npm install
npm run dev


📌 Frontend ativo em: http://localhost:5173

🧪 Testes
Frontend — Vitest
npm test


Cobertura:

npm run test -- --coverage

Backend — Cucumber.js
cd src/api
npm test

📁 Estrutura do Projeto
nyox-imobiliari-ria/
├── .github/                # Workflows CI/CD
├── public/                 # Assets estáticos
├── src/
│   ├── api/                # Backend
│   │   ├── src/
│   │   │   ├── Connection/
│   │   │   ├── Routes/
│   │   │   └── ...
│   │   ├── tests/          # Testes BDD
│   │   │   ├── features/
│   │   │   └── steps/
│   │   ├── .env.example
│   │   ├── cucumber.js
│   │   └── package.json
│   ├── assets/             
│   ├── Components/         
│   ├── Pages/              
│   ├── main.jsx            
│   └── setupTests.js       
├── tests/                  
│   ├── Components/
│   └── Pages/
├── .gitignore
├── package.json
├── README.md
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

Contribuições: abra uma issue ou envie um PR.

📜 Licença

Este projeto é de uso acadêmico e distribuído sob a licença MIT.
