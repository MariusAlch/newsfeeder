import SocketIO from "socket.io";
import { getSocketServer } from "..";

class SocketService {
  sockets: { [name: string]: SocketIO.Socket } = {};

  init() {
    getSocketServer().on("connection", socket => {
      let name = "";
      socket.on("register", ({ name: n }) => {
        name = n;
        this.sockets[name] = socket;
      });
      socket.on("disconnect", () => {
        delete this.sockets[name];
      });
    });
  }

  sendByName(name: string, eventName: string, data: any) {
    const socket = this.sockets[name];
    if (!socket) {
      return;
    }

    socket.emit(eventName, data);
  }
}

export const socketService = new SocketService();
