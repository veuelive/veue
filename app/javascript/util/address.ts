const allowedTlds = [
  "com",
  "net",
  "org",
  "uk",
  "ca",
  "fr",
  "de",
  "in",
  "ir",
  "au",
  "br",
  "pk",
];

export function autocorrectUrlEntry(input: string): string {
  /**
   * Check for Proper URL
   */
  try {
    // If this doesn't error, we are good to go!
    new URL(input);
    return input;
  } catch (e) {
    // This means we should keep going
  }

  /**
   * Check for partial URL
   */
  try {
    const combined = `http://${input}`;
    const url = new URL(combined);
    for (const tld of allowedTlds) {
      if (url.hostname.endsWith("." + tld)) {
        return combined;
      }
    }
  } catch (e) {
    // Well, that didn't work
  }

  // let's do a search and call it a day!
  return `https://duckduckgo.com/?q=${encodeURI(input)}`;
}
