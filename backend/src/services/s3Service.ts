import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
  HeadBucketCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import https from "https";

export interface SimpleFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export const bucketName = process.env.BUCKET_NAME!;
export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function createBucketIfNotExists() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log("Bucket já existe:", bucketName);
  } catch (error: any) {
    if (error.$metadata?.httpStatusCode === 404) {
      console.log("Bucket não encontrado, criando...");
      // await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log("Por favor crie o bucket manualmente no Backblaze B2");
    } else {
      throw error;
    }
  }
}

export async function uploadImage(file: SimpleFile, folder: string) {
  const fileKey = `${folder}/${file.originalname}`;
  const uploadParams = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(uploadParams));
  return fileKey;
}

export async function uploadImageFromUrl(url: string, key: string) {
  return new Promise<void>((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Falha ao baixar imagem: ${response.statusCode}`));
      }

      const chunks: Uint8Array[] = [];

      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        const buffer = Buffer.concat(chunks);

        if (!buffer || buffer.length === 0) {
          return reject(new Error("Imagem baixada está vazia."));
        }

        const uploadParams = {
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: "image/png",
          ContentLength: buffer.length,
        };

        try {
          await s3.send(new PutObjectCommand(uploadParams));
          console.log(`Imagem enviada com sucesso: ${key}`);
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      response.on("error", reject);
    }).on("error", reject);
  });
}

export async function uploadDefaultAvatar() {
  const imageUrl = "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png";
  const imageKey = "avatars/default-avatar.png";

  try {
    await s3.send(new HeadObjectCommand({
      Bucket: bucketName,
      Key: imageKey,
    }));
    console.log("Imagem padrão já existe no S3.");
  } catch (error: any) {
    if (error.$metadata?.httpStatusCode === 404) {
      console.log("Imagem padrão não existe. Fazendo upload...");
      await uploadImageFromUrl(imageUrl, imageKey);
    } else {
      throw error;
    }
  }
}

export async function getSignedAvatarUrl(key: string, expiresInSeconds = 3600) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: expiresInSeconds,
  });

  return signedUrl;
}

export async function AvatarUrl() {
  return await getSignedAvatarUrl("avatars/default-avatar.png");
}