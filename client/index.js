import React from "react"
import ReactDOM from "react-dom"
import KeyBoardLayouts from "./keyboards.js"

const ws = new WebSocket('ws://' + location.host);

ws.onopen = function() {
  console.log('WebSocket Client Connected');
};

function Delete({ str, ...props }) {

  function handleClick() {
    ws.send(JSON.stringify({action: 'delete'}))
  }

  return (<div className="delete key" onClick={handleClick}> {str} </div>)
}

function Display({str,...props}) {
  const [txt, setTxt] = React.useState(str);

  ws.onmessage = function (e) {
    setTxt(e.data);
  }

  return (<div className="display"> {txt} </div>)
}

function Key({char, type, clickHandler, ...props}) {
  return (
    <div className="key" onClick={() => clickHandler(char, type)}>
      {char}
    </div>
  )
}

function KeyBoard({chars,...props}) {

  let [layout, setLayout] = React.useState(0) 

  function handleClick(char, type) {
    if(type === 1) {
      setLayout(Number(!layout))
    } else {
      ws.send(JSON.stringify({
        action: 'insert',
        data: char
      }));
    }
  }

  const keyElements = KeyBoardLayouts[layout].map(c => {
    return (
      <Key 
        char={c.char} 
        key={c.char} 
        type={c.type}
        clickHandler={handleClick} 
      />
    )
  })

  return (
    <div className="keyboard">
      <div className="keyboard-wrapper">
        {keyElements}
      </div>
    </div>
  )
}

function App(props) {
  return(
    <div className="wrapper">
      <Display str={"..."} />
      <KeyBoard/>
      <Delete str={"delete"} />
    </div>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
