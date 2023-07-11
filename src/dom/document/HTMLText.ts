import { LinkerArray } from "../utils/LinkerArray";
import { FakeTextNode } from "./FakeTextNode";
import { QtElement } from "./QtElement";


export class HTMLText extends QtElement {
    private _t: string;
    private _is = true;
    constructor(tagname: string) {
        super();
        this._t = tagname;
    }
    get tagname(): string {
        return this._t;
    }
    updateText(): void {
        this.parentNode?.updateText();
    }
    _onSetAttribute(attr: string, value: any) {
        this.updateText();
    }
    toString() {
        let attr = '';
        const map = this.mapAttributes;
        for (const key in map) {
            attr += ` ${key}="${map[key]}"`;
        }
        return `<${this._t + attr}>${this.childNodes.join('')}</${this._t}>`;
    }
}
