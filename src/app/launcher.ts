require("dotenv").config();
import { Server } from "./server/server";

export class Launcher {
  #server: Server;

  constructor() {
    this.#server = new Server();
  }
  launchApp() {
    this.#server.startServer();
  }
}

new Launcher().launchApp();
