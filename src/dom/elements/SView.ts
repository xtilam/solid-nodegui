import { FlexLayout, QWidget, QWidgetSignals } from "@nodegui/nodegui";
import { QWindowSignals } from "@nodegui/nodegui/dist/lib/QtGui/QWindow";
import { QtElement } from "../document/QtElement";
import { SBaseNative } from "./SBaseNative";

export class SView extends SBaseNative<QWidget, QWindowSignals>{
    constructor() {
        super()
        const widget = new QWidget()
        widget.setLayout(new FlexLayout())
        this.native = widget
        widget.show()
    }
    get tagname(): string {
        return "view"
    }
    get layout() {
        return this.native.layout() as FlexLayout
    }
    _onAppendChild(child: QtElement): void {
        const childNative = child.native
        if (!childNative) return
        this.layout.addWidget(childNative)
    }
    _onInsertBefore(child: QtElement, beforeChild: QtElement): void {
        const childNative = child.native
        const childs = this.childNodes
        if (!childNative) return
        while (true) {
            if (!beforeChild) return this.appendChild(child)
            if (beforeChild.native) break
            beforeChild = childs.getNext(beforeChild)
        } 
        this.layout.insertChildBefore(child.native, beforeChild.native)
    }
}