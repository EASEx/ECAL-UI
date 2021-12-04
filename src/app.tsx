import * as React from "react";
import * as ReactDOM from "react-dom";

function render() {
  ReactDOM.render(
    <h2>
      Hello from React!
      <button
        onClick={() => {
          window.myAPI.invoke
            .getDataFromStore("someKey")
            .then(console.log)
            .catch(console.log);
        }}
      >
        SUBMIT
      </button>
    </h2>,
    document.body
  );
}

render();
