import { QMainWindow, QWidget, QWidgetSignals } from "@nodegui/nodegui";
import { QWindowSignals } from "@nodegui/nodegui/dist/lib/QtGui/QWindow";
import { QtElement } from "../document/QtElement";
import { SBaseNative } from "./SBaseNative";

export class SWindow extends SBaseNative<QMainWindow, QWindowSignals>{
    constructor() {
        super();
        this.native = new QMainWindow()
    }
    get tagname(): string {
        return "window"
    }
    _onAppendChild(child: QtElement<QWidget<QWidgetSignals>, any>): void {
        const nativeChild = child.native
        if (!nativeChild) return
        const win = this.native
        const central = win.centralWidget()
        if (central) {
            if (nativeChild === central) return
            console.warn('QMainWindow support one node')
            return
        }
        win.setCentralWidget(nativeChild)
    }
}