import { QtElement } from "../document/QtElement";

export class SGridRow extends QtElement{
    get tagname(): any {
        return "gridrow"
    }
}

type SGridViewProps = {
    minWidth?: number
    rowStretch?: number
}