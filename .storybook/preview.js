import { addParameters, setCustomElements } from "@storybook/web-components";

addParameters({
  docs: {
    iframeHeight: "200px",
  },
});

async function run() {
  const customElements = await (
    await fetch(new URL("../custom-elements.json", import.meta.url))
  ).json();

  setCustomElements(customElements);
}

run();
