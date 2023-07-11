import { FakeDocument } from "./document/FakeDocument";
import { QtElement } from "./document/QtElement"
import { register } from "./register"

export let fakeDocument: FakeDocument
let isInit = false

export function initDom() {
    if(isInit) return
    isInit = true;
    (global as any).window = global;
    if (fakeDocument) throw 'document has been definded'
    fakeDocument = new FakeDocument()
    global.document = fakeDocument as any
    register()
}

export function domRegister(tagname: string, init: InitQtElement) {
    fakeDocument.map[tagname] = init
}

initDom()

export type InitQtElement = () => QtElement

