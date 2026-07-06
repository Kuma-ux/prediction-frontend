const API = "https://prediction-backend-production-05b8.up.railway.app";

export async function getWallet() {
  const res = await fetch(`${API}/wallet`, {
    credentials: "include",
  });

  return res.json();
}
