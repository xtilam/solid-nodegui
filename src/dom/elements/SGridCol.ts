import { QtElement } from "../document/QtElement";

export class SGridCol extends QtElement<any, {}, {}>{
    get tagname(): any {
        return "gridcol"
    }
}