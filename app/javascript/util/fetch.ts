/**
 * This function grabs the latest CSRF token from the dom.
 * You'll notice that we connect to the element only once, but
 * we have the "getter" as a function. This is because the value
 * of the element above can change!
 */
export function getCsrfToken(): string {
  const csrfElement = document.getElementsByName(
    "csrf-token"
  )[0] as HTMLMetaElement;

  return csrfElement.content;
}

/**
 * If you are sending some JSON data over to the server, this is probably the method
 * you are looking for!
 *
 * It will automatically set any headers that you need to successfully talk to our
 * Rails server including content-type and CSRF tokens.
 *
 * @param path
 * @param jsonObject
 */
export function postJson(path: string, jsonObject: unknown): Promise<Response> {
  return secureJSONFetch(path, jsonObject, "POST");
}

/**
 * If you want to POST a form straight from Javascript objects, use this!
 */
export function postForm(path: string, data?: unknown): Promise<Response> {
  return secureFormFetch(path, "POST", data);
}

/**
 * If you want to AJAX POST to the server, but don't have a particular payload you want to deliver, this
 * one is what you want!
 *
 * @param path
 * @param options
 */
export function post(path: string, options?: RequestInit): Promise<Response> {
  if (!options) {
    options = {};
  }
  options.method = "POST";
  return secureFetch(path, options);
}

/**
 * If you are sending some PUT JSON data over to the server, this is probably the method
 * you are looking for!
 *
 * It will automatically set any headers that you need to successfully talk to our
 * Rails server including content-type and CSRF tokens.
 *
 * @param path
 * @param jsonObject
 */
export function putJson(
  path: string,
  jsonObject: Record<string, unknown>
): Promise<Response> {
  return secureJSONFetch(path, jsonObject, "PUT");
}

/**
 * If you want to POST a form straight from Javascript objects, use this!
 */
export function putForm(path: string, data?: unknown): Promise<Response> {
  return secureFormFetch(path, "PUT", data);
}

/**
 * If you want to AJAX PUT to the server, but don't have a particular payload you want to deliver, this
 * one is what you want!
 *
 * @param path
 * @param options
 */
export function put(path: string, options?: RequestInit): Promise<Response> {
  if (!options) {
    options = {};
  }
  options.method = "PUT";
  return secureFetch(path, options);
}

/**
 * If you want to AJAX delete to the server, then go with this method.
 *
 * Normally this would be called "delete", but that is a reserved keyword in Javascript!
 *
 * @param path
 * @param options
 */
export function destroy(
  path: string,
  options?: RequestInit
): Promise<Response> {
  if (!options) {
    options = {};
  }
  options.method = "DELETE";
  return secureFetch(path, options);
}

/**
 * ** YOU PROBABLY DON'T WANT THIS FUNCTION **
 *
 * This is a helper method that we use to power the putJson and postJson** methods.
 *
 * @param path
 * @param jsonObject an object of any type that you want to send
 * @param method
 */
function secureJSONFetch(
  path: string,
  jsonObject: unknown,
  method: "POST" | "PUT" | "DELETE"
): Promise<Response> {
  const body = JSON.stringify(jsonObject);

  return secureFetch(path, {
    method,
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * This is the helper function for all form-post requests
 */
export function secureFormFetch(
  path: string,
  method: string,
  data?: unknown
): Promise<Response> {
  let formData = new FormData();
  if (data instanceof HTMLFormElement) {
    formData = new FormData(data);
  } else if (data instanceof Object) {
    for (const key in data) {
      formData.append(key, data[key]);
    }
  }

  return secureFetch(path, {
    method,
    body: formData,
  });
}

/**
 * This is the lowest level function supplied by this util library.
 *
 * It's almost exactly like WebAPI's fetch() but will add the CSRF token for you.
 *
 * Likely you should use one of the helpers above.
 *
 * @param path
 * @param options
 */
export function secureFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  if (!options) {
    options = {};
  }
  if (!options.headers) {
    options.headers = {};
  }
  options.headers["X-CSRF-Token"] = getCsrfToken();
  return fetch(path, options);
}
