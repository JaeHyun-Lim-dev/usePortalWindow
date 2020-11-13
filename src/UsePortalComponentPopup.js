import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const UsePortal = (props) => {
  const [containerEl] = useState(document.createElement("div"));
  let externalWindow = null;
  useEffect(
    () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      externalWindow = window.open(
        "",
        "",
        "width=600,height=400,left=200,top=200"
      );
      externalWindow.document.body.appendChild(containerEl);
      externalWindow.addEventListener("beforeunload", () => {
        props.closePortalWindow();
      });
      console.log("Created Popup Window");
      return function cleanup() {
        console.log("Cleaned up Popup Window");
        externalWindow.close();
        externalWindow = null;
      };
    },
    // Only re-renders this component if the variable changes
    []
  );
  return ReactDOM.createPortal(props.children, containerEl);
};

export default UsePortal;
