# Nyox Imobiliária

Este é um sistema de gerenciamento imobiliário completo, projetado para otimizar a listagem, busca e administração de propriedades. O sistema é construído com uma arquitetura moderna e escalável, utilizando tecnologias de ponta para garantir uma experiência de usuário rápida e um desenvolvimento eficiente.

---

## Como executar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/nyox-A3-MMTE/nyox-imobiliari-ria.git
cd nyox-imobiliari-ria/
```

### 2. Configurar Variáveis de Ambiente

#### Backend (API)
Navegue até o diretório da API e crie um arquivo `.env`:
```bash
cd src/api
```
Adicione as seguintes variáveis ao arquivo `.env`:
```env
SUPABASE_URL=<sua_url_supabase>
SUPABASE_KEY=<sua_chave_supabase>
STORAGE_NAME=<nome_storage_utilizado>
LOCATIONIQ_API_KEY=<sua_chave_locationiq>
```
- `SUPABASE_URL` e `SUPABASE_KEY`: Credenciais do projeto no [Supabase](https://supabase.com/).
- `LOCATIONIQ_API_KEY`: Chave de API do [LocationIQ](https://locationiq.com/) para geocodificação.
- `STORAGE_NAME`: Storrage utilizado para armazenamento das imgens imoveis.

#### Frontend
Volte para o diretório raiz e crie um arquivo `.env` para o frontend:
```bash
cd ../.. 
```
Adicione a seguinte variável:
```env
VITE_API_URL=http://localhost:8800
```
- `VITE_API_URL`: URL base onde a API do backend está sendo executada.

### 3. Instalar Dependências e Iniciar

#### Backend (API)
No diretório `src/api`, instale as dependências e inicie o servidor:
```bash
npm install
npm run dev
```
A API estará em execução em `http://localhost:8800`.

#### Frontend
No diretório **raiz** do projeto, instale as dependências e inicie a aplicação:
```bash
npm install
npm run dev
```
O frontend será iniciado em `http://localhost:5173` (ou outra porta disponível).

---

## Testes

O projeto possui suítes de teste para o frontend e para o backend.

### Testes do Frontend (Vitest)
Os testes de componentes e páginas do frontend usam [Vitest](https://vitest.dev/) e [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). Para executá-los, rode o seguinte comando no diretório **raiz**:

```bash
npm test
```
Para gerar um relatório de cobertura de testes, execute:
```bash
npm run test -- --coverage
```

### Testes do Backend (Cucumber.js)
Os testes de comportamento (BDD) da API usam [Cucumber.js](https://cucumber.io/). Para executá-los, navegue até o diretório da API e execute o comando:
```bash
cd src/api
npm test
```
Isso executará os cenários definidos nos arquivos `.feature` contra a API.

---

## Tecnologias Utilizadas
- **Backend**: Node.js, Express, Supabase (PostgreSQL), Cucumber.js, JWT.
- **Frontend**: React, Vite, Vitest, React Testing Library, React Router.
- **DevOps**: Docker, GitHub Actions.

---

## Estrutura do Projeto
A estrutura foi organizada para separar claramente o frontend do backend, com seus respectivos testes.

```
nyox-imobiliari-ria/
├── .github/              # Workflows do GitHub Actions
├── public/               # Ativos estáticos do frontend
├── src/
│   ├── api/              # Código-fonte do Backend (Node.js)
│   │   ├── src/
│   │   │   ├── Connection/
│   │   │   ├── Routes/
│   │   │   └── ...
│   │   ├── tests/          # Testes BDD do Backend
│   │   │   ├── features/   # Arquivos .feature do Cucumber
│   │   │   └── steps/      # Definições de passos do Cucumber
│   │   ├── .env.example
│   │   ├── cucumber.js
│   │   └── package.json
│   ├── assets/             # Imagens e outros ativos
│   ├── Components/         # Componentes React reutilizáveis
│   ├── Pages/              # Páginas da aplicação React
│   ├── main.jsx            # Ponto de entrada do React
│   └── setupTests.js       # Configuração para testes do Vitest
├── tests/                  # Testes unitários do Frontend (Vitest)
│   ├── Components/
│   └── Pages/
├── .gitignore
├── package.json            # Dependências do Frontend
├── README.md
└── vite.config.js          # Configuração do Vite
```
---
## Contribuidores

Lista de contribuintes do projeto:

1. **Carlos Eduardo da Silva** — RA: 42413109  
2. **Gustavo Henrique dos Santos** — RA: 42424538  
3. **Henrique Oliveira Ferreira** — RA: 42414581  
4. **João Vitor Martins Matos** — RA: 42414921  
5. **Heitor Zeferino Siqueira** — RA: 42521884  
6. **Pedro Henriques Ferreira** — RA: 42411210  
7. **Rodrigo Queiroz Vieira Freire** — RA: 42414808  

Como contribuir: abra uma issue ou envie um pull request no repositório descrevendo as alterações propostas. Obrigado pela colaboração!

---

## Licença
Este projeto é de uso acadêmico e está disponível sob a licença MIT.
