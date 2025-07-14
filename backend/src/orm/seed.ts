import { seedActivityAchievements } from './activityAchievements';
import { seedActivityTypes } from './activityTypes';
import { createBucketIfNotExists, uploadDefaultAvatar } from '../services/s3Service';

async function main() {
    try {
      await createBucketIfNotExists();
      await uploadDefaultAvatar();
      await seedActivityTypes();
      await seedActivityAchievements();
      console.log('Seed carregada.');
    } catch (error) {
      console.error('Erro ao rodar seed:', error);
      process.exit(1);
    }
  }
  main().finally(() => process.exit(0));