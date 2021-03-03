function successFlash(): HTMLDivElement {
  const flash = document.createElement("div");
  flash.className = "flash-success";
  flash.innerText = "Settings updated!";
  return flash;
}

function errorFlash(): HTMLDivElement {
  const flash = document.createElement("div");
  flash.className = "flash-error";
  flash.innerText = "Unable to update settings!";
  return flash;
}

export const flash = {
  success: successFlash,
  error: errorFlash,
};
