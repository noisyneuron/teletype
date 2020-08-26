import React from "react"
import ReactDOM from "react-dom"
import AllKeys from "./keyboards.js"

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

function Key({char, clickHandler, ...props}) {
  return (
    <div className="key" onClick={() => clickHandler(char)}>
      {char}
    </div>
  )
}

function KeyBoard({chars,...props}) {
  function handleClick(char) {
    ws.send(JSON.stringify({
      action: 'insert',
      data: char
    }));
  }

  const rows = chars.map( (row,i) => {
    const r = row.map( char => {
      return (
        <Key char={char} key={char} clickHandler={handleClick} />
      )
    })
    return (
      <div className="row" key={`row-${i}`}> {r} </div>
    )
  })

  return (
    <div className="keyboard">
      {rows}
    </div>
  )
}

function App(props) {
  return(
    <div className="wrapper">
      <Display str={"..."} />
      <KeyBoard chars={AllKeys} />
      <Delete str={"delete"} />
    </div>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
