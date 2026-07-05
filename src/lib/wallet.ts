const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getWallet() {
  const res = await fetch(`${API_URL}/wallet`, {
    credentials: "include",
  });

  return res.json();
}