import * as React from "react";
//import the global css which includes Figma color, spacing, and type vars
//also includes a basic set of utility classes
import { GlobalCSS } from "figma-plugin-ds-svelte";

//import the desired components
// import { Button, Input, SelectMenu } from 'figma-plugin-ds-svelte';
import "../styles/ui.css";

declare function require(path: string): any;

const App = ({}) => {
  const onCreate = React.useCallback(() => {
    const message = "dark-theme";
    parent.postMessage({ pluginMessage: { type: "run-app", message } }, "*");
  }, []);

  React.useEffect(() => {
    window.onmessage = event => {
      const { type, message } = event.data.pluginMessage;
      if (type === "theme-selected") {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div>
      <button id="create" onClick={onCreate}>
        Create
      </button>
    </div>
  );
};

export default App;
