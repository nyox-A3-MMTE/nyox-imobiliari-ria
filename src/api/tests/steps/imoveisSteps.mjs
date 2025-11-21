import { Given, When, Then, AfterAll } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";
import nock from "nock";
import { serverInstance } from "./serverInstance.mjs";
import supabase from "../../src/Connection/Supabase.js";

let requestBody;
const testImoveis = [];

AfterAll(async function () {
  console.log("\nApagando imoveis teste...");
  if (testImoveis.length > 0) {
    const idsToDelete = testImoveis.map(imovel => imovel.id);
    await supabase.from("Imoveis").delete().in("id", idsToDelete);
  }
  nock.cleanAll();
});

Given("que o serviço de geocodificação está funcionando", function () {
  nock('https://us1.locationiq.com')
    .get('/v1/search')
    .query(true)
    .reply(200, [{
      lat: "-23.550520",
      lon: "-46.633308"
    }]);
});

Given("que existe um imóvel base no banco de dados com os seguintes dados:", async function (dataTable) {
  const imovelData = dataTable.hashes()[0];

  imovelData.descricao = `Imóvel Padrão ${Date.now()}`;

  const { data, error } = await supabase.from("Imoveis").insert(imovelData).select();
  if (error) throw new Error(`Failed to create base imovel: ${error.message}`);
  
  this.imovelPadrao = data[0];
  testImoveis.push(data[0]);
});

Given("eu tenho os dados de um novo imóvel:", function (dataTable) {
  requestBody = dataTable.hashes()[0];
});

Given("que o \"Imóvel Padrão\" está desativado", async function () {
  const { data, error } = await supabase
    .from("Imoveis")
    .update({ Ativo: false })
    .eq("id", this.imovelPadrao.id);
  if (error) throw new Error(`Failed to deactivate imovel: ${error.message}`);
});

Given("que eu criei um imóvel para ser deletado com a descrição {string}", async function (descricao) {
    const defaultImovelData = {
        descricao: descricao,
        cep: "12345678",
        endereco: "Rua de Teste",
        bairro: "Bairro Teste",
        cidade: "Cidade Teste",
        estado: "TS",
        tipo: "Casa",
        quartos: 1,
        banheiros: 1,
        vagas_garagem: 1,
        area_total: 50,
        valor: 100000,
    };
    const { data, error } = await supabase.from("Imoveis").insert(defaultImovelData).select();
    if (error) throw new Error(`Failed to create imovel for deletion: ${error.message}`);
    this.imovelParaDeletar = data[0];
    testImoveis.push(data[0]);
});

Given("eu tenho os seguintes dados para atualização:", function (dataTable) {
    requestBody = dataTable.rowsHash();
});

When("eu envio uma requisição GET para {string}", async function (path) {
  this.response = await request(serverInstance).get(path);
});

When("eu envio uma requisição GET para o endpoint de detalhe do \"Imóvel Padrão\"", async function () {
  this.response = await request(serverInstance).get(`/imoveis/listforid/${this.imovelPadrao.id}`);
});

When("eu envio uma requisição POST para {string} com os seguintes dados:", async function (path) {
  const req = request(serverInstance).post(path);
  for (const key in requestBody) {
    req.field(key, requestBody[key]);
  }
  this.response = await req;
});

When("eu envio uma requisição PUT para o endpoint de atualização do \"Imóvel Padrão\" com os novos dados", async function () {
    this.response = await request(serverInstance).put(`/imoveis/update/${this.imovelPadrao.id}`).send(requestBody);
});

When("eu envio uma requisição PUT para o endpoint de desativação do \"Imóvel Padrão\"", async function () {
    this.response = await request(serverInstance).put(`/imoveis/delete/${this.imovelPadrao.id}`);
});

When("eu envio uma requisição PUT para o endpoint de reativação do \"Imóvel Padrão\"", async function () {
    this.response = await request(serverInstance).put(`/imoveis/reactivate/${this.imovelPadrao.id}`);
});

When("eu envio uma requisição DELETE para o endpoint de deleção permanente do imóvel {string}", async function (string) {
    this.response = await request(serverInstance).delete(`/imoveis/deletePerm/${this.imovelParaDeletar.id}`);
});

Then("a resposta deve ser uma lista de imóveis", function () {
  expect(this.response.body).to.be.an("array");
});

Then("a lista de imóveis deve conter o \"Imóvel Padrão\"", function () {
  const imovel = this.response.body.find(item => item.id === this.imovelPadrao.id);
  expect(imovel).to.not.be.undefined;
  expect(imovel.descricao).to.equal(this.imovelPadrao.descricao);
});

Then("a resposta deve conter os detalhes do \"Imóvel Padrão\"", function () {
    expect(this.response.body[0].id).to.equal(this.imovelPadrao.id);
    expect(this.response.body[0].descricao).to.equal(this.imovelPadrao.descricao);
});

Then("a resposta da atualização deve conter o \"valor\" de {string}", function (value) {
    expect(this.response.body.valor).to.equal(Number(value));
});

Then("o campo {string} do imóvel na resposta deve ser {string}", function (field, value) {
    const expectedValue = value === "true";
    expect(this.response.body[field]).to.equal(expectedValue);
});

Then('a resposta deve conter as coordenadas {string} e {string}', function (lat, lon) {
    expect(this.response.body).to.have.property(lat);
    expect(this.response.body).to.have.property(lon);
});

Given('que existe um imóvel para {string} com a cidade {string} e valor {string}', async function (modalidade, cidade, valor) {
  const imovelData = {
    descricao: `Imóvel de Teste ${modalidade} ${cidade}`,
    cep: "11700000",
    endereco: "Av. Exemplo",
    bairro: "Bairro Teste",
    cidade: cidade,
    estado: "SP",
    tipo: "Casa",
    quartos: 3,
    banheiros: 2,
    vagas_garagem: 2,
    area_total: 200,
    valor: parseFloat(valor),
    modalidade: modalidade,
    Ativo: true,
  };
  const { data, error } = await supabase.from("Imoveis").insert(imovelData).select();
  if (error) throw new Error(`Failed to create imovel for filter test: ${error.message}`);
  testImoveis.push(data[0]);
});

Given('que existe um imóvel para {string} com o tipo {string}', async function (modalidade, tipo) {
  const imovelData = {
    descricao: `Imóvel de Teste ${modalidade} ${tipo}`,
    cep: "11700001",
    endereco: "Av. Teste",
    bairro: "Outro Bairro",
    cidade: "São Vicente",
    estado: "SP",
    tipo: tipo,
    quartos: 2,
    banheiros: 1,
    vagas_garagem: 1,
    area_total: 100,
    valor: 250000,
    modalidade: modalidade,
    Ativo: true,
  };
  const { data, error } = await supabase.from("Imoveis").insert(imovelData).select();
  if (error) throw new Error(`Failed to create imovel for filter test: ${error.message}`);
  testImoveis.push(data[0]);
});

Then('a lista de imóveis na resposta deve conter {int} item\\(s)', function (count) {
  expect(this.response.body.imoveis).to.have.lengthOf(count);
});

Then('a lista de imóveis na resposta deve conter pelo menos {int} item\\(s)', function (count) {
    expect(this.response.body.imoveis.length).to.be.at.least(count);
});

Then('o primeiro imóvel na lista deve ter a cidade {string}', function (cidade) {
  expect(this.response.body.imoveis[0].cidade).to.equal(cidade);
});

Then('todos os imóveis na lista devem ter o tipo {string}', function (tipo) {
  for (const imovel of this.response.body.imoveis) {
    expect(imovel.tipo).to.equal(tipo);
  }
});
