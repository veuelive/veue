import {
  destroy,
  getCsrfToken,
  post,
  postJson,
  put,
  putJson,
  secureFetch,
} from "../../../app/javascript/util/fetch";
import fetch from "jest-fetch-mock";

const SOME_TOKEN = "SOME_TOKEN";
const SOME_PATH = "/api/test";

beforeEach(() => {
  document.head.innerHTML = `<meta name='csrf-token' content='${SOME_TOKEN}'>`;
  fetch.resetMocks();
});

it("should have working getCsrfToken", () => {
  expect(getCsrfToken()).toBe(SOME_TOKEN);
});

const expectFetchLike = (path, info: RequestInit): RequestInit => {
  expect(fetch.mock.calls[0][0]).toEqual(path);
  const requestInit = fetch.mock.calls[0][1] as RequestInit;
  if (!info.headers) {
    info.headers = {};
  }
  // Assert that every call to this is secured
  info.headers["X-CSRF-Token"] = SOME_TOKEN;
  expect(requestInit).toEqual(info);
  return requestInit;
};

describe("secureFetch", () => {
  it("should add token to secure fetch", () => {
    secureFetch(SOME_PATH);
    expectFetchLike(SOME_PATH, {});
  });

  it("should allow for extra new headers!", () => {
    const headers = { "X-Hampton-Tag": "1982" };

    secureFetch(SOME_PATH, { headers });

    // The expectFetchLink method will put in the token header for checking
    const requestInit = expectFetchLike(SOME_PATH, { headers });
    const newHeaders = requestInit.headers;
    expect(newHeaders["X-Hampton-Tag"]).toEqual("1982");
    expect(newHeaders["X-CSRF-Token"]).toEqual(SOME_TOKEN);
  });

  it("allows specification of the method", () => {
    secureFetch(SOME_PATH, { method: "POST" });
    expectFetchLike(SOME_PATH, { method: "POST" });
  });
});

describe("simple helpers", () => {
  for (const [httpMethod, fun] of Object.entries({
    POST: post,
    PUT: put,
    DELETE: destroy,
  })) {
    describe(fun.name + "()", () => {
      it("should do a " + httpMethod, () => {
        fun(SOME_PATH);
        expectFetchLike(SOME_PATH, { method: httpMethod });
      });

      it("should override if you did specify method", () => {
        fun(SOME_PATH, { method: "OTHER" });
        expectFetchLike(SOME_PATH, { method: httpMethod });
      });

      it("should allow custom headers", () => {
        const headers = { "X-Ninja-Turtle": "Donatello" };
        fun(SOME_PATH, { headers });
        expectFetchLike(SOME_PATH, { headers, method: httpMethod });
      });
    });
  }
});

describe("JSON helpers", () => {
  for (const [httpMethod, fun] of Object.entries({
    POST: postJson,
    PUT: putJson,
  })) {
    describe(fun.name + "()", () => {
      it("should do a " + httpMethod, () => {
        fun(SOME_PATH, { data: 123 });
        expectFetchLike(SOME_PATH, {
          method: httpMethod,
          body: `{"data":123}`,
          headers: {
            "Content-Type": "application/json",
          },
        });
      });
    });
  }
});
