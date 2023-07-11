import { QLabel, QLabelSignals } from "@nodegui/nodegui";
import { SBaseNative } from "./SBaseNative";

export class SText extends SBaseNative<QLabel, QLabelSignals>{
    constructor() {
        super()
        this.native = new QLabel()
    }
    get tagname(): string {
        return "text"
    }
    _onUpdateText(){
        const text = this.childNodes.join('')
        this.native.setText(text)
    }
}