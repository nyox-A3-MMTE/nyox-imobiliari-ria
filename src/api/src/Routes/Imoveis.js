import { Router } from "express";
import supabase from '../Connection/Supabase.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Imóveis
 *   description: Endpoints para gerenciamento de imóveis
 */

/**
 * @swagger
 * /imoveis/register:
 *   post:
 *     summary: Insere um novo imóvel no banco de dados
 *     tags: [Imóveis]
 *     requestBody:
 *       description: Dados do imóvel a ser cadastrado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *               - cep
 *               - endereco
 *               - bairro
 *               - cidade
 *               - estado
 *               - tipo
 *               - quartos
 *               - banheiros
 *               - vagasGaragem
 *               - areaTotal
 *               - valor
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: Apartamento de 3 quartos com suíte, varanda e cozinha planejada no centro da cidade.
 *               cep:
 *                 type: string
 *                 example: "11111111"
 *               endereco:
 *                 type: string
 *                 example: Rua exemplo, 34
 *               bairro:
 *                 type: string
 *                 example: Alvorada
 *               cidade:
 *                 type: string
 *                 example: Belo Horizonte
 *               estado:
 *                 type: string
 *                 example: Minas Gerais
 *               tipo:
 *                 type: string
 *                 example: Apartamento
 *               quartos:
 *                 type: integer
 *                 example: 2
 *               banheiros:
 *                 type: integer
 *                 example: 2
 *               vagasGaragem:
 *                 type: integer
 *                 example: 2
 *               areaTotal:
 *                 type: number
 *                 format: float
 *                 example: 200.0
 *               valor:
 *                 type: number
 *                 format: float
 *                 example: 250000.00
 *     responses:
 *       200:
 *         description: Imóvel inserido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Imóvel inserido com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Erro ao inserir imóvel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Erro ao inserir imóvel
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor
 */
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
          vagas_garagem: req.body.vagasGaragem,
          area_total: req.body.areaTotal,
          valor: req.body.valor
        }
      ]);
    if (error) {
      console.error("Erro do Supabase:", error);
      return res.status(400).json({ success: false, message: 'Erro ao inserir imóvel' });
    } else {
      return res.status(200).json({ success: true, message: 'Imóvel inserido com sucesso', data: data });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /imoveis/list:
 *   get:
 *     summary: Lista todos os imóveis ativos
 *     tags: [Imóveis]
 *     responses:
 *       200:
 *         description: Lista de imóveis ativos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Erro ao listar imóveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar imóveis
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/list', async (req, res) => {
  try {
    let { data, error } = await supabase
      .from('Imoveis')
      .select('*')
      .eq('Ativo', true);
    if (error) {
      console.error("Erro do Supabase:", error);
      return res.status(400).json({ message: 'Erro ao listar imóveis' });
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /imoveis/listforid/{id}:
 *   get:
 *     summary: Retorna um imóvel ativo pelo ID
 *     tags: [Imóveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do imóvel a ser buscado
 *         schema:
 *           type: integer
 *         style: simple
 *         explode: false
 *     responses:
 *       200:
 *         description: Imóvel encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 endereco:
 *                   type: string
 *                 bairro:
 *                   type: string
 *                 cidade:
 *                   type: string
 *                 estado:
 *                   type: string
 *                 cep:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 quartos:
 *                   type: integer
 *                 banheiros:
 *                   type: integer
 *                 vagas_garagem:
 *                   type: integer
 *                 area_total:
 *                   type: number
 *                   format: float
 *                 valor:
 *                   type: number
 *                   format: float
 *                 Ativo:
 *                   type: boolean
 *       400:
 *         description: Imóvel não encontrado ou erro na busca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar imóvel
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor
 */

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
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /imoveis/listInatives:
 *   get:
 *     summary: Lista todos os imóveis inativos
 *     tags: [Imóveis]
 *     responses:
 *       200:
 *         description: Lista de imóveis inativos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Erro ao listar imóveis inativos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar imóveis
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/listInatives', async (req, res) => {
  try {
    let { data, error } = await supabase
      .from('Imoveis')
      .select('*')
      .eq('Ativo', false);
    if (error) {
      console.error("Erro do Supabase:", error);
      return res.status(400).json({ message: 'Erro ao listar imóveis' });
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /imoveis/delete/{id}:
 *   put:
 *     summary: Marca um imóvel como inativo (soft delete)
 *     tags: [Imóveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do imóvel a ser desativado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imóvel desativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 Ativo:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Erro ao deletar imóvel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao deletar imóvel
 *       500:
 *         description: Erro interno do servidor
 */
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
      return res.status(400).json({ message: 'Erro ao deletar imóvel' });
    } else {
      return res.status(200).json(data[0]);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /imoveis/reactivate/{id}:
 *   put:
 *     summary: Reativa um imóvel marcado como inativo
 *     tags: [Imóveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do imóvel a ser reativado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imóvel reativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 Ativo:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Erro ao reativar imóvel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao reativar imóvel
 *       500:
 *         description: Erro interno do servidor
 */
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
      return res.status(400).json({ message: 'Erro ao reativar imóvel' });
    } else {
      return res.status(200).json(data[0]);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /imoveis/deletePerm/{id}:
 *   delete:
 *     summary: Apaga um imóvel permanentemente do banco
 *     tags: [Imóveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do imóvel a ser removido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imóvel removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imóvel removido com sucesso
 *       400:
 *         description: Erro ao remover imóvel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao remover imóvel
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/deletePerm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('Imoveis')
      .delete()
      .eq('id', id);
    if (error) {
      console.error("Erro do Supabase:", error);
      return res.status(400).json({ message: 'Erro ao remover imóvel' });
    } else {
      return res.status(200).json({ message: 'Imóvel removido com sucesso' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /imoveis/update/{id}:
 *   put:
 *     summary: Atualiza dados de um imóvel pelo ID
 *     tags: [Imóveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do imóvel a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Dados a serem atualizados do imóvel
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *               cep:
 *                 type: string
 *               endereco:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               tipo:
 *                 type: string
 *               quartos:
 *                 type: integer
 *               banheiros:
 *                 type: integer
 *               vagasGaragem:
 *                 type: integer
 *               areaTotal:
 *                 type: number
 *                 format: float
 *               valor:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Imóvel atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 descricao:
 *                   type: string
 *                 cep:
 *                   type: string
 *                 endereco:
 *                   type: string
 *                 bairro:
 *                   type: string
 *                 cidade:
 *                   type: string
 *                 estado:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 quartos:
 *                   type: integer
 *                 banheiros:
 *                   type: integer
 *                 vagas_garagem:
 *                   type: integer
 *                 area_total:
 *                   type: number
 *                   format: float
 *                 valor:
 *                   type: number
 *                   format: float
 *       400:
 *         description: Erro ao atualizar imóvel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao atualizar imóvel
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, cep, endereco, bairro, cidade, estado, tipo, quartos, banheiros, vagasGaragem, areaTotal, valor } = req.body;

    const { data, error } = await supabase
      .from('Imoveis')
      .update({
        descricao,
        cep,
        endereco,
        bairro,
        cidade,
        estado,
        tipo,
        quartos,
        banheiros,
        vagas_garagem: vagasGaragem,
        area_total: areaTotal,
        valor
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Erro do Supabase:", error);
      return res.status(400).json({ message: 'Erro ao atualizar imóvel' });
    } else {
      return res.status(200).json(data[0]);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
