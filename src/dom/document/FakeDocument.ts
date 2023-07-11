import { FakeTextNode } from "./FakeTextNode";
import { HTMLText } from "./HTMLText";
import { InitQtElement } from "../domInit";
import { QtElement } from "./QtElement";


export class FakeDocument {
    private m: Record<string, InitQtElement> = {};
    get map() { return this.m; }
    createElement(tagname: string) {
        const init = this.map[tagname];
        if (!init) {
            return new HTMLText(tagname);
        }
        const dom = init();
        return dom;
    }
    createElementNS(url, tagname) {
        return this.createElement(tagname);
    }
    createTextNode(text: '') {
        return new FakeTextNode(text);
    }
    importNode(node: QtElement, deep: boolean) {
        console.log('call import node', node)
    }
}
