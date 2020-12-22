import { html, TemplateResult } from "lit-element";
import "../index";

export default {
  title: "VeueExample",
  argTypes: {
    title: { control: "string" },
    counter: { control: "number" },
    text: { control: "string" },
  },
};

interface ITemplate {
  title?: string;
  text?: string;
  counter?: number;
}
const Template = ({ title, text, counter = 0 }: ITemplate): TemplateResult => {
  return html`
    <veue-example .title=${title} .counter=${counter}>${text}</veue-example>
  `;
};

export const MyElement = (args: ITemplate): TemplateResult => Template(args);
MyElement.args = {
  title: "My title",
};

export const NegativeCounter = (args: ITemplate): TemplateResult =>
  Template(args);
NegativeCounter.args = {
  title: "Foo",
  counter: -5,
};

export const SlottedText = (args: ITemplate): TemplateResult => Template(args);
SlottedText.args = {
  title: "My title",
  text: "Some slotted text",
};
