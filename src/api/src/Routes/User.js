import {Router} from "express";
import supabase from '../Connection/Supabase.js'


const router = Router();


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login do usuário com método auth do Supabase
 *     tags: [Usuários]
 *     requestBody:
 *       description: Dados para autenticação do usuário
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123"
 *                     email:
 *                       type: string
 *                       example: usuario@email.com
 *       400:
 *         description: Erro ao fazer login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao fazer login auth/invalid-email"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor Error: erro desconhecido"
 */


router.post('/login', async (req, res) => {
    try {
    let{data,error} = await supabase.auth.signInWithPassword({
        email: req.body.email,
        password: req.body.senha,
    });
    if (error) {
        return res.status(400).json({ message: 'Erro ao fazer login '+ error.code});    
    }else{
        return res.status(200).json({ message: 'Login realizado com sucesso', user: data.user });
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' + err });
    }
});

export default router;