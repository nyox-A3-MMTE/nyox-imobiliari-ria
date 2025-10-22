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

//listar todos os imoveis ativos
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

//listar imovel ativos pelo id
router.get('/listforid/:id', async (req, res) => {
    try {
    let { data, error } = await supabase
    .from('Imoveis')
    .select('*')
    .eq('Ativo', true)
    .eq('id', req.params.id);
    if (error) {
        console.error("Erro do Supabase:", error);
        return res.status(400).json({ message: 'Erro ao listar imóvel' });
    }else{
        return res.status(200).json(data);
    }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }   
});

//listar imoveis inativos
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

//editar imovel de acordo com seu id
router.put('/edit/:id', async (req,res)=>{
    try{
        const { data, error } = await supabase
            .from('Imoveis')
            .update({ 
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
             })
            .eq('id', req.params.id)
            .select()
        if (error) {
            console.error("Erro do Supabase:", error);
            return res.status(400).json({ message: 'Erro ao reativar imovel' });
        }else{
            return res.status(200).json({message:'Imóvel atualizado com sucesso'});
    }
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
})

export default router;