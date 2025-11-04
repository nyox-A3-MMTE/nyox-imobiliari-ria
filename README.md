# Nyox Imobiliária

Este é um sistema de gerenciamento imobiliário completo, projetado para otimizar a listagem, busca e administração de propriedades. O sistema é construído com uma arquitetura moderna e escalável, utilizando tecnologias de ponta para garantir uma experiência de usuário rápida e um desenvolvimento eficiente.

---

## Como executar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/nyox-A3-MMTE/nyox-imobiliari-ria.git
cd nyox-imobiliari-ria/
```

### 2. Configurar variáveis de ambiente
No diretório da API:
```bash
cd src/api
```

Crie um arquivo `.env` com as seguintes variáveis:
```env
SUPABASE_URL=<sua_url_supabase>
SUPABASE_KEY=<sua_chave_supabase>
```

Esses valores correspondem às credenciais do projeto no Supabase.

---

### 3. Instalar dependências e iniciar a API
```bash
npm install
npm run dev
```

Isso iniciará a API e estabelecerá a conexão com o Supabase.

---

### 4. Iniciar o Frontend
Volte para o diretório raiz e execute:
```bash
cd ../..
npm install
npm run dev
```

O frontend será iniciado em modo de desenvolvimento.

---

## Tecnologias utilizadas
- **Node.js**
- **Supabase**
- **Vite**
- **JavaScript (ES6+)**

---

## Estrutura do Projeto

Abaixo está a estrutura de pastas do projeto. O diretório principal inclui o frontend (arquivos em src) e um mini-repositório em src/api que contém a API para conexão com o Supabase. Abaixo segue o layout de pastas para referência.
```
NYOX-IMOBILIARI-RIA
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   ├── node_modules/
    │   │   ├── src/
    │   │   ├── .env
    │   │   ├── package-lock.json
    │   │   ├── package.json
    │   │   └── vercel.json
    │   ├── assets/
    │   ├── Components/
    │   ├── Pages/
    │   ├── index.css
    │   ├── main.jsx
    │   ├── .gitignore
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── README.md
    │   └── vite.config.js
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
