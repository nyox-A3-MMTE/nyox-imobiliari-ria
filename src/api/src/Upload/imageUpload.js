import supabase from '../Connection/Supabase.js';

async function uploadFile(file) {
    const uniqueName = `imagens/${Date.now()}_${file.originalname}`;
    const {data, error} = await supabase
        .storage
        .from(process.env.STORAGE_NAME)
        .upload(uniqueName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if(error){
        console.log("Erro ao realizar upload da imagem", error.message)
        return null
    }

    if (data) {
    const { data: publicData } = supabase.storage
        .from("imoveis-imagens")
        .getPublicUrl(data.path);

        return publicData.publicUrl;
    }

}

export default uploadFile