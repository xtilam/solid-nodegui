import { QtElement } from "./QtElement";
import { parse } from "node-html-parser"
import HTMLParse from "html-parser"
import { HTMLText } from "./HTMLText";
import { FakeTextNode } from "./FakeTextNode";
export class TemplateTag {
    private _ih;
    private _c: QtElement
    
    set innerHTML(html) {
        this._ih = html
            .replaceAll('<!>', '<_text_node>')
            .replaceAll("<style>", "<_style>")
            .replaceAll("</style>", "</_style>")
        const template = new HTMLText('template')
        let el = template
        HTMLParse.parse(this._ih, {
            openElement: function (name) {
                if (name === '_text_node') {
                    return el.appendChild(new FakeTextNode('') as any)
                }
                if (name === '_style') name = 'style'
                const newEl = new HTMLText(name)
                el.appendChild(newEl)
                el = newEl
            },
            closeElement: function (name) {
                el = el.parentNode as any
            },
            attribute: function (name, value) { el.setAttribute(name, value) },
            text: function (value) { el.appendChild(new FakeTextNode(value) as any) }
        })
        this._c = template
    }
    get innerHTML() { return this._ih }
    get content() {
        return this._c
    }
    get tagname(): string {
        return "template";
    }
}