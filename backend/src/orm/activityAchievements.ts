import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedActivityAchievements() {
  const achievements = [
    {
      name: 'Criou sua primeira atividade',
      criterion: 'Crie uma atividade pela primeira vez',
    },
    {
      name: 'Participou de sua primeira atividade',
      criterion: 'Inscreva-se em uma atividade pela primeira vez',
    },
    {
      name: 'Concluiu sua primeira atividade',
      criterion: 'Conclua uma atividade pela primeira vez',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievements.upsert({
      where: { name: achievement.name },
      update: {},
      create: {
        name: achievement.name,
        criterion: achievement.criterion,
      },
    });
  }

  console.log('Conquistas inseridas');
  await prisma.$disconnect();
}
  