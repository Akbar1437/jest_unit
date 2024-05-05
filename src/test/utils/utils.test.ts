import { IncomingMessage } from "http";
import { Utils } from "../../app/utils/utils";

describe("Utils test suite", () => {
  test("getRequestPath valid request", () => {
    const request = {
      url: `${process.env.BASE_URL}/login`,
    } as IncomingMessage;
    const resultPath = Utils.getRequestBasePath(request);
    expect(resultPath).toBe("login");
  });

  test("getRequestPath with no pathname", () => {
    const request = {
      url: `${process.env.BASE_URL}/`,
    } as IncomingMessage;
    const resultPath = Utils.getRequestBasePath(request);
    expect(resultPath).toBeFalsy();
  });

  test("getRequestPath is empty", () => {
    const request = {
      url: "",
    } as IncomingMessage;
    const resultPath = Utils.getRequestBasePath(request);
    expect(resultPath).toBeFalsy();
  });
});
