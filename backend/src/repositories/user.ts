export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  xp?: number;
  level?: number;
  achievements?: { achievement: any }[];
}