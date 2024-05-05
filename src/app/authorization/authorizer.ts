import { SessionTokenDBAccess } from "./sessionTokenDBAccess";
import {
  TokenGenerator,
  TokenValidator,
  SessionToken,
  TokenRights,
  TokenState,
  Account,
} from "../models/serverModels";
import { UserCredentialsDbAccess } from "./userCredentialsDbAccess";

export class Authorizer implements TokenGenerator, TokenValidator {
  #sessionTokenDBAccess: SessionTokenDBAccess;
  #userCredentialsDBAccess: UserCredentialsDbAccess;

  constructor(
    sessionTokenDBAccess = new SessionTokenDBAccess(),
    userCredentialsDBAccess = new UserCredentialsDbAccess()
  ) {
    this.#sessionTokenDBAccess = sessionTokenDBAccess;
    this.#userCredentialsDBAccess = userCredentialsDBAccess;
  }

  async generateToken(account: Account): Promise<SessionToken | null> {
    const resultAccount = await this.#userCredentialsDBAccess.getUserCredential(
      account.username,
      account.password
    );
    if (resultAccount) {
      const token: SessionToken = {
        accessRights: resultAccount.accessRights,
        expirationTime: this.generateExpirationTime(),
        userName: resultAccount.username,
        valid: true,
        tokenId: this.generateRandomTokenId(),
      };
      await this.#sessionTokenDBAccess.storeSessionToken(token);
      return token;
    } else {
      return null;
    }
  }

  async validateToken(tokenId: string): Promise<TokenRights> {
    const token = await this.#sessionTokenDBAccess.getToken(tokenId);
    if (!token || !token.valid) {
      return {
        accessRights: [],
        state: TokenState.INVALID,
      };
    } else if (token.expirationTime < new Date()) {
      return {
        accessRights: [],
        state: TokenState.EXPIRED,
      };
    }
    return {
      accessRights: token.accessRights,
      state: TokenState.VALID,
    };
  }

  private generateExpirationTime() {
    return new Date(Date.now() + 60 * 60 * 1000);
  }

  private generateRandomTokenId() {
    return Math.random().toString(36).slice(2);
  }
}
