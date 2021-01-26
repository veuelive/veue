import isValidEmail from "../../../app/javascript/util/email_validator";

describe("Email Validator", () => {
  it("Should return true on correct email", () => {
    expect(isValidEmail("example@test.com")).toEqual(true);
  });

  it("Should return false on incorrect email", () => {
    expect(isValidEmail("example@test")).toEqual(false);
  });
});
