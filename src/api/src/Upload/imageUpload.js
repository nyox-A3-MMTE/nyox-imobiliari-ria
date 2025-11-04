import supabase from '../Connection/Supabase.js';

async function uploadFile(file) {
    const bucketName = process.env.STORAGE_NAME; // garante que seja o mesmo
    const uniqueName = `imagens/${Date.now()}_${file.originalname}`;

    const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(uniqueName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        console.log("Erro ao realizar upload da imagem:", error.message);
        return null;
    }

    if (data) {
        const { data: publicData } = supabase.storage
            .from(bucketName) // usa o mesmo bucket aqui
            .getPublicUrl(data.path);

        return publicData.publicUrl;
    }
}

export default uploadFile;
