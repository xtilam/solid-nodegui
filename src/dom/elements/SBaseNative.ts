import { CursorShape, QCursor, QIcon, QSizePolicyPolicy, QWidget, WidgetEventTypes, WindowState, WindowType } from "@nodegui/nodegui";
import { QtElement } from "../document/QtElement";
import { NativeRawPointer } from "@nodegui/nodegui/dist/lib/core/Component";

export const QtSetAttribute: Record<string, (value: any, el: QtElement) => void> = {
    id(value: string, { native }: QtElement<QWidget>) {
        native.setObjectName(value)
    },
    style(value: string, { native }: QtElement<QWidget>) {
        native.setStyleSheet(value)
    },
    class(value: string, { native }: QtElement<QWidget>) {
        return native.setProperty('class', value)
    },
    windowTitle(value: string, { native }: QtElement<QWidget>) {
        return native.setWindowTitle(value)
    },
    windowFlag([type, switchOn]: [WindowType, boolean], { native }: QtElement<QWidget>) {
        return native.setWindowFlag(type, switchOn)
    },
    width(width: number, el: QtElement<QWidget>) {
        el.style.setProperty('width', width as any)
    },
    height(height: number, el: QtElement<QWidget>) {
        el.style.setProperty('height', height as any)
    },
    visible(isVisible: boolean, { native }: QtElement<QWidget>) {
        native.setVisible(isVisible)
    },
    enable(isEnable: boolean, { native }: QtElement<QWidget>) {
        native[isEnable ? 'setEnabled' : 'setDisabled'](true)
    },
    sizePolicy([horizontal, vertical]: [QSizePolicyPolicy, QSizePolicyPolicy], { native }: QtElement<QWidget>) {
        native.setSizePolicy(horizontal, vertical)
    },
    grid(grid, el) {
        console.log('apply grid', grid)
        el.grid = grid
    },
}

export class SBaseNative<Q extends QWidget = QWidget, S = {}, P = {}> extends QtElement<Q, QtEventsMap<S>, P & WidgetProps>{
    get tagname(): string {
        throw new Error("Method not implemented.");
    }
    get mapSetter(): Record<string, (value: any, el: QtElement) => void> {
        return QtSetAttribute
    }
    _onSetAttribute(attr: string, value: any) {
        const callback = this.mapSetter[attr] || QtSetAttribute[attr]
        if (callback) return callback(value, this)
    }
    _onAppendChild(child: QtElement): void {
        this.updateText()
    }
    _onInsertBefore(child: QtElement, beforeChild: QtElement): void {
        this.updateText()
    }
    _onRemoveChild(child: QtElement): void {
        this.updateText()
    }
}

export type WidgetProps = {
    style?: string
    id?: string
    class?: string
    windowTitle?: string
    width?: number
    height?: number
    visible?: boolean
    enable?: boolean | "true" | "false"
    x?: number
    y?: number
}

type FN = {
    [n in keyof typeof WidgetEventTypes]: (
        event?: NativeRawPointer<"QEvent">
    ) => any;
};
export type QtEventsMap<S = {}, MIX = S & FN> = {
    [n in keyof MIX]: MIX[n] extends (...args: any[]) => any
    ? MIX[n]
    : () => void;
};
