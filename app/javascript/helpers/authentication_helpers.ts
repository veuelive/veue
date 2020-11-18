export function showHideByLogin(): void {
  showLoginElements();
  hideLoginElements();
}

export function currentUserId(): string | undefined {
  const element = document.querySelector("*[data-user-id]");
  return element?.getAttribute("data-user-id");
}

function showLoginElements(): void {
  const loggedIn = !!currentUserId();

  document
    .querySelectorAll("*[data-show-when-logged-in]")
    .forEach((element: HTMLElement) => {
      visibilityOfDataElement(element, !loggedIn);
    });
}

function hideLoginElements(): void {
  const loggedIn = !!currentUserId();

  document
    .querySelectorAll("*[data-show-when-logged-out]")
    .forEach((element: HTMLElement) => {
      visibilityOfDataElement(element, loggedIn);
    });
}

function visibilityOfDataElement(
  dataElementName: HTMLElement,
  hidden: boolean
): void {
  dataElementName.setAttribute(
    "style",
    hidden ? "display: none;" : "display: block;"
  );
}
