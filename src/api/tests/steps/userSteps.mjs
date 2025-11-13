import { Given, When, Then, AfterAll } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";
import { serverInstance } from "./serverInstance.mjs";
import supabase from "../../src/Connection/Supabase.js";
import bcrypt from "bcrypt";

let requestBody;

AfterAll(async function () {
  console.log("\nLimpando Usuários de teste");
  await supabase
    .from("Visitantes")
    .delete()
    .in("email", ["teste@example.com", "visitante@test.com", "teste2@example.com"]);
});

Given("que eu sou um novo usuário com os seguintes dados:", function (dataTable) {
  requestBody = dataTable.hashes()[0];
});

Given("eu sou um novo usuário com os seguintes dados:", function (dataTable) {
  requestBody = dataTable.hashes()[0];
});

Given("que já existe um usuário cadastrado com o email {string}", async function (email) {
  await supabase.from("Visitantes").delete().eq("email", email);
  const senhaHashed = await bcrypt.hash("senhaExistente123", 10);
  await supabase.from("Visitantes").insert([
    { nome: "Usuário Existente", email: email, idade: 30, cpf: "111.222.333-44", senha: senhaHashed }
  ]);
});

Given("que existe um usuário \"visitante\" cadastrado com as credenciais:", async function (dataTable) {
  const credentials = dataTable.hashes()[0];
  const { email, senha } = credentials;

  await supabase.from("Visitantes").delete().eq("email", email);

  const senhaHashed = await bcrypt.hash(senha, 10);
  await supabase.from("Visitantes").insert([
    { nome: "Visitante Teste", email: email, idade: 28, cpf: "444.555.666-77", senha: senhaHashed }
  ]);
});

When("eu envio uma requisição POST para {string}", async function (path) {
  this.response = await request(serverInstance).post(path).send(requestBody);
});

When("eu envio uma requisição POST para {string} com as credenciais:", async function (path, dataTable) {
  const credentials = dataTable.hashes()[0];
  this.response = await request(serverInstance).post(path).send(credentials);
});

Then("a resposta deve ter o status {int}", function (status) {
  expect(this.response.status).to.equal(status);
});

Then("a resposta deve conter a mensagem {string}", function (message) {
  expect(this.response.body.message).to.equal(message);
});

Then("a resposta deve conter um token de autenticação do tipo {string}", function (type) {
  expect(this.response.body.type).to.equal(type);
  expect(this.response.body).to.have.property("token");
});