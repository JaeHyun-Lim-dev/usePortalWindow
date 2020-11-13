import React, { useState, useContext, createContext } from "react";
import ReactDOM from "react-dom";

export const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  const [portals, setPortals] = useState([]);
  const open = (element = null, url, windowOptions = "") => {
    const portalElement = element;
    const containerEl = document.createElement("div");
    const externalWindow = window.open(url, "", windowOptions);
    externalWindow.document.body.appendChild(containerEl);
    const privatePortal = {
      element: portalElement,
      appendTo: containerEl,
      handler: externalWindow,
    };
    setPortals((oldPortals) => [...oldPortals, privatePortal]);

    // console.log(privatePortal);
    // console.log(externalWindow);
    // return externalWindow;
    return {
      portalMap: new Map(),
    };
  };
  console.log(portals);
  return (
    <PortalContext.Provider value={{ open }}>
      {portals.map(({ element, appendTo }, index) => (
        <React.Fragment key={index}>
          {ReactDOM.createPortal(element, appendTo)}
        </React.Fragment>
      ))}
      {children}
    </PortalContext.Provider>
  );
};

export const usePortals = () => {
  const context = useContext(PortalContext);
  if (!context) throw new Error("There is no PortalProvider");
  return context;
};

const WindowPopup = () => {
  let currentKey = "generator";

  const useWindowPopup = (element, opts) => {
    const windowOptions = "width=400px, height=600px";
    const windowOpener = usePortals();
    const { portalMap } = usePortals();

    const openWindow = () => {
      const closeHandler = windowOpener.open(element, "", windowOptions);
      // portalMap.set(currentKey, '123');
      console.log("set", currentKey, closeHandler);
    };

    //   portalMap.set(currentKey, '11');
    return openWindow;
  };

  // const portalList = () => {
  //     const { portalMap } = usePortals();
  //   console.log(portalMap);
  //   return portalMap.values();
  // };

  return {
    useWindowPopup,
    //   portalList,
  };
};

const windowPopup = WindowPopup();

export { windowPopup as WindowPopup };
