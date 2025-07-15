import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import activityRoutes from './routes/activityRoutes';
import { setupSwagger } from './swagger/swagger';
import dotenv from 'dotenv';
import { createBucketIfNotExists } from './services/s3Service';
import { multerErrorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://fitmeet-delta.vercel.app/'],
  credentials: true
}));
app.use(express.json());
setupSwagger(app);

createBucketIfNotExists().then(() => {
    app.use(authRoutes);
    app.use(userRoutes);
    app.use(activityRoutes);
    app.use(multerErrorHandler);
  
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  }).catch(() => {
    console.error('Erro ao verificar ou criar o bucket');
});

export default app;
