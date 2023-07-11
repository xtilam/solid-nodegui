import { QPushButton, QPushButtonSignals, WidgetEventTypes } from "@nodegui/nodegui";
import { SBaseNative } from "./SBaseNative";

export class SButton extends SBaseNative<QPushButton, QPushButtonSignals>{
    constructor() {
        super()
        this.native = new QPushButton()
    }
    get tagname(): string {
        return "button"
    } 
    _onUpdateText(): void {
        this.native.setText(this.childNodes.join(''))
    }
}