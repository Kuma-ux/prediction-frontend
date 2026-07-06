const API = "https://prediction-backend-production-05b8.up.railway.app";

export async function getWallet() {
  const res = await fetch(`${API_URL}/wallet`, {
    credentials: "include",
  });

  return res.json();
}
