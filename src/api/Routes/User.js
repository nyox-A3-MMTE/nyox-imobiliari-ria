import { Router } from "express";
import supabase from '../Connection/Supabase.js'


const router = Router();




router.post('/login', async (req, res) => {
    try {
    let{data,error} = await supabase.auth.signInWithPassword({
        email: req.body.email,
        password: req.body.senha,
    });
    if (error) {
        console.error("Erro do Supabase:", error);
        return res.status(400).json({ message: 'Erro ao fazer login' });    
    }else{
        return res.status(200).json({ message: 'Login realizado com sucesso', user: data.user });
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

export default router;