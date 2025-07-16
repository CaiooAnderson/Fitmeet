import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedActivityTypes() {
  const types = [
    { 
      name: 'Esportes', 
      description: 'Atividades físicas, torneios, campeonatos e eventos esportivos.', 
      image: 'https://activepharmaceutica.com.br/images/10706988.png' 
    },
    { 
      name: 'Estudos', 
      description: 'Workshops, cursos, palestras e eventos educacionais.',
      image: 'https://www.catho.com.br/carreira-sucesso/wp-content/uploads/sites/3/2019/09/Design-sem-nome-9.jpg'
    },
    { 
      name: 'Oportunidades', 
      description: 'Mentoria, coaching, projetos de voluntariado e desenvolvimento de habilidades.',
      image: 'https://img.freepik.com/vetores-gratis/lider-empresarial-de-pe-na-seta-e-segurando-a-ilustracao-em-vetor-plana-bandeira-desenhos-animados-pessoas-treinando-e-fazendo-plano-de-negocios-conceito-de-lideranca-vitoria-e-desafio_74855-9812.jpg' 
    },
    { 
      name: 'Tecnologia e Inovação', 
      description: 'Hackathons, meetups, eventos de tecnologia, programação e inovações tecnológicas.',
      image: 'https://cra-rj.adm.br/wp-content/uploads/2021/07/WhatsApp-Image-2021-07-20-at-17.32.29-1-1.jpeg'
    },
];

  for (const type of types) {
    const exists = await prisma.activityTypes.findFirst({ where: { name: type.name } });
    if (!exists) {
      await prisma.activityTypes.create({ data: type });
      console.log(`Tipo "${type.name}" adicionado.`);
    } else {
      console.log(`Tipo "${type.name}" já existe.`);
    }
  }

  console.log('Tipos de atividade inseridos');
  await prisma.$disconnect();
}