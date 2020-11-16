export function showLoginElements(): void {
  const loggedIn = !!currentUserId();

  document
    .querySelectorAll("*[data-show-when-logged-in]")
    .forEach((element: HTMLElement) => {
      if (!loggedIn) {
        element.setAttribute("style", "display: none;");
      } else {
        element.setAttribute("style", "display: block;");
      }
    });
}

export function hideLoginElements(): void {
  const loggedIn = !!currentUserId();

  document
    .querySelectorAll("*[data-show-when-logged-out]")
    .forEach((element: HTMLElement) => {
      if (loggedIn) {
        element.setAttribute("style", "display: none;");
      } else {
        element.setAttribute("style", "display: block;");
      }
    });
}

export function currentUserId(): string | undefined {
  const element = document.querySelector("*[data-user-id]");
  return element?.getAttribute("data-user-id");
}
