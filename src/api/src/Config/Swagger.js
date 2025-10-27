import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Imóveis",
      version: "1.0.0",
      description: "Documentação da API REST que conecta o front ao banco de dados Supabase",
    },
    servers: [
      {
        url: "http://localhost:8800", 
      },
    ],
  },
  apis: ["./src/Routes/User.js","./src/Routes/Imoveis.js"], 

};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
