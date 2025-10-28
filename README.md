# Nyox Imobiliária

Aplicação web para gerenciamento e visualização de imóveis, utilizando **Supabase** como backend e uma interface moderna com **JavaScript**.

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

## Licença
Este projeto é de uso acadêmico e está disponível sob a licença MIT.
