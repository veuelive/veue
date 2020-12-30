import { autocorrectUrlEntry } from "../../../app/javascript/util/address";

describe("Url parsing for address entry", () => {
  it("should accept full URLs and not modify them", () => {
    const goodUrls = [
      "https://google.com",
      "https://jestjs.io/docs/en/asynchronous",
      "https://docs.fastly.com/en/guides/adding-or-modifying-headers-on-http-requests-and-responses",
      "https://www.google.co.uk/search?source=hp&ei=S1HrX5bYDcaEjLsP8ZWuKA&q=how+famous+is+hampton+catlin&oq=how+famous+is+hampton+catlin&gs_lcp=CgZwc3ktYWIQAzIFCCEQoAE6CAgAELEDEIMBOgsILhCxAxDHARCjAjoOCC4QsQMQgwEQxwEQowI6AggAOhEILhCxAxDHARCjAhDJAxCTAjoFCAAQsQM6CggAEMkDEEYQ-wE6CwgAELEDEIMBEMkDOgUILhCxAzoICAAQsQMQyQM6BQgAEMkDOgYIABAWEB46CAghEBYQHRAeOgcIIRAKEKABOgQIIRAVUOkTWLonYJ8paAFwAHgCgAGwAYgBkxGSAQQyOC4xmAEAoAEBqgEHZ3dzLXdpeg&sclient=psy-ab&ved=0ahUKEwjWqcjJxvPtAhVGAmMBHfGKCwUQ4dUDCAk&uact=5",
      "http://ümlaut.ca",
    ];

    for (const url of goodUrls) {
      expect(autocorrectUrlEntry(url)).resolves.toEqual(url);
    }
  });

  it("Should do some basic correction if missing protocol", () => {
    expect(autocorrectUrlEntry("google.com")).resolves.toEqual(
      "http://google.com"
    );
    expect(autocorrectUrlEntry("hampton.com/?mylivephotos=1")).resolves.toEqual(
      "http://hampton.com/?mylivephotos=1"
    );
  });

  it("should do a search if nothing else works", () => {
    expect(autocorrectUrlEntry("example")).resolves.toContain("example");
    expect(autocorrectUrlEntry("example")).resolves.toContain("duckduckgo");
  });
});
