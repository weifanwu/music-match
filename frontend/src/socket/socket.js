import { io } from "socket.io-client";


// "undefined" means the URL will be computed from the `window.location` object
const URL ="http://localhost:1000";

export const socket = io(URL);

socket.on("connect", () => {
  console.log("connected: ");
});

socket.on("disconnect", (message) => {
    console.log("disconnected: ", message);
});

socket.on("foo", "hi fooo!");

socket.on("bar", "hi bars!");