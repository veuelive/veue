/**
 * This function grabs the latest CSRF token from the dom.
 * You'll notice that we connect to the element only once, but
 * we have the "getter" as a function. This is because the value
 * of the element above can change!
 */
export function getCsrfToken(): string {
  const elements = document.getElementsByName("csrf-token");
  if (elements.length === 0) {
    console.log("No CSRF Token Found");
    return "";
  }
  const csrfElement = elements[0] as HTMLMetaElement;
  return csrfElement.content;
}

export function isProduction(
  location = window.location as { hostname: string }
): boolean {
  const { hostname } = location;
  return hostname == "veuelive.com" || hostname == "www.veuelive.com";
}
