# language: pt
Funcionalidade: Gerenciamento de Imóveis

  Como um usuário autenticado, eu quero poder gerenciar os imóveis no sistema
  para que eu possa listá-los, criá-los, atualizá-los e removê-los.

  Contexto:
    Dado que existe um imóvel base no banco de dados com os seguintes dados:
      | descricao     | cep      | endereco        | bairro    | cidade      | estado | tipo  | quartos | banheiros | vagas_garagem | area_total | valor  |
      | Imóvel Padrão | 12345678 | Rua dos Testes, 123 | Testelandia | Test City | TS     | Casa  | 3       | 2         | 1             | 150        | 300000 |

  Cenário: Listar todos os imóveis ativos
    Quando eu envio uma requisição GET para "/imoveis/list"
    Então a resposta deve ter o status 200
    E a resposta deve ser uma lista de imóveis
    E a lista de imóveis deve conter o "Imóvel Padrão"

  Cenário: Listar um imóvel específico por ID
    Quando eu envio uma requisição GET para o endpoint de detalhe do "Imóvel Padrão"
    Então a resposta deve ter o status 200
    E a resposta deve conter os detalhes do "Imóvel Padrão"

  Cenário: Criar um novo imóvel com sucesso
    Dado eu tenho os dados de um novo imóvel:
      | descricao        | cep      | endereco          | bairro | cidade      | estado | tipo        | quartos | banheiros | vagas_garagem | area_total | valor  |
      | Apartamento Novo | 87654321 | Avenida dos Devs, 456 | Codelandia | Codeville | CD     | Apartamento | 2       | 1         | 1             | 80         | 250000 |
    Quando eu envio uma requisição POST para "/imoveis/register" com os seguintes dados:
    Então a resposta deve ter o status 200
    E a resposta deve conter a mensagem "Imóvel inserido com sucesso"

  Cenário: Atualizar um imóvel existente
    Dado eu tenho os seguintes dados para atualização:
      | valor | 350000 |
    Quando eu envio uma requisição PUT para o endpoint de atualização do "Imóvel Padrão" com os novos dados
    Então a resposta deve ter o status 200
    E a resposta da atualização deve conter o "valor" de "350000"

  Cenário: Desativar um imóvel (Soft Delete)
    Quando eu envio uma requisição PUT para o endpoint de desativação do "Imóvel Padrão"
    Então a resposta deve ter o status 200
    E o campo "Ativo" do imóvel na resposta deve ser "false"

  Cenário: Reativar um imóvel
    Dado que o "Imóvel Padrão" está desativado
    Quando eu envio uma requisição PUT para o endpoint de reativação do "Imóvel Padrão"
    Então a resposta deve ter o status 200
    E o campo "Ativo" do imóvel na resposta deve ser "true"

  Cenário: Deletar um imóvel permanentemente
    Dado que eu criei um imóvel para ser deletado com a descrição "Imóvel a ser deletado"
    Quando eu envio uma requisição DELETE para o endpoint de deleção permanente do imóvel "Imóvel a ser deletado"
    Então a resposta deve ter o status 200
    E a resposta deve conter a mensagem "Imóvel removido com sucesso"
