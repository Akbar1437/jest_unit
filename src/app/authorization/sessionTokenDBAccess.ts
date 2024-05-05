import { SessionToken } from "../models/serverModels";
import Datastore from "@seald-io/nedb";

export class SessionTokenDBAccess {
  #nedb: Datastore;

  constructor(
    nedb = new Datastore({
      filename: "databases/sessionToken.db",
      autoload: true,
    })
  ) {
    this.#nedb = nedb;
    this.#nedb.loadDatabaseAsync();
  }

  async storeSessionToken(token: SessionToken): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#nedb.insert(token, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getToken(tokenId: string): Promise<SessionToken | undefined> {
    return new Promise((resolve, reject) => {
      this.#nedb.find({ tokenId: tokenId }, (err: Error, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          if (docs.length == 0) {
            resolve(undefined);
          } else {
            resolve(docs[0]);
          }
        }
      });
    });
  }
}
