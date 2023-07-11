import { AlignmentFlag, QGridLayout, QGridLayoutSignals, QWidget, QWidgetSignals } from "@nodegui/nodegui";
import { SBaseNative } from "./SBaseNative";
import { QtElement } from "../document/QtElement";

export class SGridView extends SBaseNative<QWidget, QGridLayoutSignals>{
    get layout() {
        return this.native.layout() as QGridLayout
    }
    constructor() {
        super()
        const widget = new QWidget()
        this.native = widget
        widget.setLayout(new QGridLayout())
    }
    _onAppendChild(child: QtElement): void {
        if (!child.native) return
        if (!child.grid) return console.warn(`Missing grid propery ${child}`)
        // const { row, col, colSpan, rowSpan, alignment } = child.grid
        // this.layout.addWidget(child.native, row, col, rowSpan, colSpan, alignment)
    }
    _onInsertBefore(child: QtElement<QWidget<QWidgetSignals>, any>, beforeChild: QtElement<QWidget<QWidgetSignals>, any>): void {
        this._onAppendChild(child)
    }
}

export type GridProps = {
    row: number,
    col: number,
    rowSpan?: number,
    colSpan?: number,
    alignment?: AlignmentFlag
}