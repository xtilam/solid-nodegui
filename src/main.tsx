import { initDom } from "./dom/domInit";
import { QApplication, QIcon } from "@nodegui/nodegui";
import { readFileSync } from "fs";
import path from "path";
import { SWindow } from "./dom/elements/SWindow";
import "./style.css";
import { render } from "solid-js/web";
import { App } from "./App";

QApplication.instance().setStyleSheet(
  `${readFileSync(path.resolve("dist/styles.css"))}`
);
 
initDom();

let win = document.createElement("window") as any as SWindow;
let oldWin: SWindow = global.__win__;

if (oldWin) { 
  global.__root__ && __root__();
  win.native.delete();
  win.native = oldWin.native;
  win.native.centralWidget()?.delete();
}  
 
global.__win__ = win; 
if (!win.native.isVisible()) { 
  win.native.show();
}
win.native.move(1925, 10);

win.native.resize(400, 400);
win.native.setWindowTitle("Hello NodeGUI");

global.__root__ = render(App, win as any);

// import ts from "typescript"
// import path from "path"
// import fs from "fs"
// import "./test"
// const programPath = path.join(__dirname, "../src/test.ts")
// const program = ts.createProgram(
//   [programPath],
//   {
//   options: JSON.parse(
//     fs.readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8") as any)
// } as any) 
// global.program = program