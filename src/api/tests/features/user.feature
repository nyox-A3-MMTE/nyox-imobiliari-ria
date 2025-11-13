# language: pt
Funcionalidade: Gerenciamento de Usuários

  Como um usuário do sistema, eu quero poder me cadastrar e fazer login
  para acessar as funcionalidades da plataforma.

  Cenário: Cadastro de um novo usuário com sucesso
    Dado que eu sou um novo usuário com os seguintes dados:
      | nome     | email                | idade | cpf           | senha      |
      | Teste    | teste@example.com    | 30    | 123.456.789-00 | senha123   |
    Quando eu envio uma requisição POST para "/users/cadastro"
    Então a resposta deve ter o status 200
    E a resposta deve conter a mensagem "Usuário cadastrado com sucesso!"

  Cenário: Tentativa de cadastro com email já existente
    Dado que já existe um usuário cadastrado com o email "teste@example.com"
    E eu sou um novo usuário com os seguintes dados:
      | nome     | email                | idade | cpf           | senha      |
      | Teste 2  | teste@example.com    | 25    | 009.876.543-21 | outraSenha |
    Quando eu envio uma requisição POST para "/users/cadastro"
    Então a resposta deve ter o status 409
    E a resposta deve conter a mensagem "Você já tem cadastro na plataforma"

  Cenário: Login de usuário "visitante" com sucesso
    Dado que existe um usuário "visitante" cadastrado com as credenciais:
      | email             | senha      |
      | visitante@test.com | senha123   |
    Quando eu envio uma requisição POST para "/users/login" com as credenciais:
      | email             | senha      |
      | visitante@test.com | senha123   |
    Então a resposta deve ter o status 200
    E a resposta deve conter a mensagem "Usuário logado com sucesso!"
    E a resposta deve conter um token de autenticação do tipo "visit"

  Cenário: Login com senha incorreta
    Dado que existe um usuário "visitante" cadastrado com as credenciais:
      | email             | senha      |
      | visitante@test.com | senha123   |
    Quando eu envio uma requisição POST para "/users/login" com as credenciais:
      | email             | senha         |
      | visitante@test.com | senhaErrada   |
    Então a resposta deve ter o status 400
    E a resposta deve conter a mensagem "Senha incorreta!"

  Cenário: Login com usuário não existente
    Quando eu envio uma requisição POST para "/users/login" com as credenciais:
      | email                  | senha      |
      | naoexiste@example.com  | qualquer   |
    Então a resposta deve ter o status 400
    E a resposta deve conter a mensagem "Usuário não encontrado"
