import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../services/s3Service';
import https from 'https';

const bucketName = process.env.BUCKET_NAME!;

export async function downloadImageAndUpload(url: string, key: string) {
  return new Promise<void>((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Falha ao baixar a imagem. Status: ${response.statusCode}`));
        return;
      }

      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: response,
        ContentType: 'image/png',
      };

      s3.send(new PutObjectCommand(uploadParams))
        .then(() => {
          console.log(`Imagem carregada com sucesso para o S3: ${key}`);
          resolve();
        })
        .catch((error: any) => {
          console.error('Erro ao carregar a imagem para o S3:', error);
          reject(error);
        });
    }).on('error', (error: any) => {
      reject(error);
    });
  });
}

export async function uploadDefaultAvatar() {
  const imageUrl = 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';
  const imageKey = 'avatars/default-avatar.png';

  await downloadImageAndUpload(imageUrl, imageKey);
}

async function seedImages() {
  try {
    console.log('Iniciando o upload da imagem padrão para o S3...');
    await uploadDefaultAvatar();
    console.log('Imagem padrão carregada com sucesso no S3.');
  } catch (error: any) {
    console.error('Erro ao carregar a imagem padrão para o S3:', error);
  }
}

seedImages();