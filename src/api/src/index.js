import express from 'express'
import userRoute from './Routes/User.js'
import imovelRoute from './Routes/Imoveis.js'
import { swaggerUi, swaggerSpec } from "./Config/Swagger.js";
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users",userRoute)
app.use("/imoveis",imovelRoute)

app.get("/",(req,res)=>{
    res.json("Rota raiz")
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT ||8800);
}

export default app;