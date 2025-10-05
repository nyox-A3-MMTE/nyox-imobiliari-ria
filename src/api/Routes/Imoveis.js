import { Router } from "express";
import supabase from '../Connection/Supabase.js'


const router = Router();

router.post('/register', async (req, res) => {
    try {
   const { data, error } = await supabase
      .from("Imoveis")
      .insert([
        {
          descricao: req.body.descricao,
          endereco: req.body.endereco,
          bairro: req.body.bairro,
          cidade: req.body.cidade,
          estado: req.body.estado,
          cep: req.body.cep,
          tipo: req.body.tipo,
          quartos: req.body.quartos,
          banheiros: req.body.banheiros,
          vagas_garagem: req.body.vagas_garagem,
          area_total: req.body.area_total,
          valor: req.body.valor
        }
    ]);
    if (error) {
        console.error("Erro do Supabase:", error);
        return res.status(400).json({ message: 'Erro ao inserir imovel' });
    }else{
        return res.status(200).json({ message: 'Imovel inserido com sucesso', imovel: data });
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/list', async (req, res) => {
    try {
    let { data, error } = await supabase
    .from('Imoveis')
    .select('*')
    .eq('Ativo', true);
    if (error) {
        console.error("Erro do Supabase:", error);
        return res.status(400).json({ message: 'Erro ao listar imoveis' });
    }else{
        return res.status(200).json(data);
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }   
});


router.get('/listInatives', async (req, res) => {
    try {
    let { data, error } = await supabase
    .from('Imoveis')
    .select('*')
    .eq('Ativo', false)
    if (error) {
        console.error("Erro do Supabase:", error);
        return res.status(400).json({ message: 'Erro ao listar imoveis' });
    }else{
        return res.status(200).json(data);
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }   
});

// Soft delete - marcar como inativo
router.put('/delete/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const { data, error } = await supabase    
    .from('Imoveis')
    .update({ Ativo: false })
    .eq('id', id)
    .select();
    if (error) {
        console.error("Erro do Supabase:", error);
        return res.status(400).json({ message: 'Erro ao deletar imovel' });
    }else{
        return res.status(200).json(data[0]);
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    } 
});


//Reativar imovel
router.put('/reactivate/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const { data, error } = await supabase    
    .from('Imoveis')
    .update({ Ativo: true })
    .eq('id', id)
    .select();
    if (error) {
        console.error("Erro do Supabase:", error);
        return res.status(400).json({ message: 'Erro ao reativar imovel' });
    }else{
        return res.status(200).json(data[0]);
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    } 
});


//Apagar permamentemente
router.delete('/deletePerm/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const { data, error } = await supabase    
    .from('Imoveis')
    .delete()
    .eq('id', id)
    .select();

    if (error) {
        console.error("Erro do Supabase:", error);
        return res.status(400).json({ message: 'Erro ao reativar imovel' });
    }else{
        return res.status(200).json(data[0]);
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    } 
});

export default router;