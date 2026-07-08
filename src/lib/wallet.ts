const API = "https://api.theprobability.site";

export async function getWallet() {
  const res = await fetch(`${API}/wallet`, {
    credentials: "include",
  });

  return res.json();
}
