import express from 'express'
import userRoute from './Routes/User.js'
import imovelRoute from './Routes/Imoveis.js'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173" 
}));

app.use("/users",userRoute)
app.use("/imoveis",imovelRoute)

app.get("/",(req,res)=>{
    res.json("Rota raiz")
})


app.listen(8800)