import { createSignal, onMount } from "solid-js";
import { SView } from "./dom/elements/SView";
import babel from "babel-plugin-jsx-dom-expressions"
import { QPushButton } from "@nodegui/nodegui";

global.dd = babel()

export function App() {
  const [count, setCount] = createSignal(0)
  const [content, setContent] = createSignal('')
  let view: SView
  onMount(() => {
    setInterval(()=>{
      console.log('12') 
    }, 500)
  })
  return (
    <view>
      <button
        class="btn2 btn"
        onClicked={() => { setCount(c => ++c) }}
      >1234: {count()}</button>
      <button>{count()}</button>
      {/* <button onClicked={() => setCount(c => ++c)}>Counter: {count()} {content()} 123</button>
      <lineedit value={content()} onTextEdited={setContent}></lineedit>
      <lineedit value={content()}></lineedit>
      <button>text: {content()}</button> */}
      <text style={{ background: "red" }}
        onQMouseButtonPress={() => {
          setCount(c => ++c)
        }}
      >
        <style>{`
          table{
            font-size: 40px;
            background: green;
          }
        `}</style>
        <table>
          <tbody>
            <tr>
              <td>Key</td>
              <td style={{ width: "100%", "text-align": "center" }}>Value</td>
            </tr>
            <tr>
              <td>Count</td>
              <td>{count()}</td>
            </tr>
          </tbody>
        </table>
      </text>
    </view>
  );
}

const button = new QPushButton()
// button.addEventListener()