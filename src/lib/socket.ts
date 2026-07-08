import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.theprobability.site";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});
