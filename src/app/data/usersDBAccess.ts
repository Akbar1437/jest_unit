import Datastore from "@seald-io/nedb";
import { User } from "../models/userModels";

export class UsersDBAccess {
  #nedb: Datastore;

  constructor(nedb = new Datastore({ filename: "databases/Users.db" })) {
    this.#nedb = nedb;
    this.#nedb.loadDatabase();
  }

  async putUser(user: User) {
    return new Promise((resolve, reject) => {
      this.#nedb.insert(user, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  async getUsersByName(name: string): Promise<User[]> {
    const regEx = new RegExp(name);
    return new Promise((resolve, reject) => {
      this.#nedb.find({ name: regEx }, (err: Error, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }
}
