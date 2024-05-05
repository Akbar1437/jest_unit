import { createServer } from "http";
import { LoginHandler } from "../handlers/loginHandler";
import { Utils } from "../utils/utils";
import { UsersDBAccess } from "../data/usersDBAccess";
import { DataHandler } from "../handlers/dataHandler";
import { Authorizer } from "../authorization/authorizer";

export class Server {
  #authorizer: Authorizer = new Authorizer();
  #usersDBAccess: UsersDBAccess = new UsersDBAccess();

  startServer() {
    createServer(async (req, res) => {
      const basePath = Utils.getRequestBasePath(req);
      switch (basePath) {
        case "login":
          await new LoginHandler(req, res, this.#authorizer).handleRequest();
          break;
        case "users":
          await new DataHandler(
            req,
            res,
            this.#authorizer,
            this.#usersDBAccess
          ).handleRequest();
          break;
        default:
          break;
      }
      res.end();
    }).listen(8080);
    console.log("server started");
  }
}
