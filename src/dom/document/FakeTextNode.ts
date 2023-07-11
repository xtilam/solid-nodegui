import { QtElement } from "./QtElement";


export class FakeTextNode {
    _is = true;
    private _t: string;
    private _p: QtElement;

    get parentNode() { return this._p; }
    set parentNode(v) { this._p = v; }
    get nodeType() { return 3 }
    get nextSibling() { return this.parentNode.childNodes.getNext(this as any) }
    get previousSibling() { return this.parentNode.childNodes.getPre(this as any) }
    
    constructor(text: string) {
        this._t = text;
    }
    set data(data) {
        this._t = data;
        this.parentNode?.updateText();
    }
    get data() {
        return this._t;
    }
    cloneNode() {
        console.log('fake text clone', this.toString())
    }
    toString() {
        return this._t;
    }
}
