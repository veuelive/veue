import fetch from "jest-fetch-mock";
import {
  getCsrfToken,
  isProduction,
} from "../../../app/javascript/util/environment";

export const SOME_TOKEN = "SOME_TOKEN";

beforeEach(() => {
  document.head.innerHTML = `<meta name='csrf-token' content='${SOME_TOKEN}'>`;
  fetch.resetMocks();
});

it("should have working getCsrfToken", () => {
  expect(getCsrfToken()).toBe(SOME_TOKEN);
});

it("should detect production", () => {
  expect(isProduction({ hostname: "www.veuelive.com" })).toBe(true);
  expect(isProduction({ hostname: "veuelive.com" })).toBe(true);
  expect(isProduction({ hostname: "beta.veuelive.com" })).toBe(false);
  expect(isProduction({ hostname: "localhost" })).toBe(false);
});
