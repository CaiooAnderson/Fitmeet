import {API_URL} from './api';
import {storage} from '../storage/storage';

export async function updateUserProfile(data: {
  name: string;
  email: string;
  password?: string;
}) {
  const token = await storage.getItem('token');
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_URL}/user/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Erro ao atualizar o perfil');
}

export async function updateUserAvatar(imageUri: string) {
  const token = await storage.getItem('token');
  if (!token) throw new Error('Token não encontrado');

  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await fetch(`${API_URL}/user/avatar`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Erro ao atualizar avatar');
}

export async function updateUserPreferences(preferences: string[]) {
  const token = await storage.getItem('token');
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_URL}/user/preferences/define`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) throw new Error('Erro ao atualizar preferências');
}

export async function deactivateAccount() {
  const token = await storage.getItem('token');
  if (!token) throw new Error('Token não encontrado');

  const response = await fetch(`${API_URL}/user/deactivate`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Erro ao desativar conta');
}
