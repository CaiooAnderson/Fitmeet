export async function validateToken(token: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok;
}
