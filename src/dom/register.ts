import { TemplateTag } from "./document/TemplateTag";
import { domRegister } from "./domInit";
import { SButton } from "./elements/SButton";
import { SGridView } from "./elements/SGridView";
import { SLineEdit } from "./elements/SLineEdit";
import { SText } from "./elements/SText";
import { SView } from "./elements/SView";
import { SWindow } from "./elements/SWindow";

export function register() {
  domRegister("window", () => new SWindow());
  domRegister("widget", () => new SView());
  domRegister("view", () => new SView());
  domRegister("text", () => new SText());
  domRegister("button", () => new SButton());
  domRegister("lineedit", () => new SLineEdit());
  domRegister("gridlayout", () => new SGridView());
  domRegister("template", () => new TemplateTag() as any);
}
