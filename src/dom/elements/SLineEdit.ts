import { QLineEdit, QLineEditSignals } from "@nodegui/nodegui";
import { QtSetAttribute, SBaseNative } from "./SBaseNative";
import { QtElement } from "../document/QtElement";

const mapSetter: Record<string, (value: any, el: QtElement<QLineEdit>) => void> = {
    ...QtSetAttribute,
    value(value: string, { native }) {
        value = `${value}`
        if (native.text() === value) return
        native.setText(value)
    }
}
export class SLineEdit extends SBaseNative<QLineEdit, QLineEditSignals, SLineEditProps>{
    get mapSetter() {
        return mapSetter
    }
    constructor() {
        super()
        this.native = new QLineEdit()
    }
    get tagname(): string {
        return "line-edit"
    }
    get value() {
        return this.native.text()
    }
    set value(value){
        this.native.setText(value)
    }
}

type SLineEditProps = {
    value: string
}