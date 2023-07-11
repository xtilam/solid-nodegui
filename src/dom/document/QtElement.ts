import { QWidget, WidgetEventTypes } from "@nodegui/nodegui";
import { NativeRawPointer } from "@nodegui/nodegui/dist/lib/core/Component";
import { GridProps } from "../elements/SGridView";
import { LinkerArray } from "../utils/LinkerArray";
import { EventListenerOptions } from "@nodegui/nodegui/dist/lib/core/EventWidget";
import { FakeTextNode } from "./FakeTextNode";

export abstract class QtElement<
  Native extends QWidget = QWidget,
  SIGNAL = {},
  PROPS = {},
> {
  _signals: SIGNAL;
  _props: PROPS;
  private _g: GridProps;

  get grid() {
    return this._g;
  }
  set grid(value) {
    this._g = value;
  }

  private _cn = new LinkerArray<QtElement>(); // child_nodes
  get childNodes() {
    return this._cn;
  }

  private _p: QtElement; // parent_node
  get parentNode() {
    return this._p;
  }
  set parentNode(v) {
    this._p = v;
  }

  private _n: Native;
  get native() {
    return this._n;
  }
  set native(value) {
    this._n = value;
  }

  private _ma: Record<string, any> = {}; // _mapAttribute
  private _msa: Record<string, any> = {}; // _mapSpecialAtrribute

  get mapAttributes() { return this._ma }
  set mapAttributes(value) { this._ma = value }

  private _wt = false; // _isWaitTextUpdate
  get isWaitTextUpdate() { return this._wt }
  set isWaitTextUpdate(value) { this._wt = value; }

  abstract get tagname();

  get nodeType() { return 1 }
  get firstChild() { return this.childNodes[0] }
  get nextSibling() {
    return this.parentNode.childNodes.getNext(this as any)
  }
  get previousSibling() { return this.parentNode.childNodes.getPre(this as any) }
  get lastChild() { return this.childNodes[this.childNodes.length] }

  style = new StyleMap(this as any);

  addEventListener<EVT extends keyof SIGNAL>(
    evt: EVT,
    callback: SIGNAL[EVT],
    options?: EventListenerOptions
  ) {
    if (!this.native) return;
    console.log('add event', callback, evt)
    this.native.addEventListener(evt as any, callback, options);
  }
  removeEventListener<EVT extends keyof SIGNAL>(
    evt: EVT,
    callback: SIGNAL[EVT],
    options?: EventListenerOptions
  ) {
    if (!this.native || !this.native.native) return;
    this.native.removeEventListener(evt as any, callback, options);
  }
  appendChild(child: QtElement) {
    const { childNodes: childs } = this;
    if (childs.isExistsItem(child)) childs.remove(child);
    childs.add(child);
    this._onAppendChild(child);
    child.parentNode = this as any;
  }
  insertBefore(child: QtElement, beforeChild: QtElement) {
    const { childNodes: childs } = this;
    if (childs.isExistsItem(child)) childs.remove(child);
    if (!childs.isExistsItem(beforeChild)) return this.appendChild(child);
    const beforeIndex = childs.getIndex(beforeChild);
    childs.insertBeforeIndex(beforeIndex, child);
    child.parentNode = this as any;
    this._onInsertBefore(child, beforeChild);
  }
  replaceChild(newChild: QtElement, oldChild: QtElement) {
    this.insertBefore(newChild, oldChild)
    this.removeChild(oldChild)
  }
  removeChild(child: QtElement) {
    const { childNodes: childs } = this;
    const length = childs.length;
    if (child.parentNode !== this || !childs.isExistsItem(child))
      throw "the deleted element is not a child of the current element";
    childs.remove(child);
    child.parentNode = null;
    this._onRemoveChild(child);
    child.native?.delete();
  }
  remove() {
    this.native?.delete();
    if (!this.parentNode) return;
    this.parentNode.childNodes.remove(this as any);
  }
  setAttribute(attr: string, value: any) {
    let attrName = this._specialAttributes()[attr];
    let map = attrName ? this._msa : (attrName = attr, this._ma);
    map[attrName] = value;
    this._onSetAttribute(attr, value);
  }
  getAttribute(attr: string) {
    let attrName = this._specialAttributes()[attr];
    let map = attrName ? this._msa : this._ma;
    return map[attrName];
  }
  updateText() {
    if (this.isWaitTextUpdate) return;
    this.isWaitTextUpdate = true;
    setTimeout(() => {
      this.isWaitTextUpdate = false;
      this._onUpdateText();
    }, 2);
  }
  set textContent(content) {
    for (const child of this.childNodes) {
      this._onRemoveChild(child)
    }
    this._cn.splice(0, this._cn.length)
    if(!content) return
    this.appendChild(new FakeTextNode(content) as any)
    this.updateText()
  }
  get textContent() {
    return ""
  }
  _specialAttributes() {
    return {};
  }
  _onSetAttribute(attr: string, value: any) { }
  _onUpdateText() { }
  _onAppendChild(child: QtElement) { }
  _onRemoveChild(child: QtElement) { }
  _onInsertBefore(child: QtElement, beforeChild: QtElement) { }
  _onRemove() { }
  cloneNode(node) {
    const clone = document.createElement(this.tagname) as any as QtElement
    recursive(clone, this as any)
    function recursive(cloneEl: QtElement, currentEl: QtElement) {
      for (const child of currentEl.childNodes) {
        if (child instanceof FakeTextNode) {
          cloneEl.appendChild(new FakeTextNode(`${child}`) as any)
          continue
        }
        const newEl = document.createElement(child.tagname) as any as QtElement
        cloneEl.appendChild(newEl)
        recursive(newEl, child)
        // active attribute event
        const _ma = child._ma
        newEl._ma = { ..._ma }
        for (const attr in newEl._ma) {
          newEl._onSetAttribute(attr, _ma[attr])
        }

        // active special attribute event
        const mapAttr = child._specialAttributes()
        const _msa = child._msa
        for (const attr in _msa) {
          const trueAttr = mapAttr[attr]
          if (!trueAttr) continue
          newEl._onSetAttribute(trueAttr, _msa[attr])
        }
      }
    }
    return clone
  }
  // insertBefore(child, node);
  // removeChild(child);
}

class StyleMap {
  p: QtElement; // parent
  get parent() {
    return this.p;
  }
  m: Record<string, string> = {}; // map
  get map() {
    return this.m;
  }
  i: boolean; // isUpdate
  get isUpdate() {
    return this.i;
  }
  set isUpdate(value) {
    this.i = value;
  }

  constructor(parent: QtElement) {
    this.p = parent;
  }
  setProperty(property: string, value: string) {
    this.m[property] = value;
    this.updateStyle();
  }
  getProperty(property: string) {
    return this.m[property];
  }
  removeProperty() { }
  updateStyle() {
    if (this.isUpdate) return;
    this.isUpdate = true;
    setTimeout(() => {
      this.isUpdate = false;
      this.p.setAttribute("style", this.toString());
    }, 2);
  }
  toString() {
    let content = "";
    const map = this.map;
    for (const v in map) {
      content += `${v}:${map[v]};`;
    }
    return content;
  }
}
