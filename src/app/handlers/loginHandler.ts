import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../authorization/authorizer";
import { Account, HTTP_CODES, HTTP_METHODS } from "../models/serverModels";
import { Utils } from "../utils/utils";

export class LoginHandler {
  #request: IncomingMessage;
  #response: ServerResponse;
  #authorizer: Authorizer;

  constructor(
    request: IncomingMessage,
    response: ServerResponse,
    authorizer: Authorizer
  ) {
    this.#request = request;
    this.#response = response;
    this.#authorizer = authorizer;
  }

  async handleRequest() {
    switch (this.#request.method) {
      case HTTP_METHODS.OPTIONS:
        await this.handleOptions();
        break;
      case HTTP_METHODS.POST:
        await this.handlePost();
        break;
      default:
        break;
    }
  }

  private async handleOptions() {
    this.#response.writeHead(HTTP_CODES.OK);
  }

  private async handlePost() {
    try {
      const requestBody: Account = await Utils.getRequestBody(this.#request);
      const token = await this.#authorizer.generateToken(requestBody);
      if (token) {
        this.#response.statusCode = HTTP_CODES.CREATED;
        this.#response.writeHead(HTTP_CODES.CREATED, {
          "Content-Type": "application/json",
        });
        this.#response.write(JSON.stringify(token));
      } else {
        this.#response.statusCode = HTTP_CODES.NOT_fOUND;
        this.#response.write("wrong username or password");
      }
    } catch (error) {
      this.#response.statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
      this.#response.write("Internal error: " + (error as Error).message);
    }
  }
}
