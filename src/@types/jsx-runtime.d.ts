import { JSX as jsx } from "solid-js/types/jsx"
import { QtEventsMap } from "../dom/elements/SBaseNative"
import { SButton } from "../dom/elements/SButton"
import { GridProps, SGridView } from "../dom/elements/SGridView"
import { SLineEdit } from "../dom/elements/SLineEdit"
import { SText } from "../dom/elements/SText"
import { SView } from "../dom/elements/SView"
import { SWindow } from "../dom/elements/SWindow"
import { QWindowSignals } from "@nodegui/nodegui/dist/lib/QtGui/QWindow"
import { QGridLayoutSignals, QLabelSignals, QLineEditSignals, QPushButtonSignals, QTextEditSignals, QWidgetSignals } from "@nodegui/nodegui"

export namespace JSX {
    interface IntrinsicElements extends jsx.IntrinsicElements {
        "window": JSXEl<SWindow, QWindowSignals>
        "view": JSXEl<SView, QWidgetSignals>
        "text": JSXEl<SView, QLabelSignals>
        "button": JSXEl<SButton, QPushButtonSignals>
        "lineedit": JSXEl<SLineEdit, QLineEditSignals>
        "gridlayout": JSXEl<SGridView, QGridLayoutSignals>
    }
}
type CSSType = jsx.CSSProperties | string
type EventConvert<T> = { [n in keyof T as `on${Capitalize<n>}`]: T[n] }
type WidgetEvents<T = QtEventsMap<{}>> =  { [n in keyof T as `onQ${Capitalize<n>}`]: T[n] }

type JSXEl<T, S> = Partial<
    {
        ref?: T
        id?: string
        class?: string
        style?: CSSType
        grid?: GridProps
    }
    | WidgetEvents
    | EventConvert<S>
    | T['_props']
>
