export async function validateToken(token: string) {
  const response = await fetch("http://localhost:3000/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok;
}
