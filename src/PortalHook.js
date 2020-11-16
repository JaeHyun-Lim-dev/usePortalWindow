import React, { useState, useContext, createContext } from "react";
import ReactDOM from "react-dom";
import nextId from "react-id-generator";

export const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  const [portals, setPortals] = useState([]);
  const popupInfo = new Map();

  const open = (portalElement, containerElement, windowHandler, portalId) => {
    const privatePortal = {
      element: portalElement,
      appendTo: containerElement,
      handler: windowHandler,
      portalId: portalId,
    };
    setPortals((oldPortals) => [...oldPortals, privatePortal]);
  };

  const getPopupInfo = () => {
    return popupInfo;
  };

  const setPopupInfo = (portalId, portalValue, isRemove = false) => {
    if (isRemove === "remove") {
      popupInfo.delete(portalId);
      return;
    }
    popupInfo.set(portalId, portalValue);
  };

  return (
    <PortalContext.Provider value={{ open, getPopupInfo, setPopupInfo }}>
      {children}
      {portals.map(({ element, appendTo, portalId }) => (
        <React.Fragment key={portalId}>
          {ReactDOM.createPortal(element, appendTo)}
        </React.Fragment>
      ))}
    </PortalContext.Provider>
  );
};

export const usePortals = () => {
  const context = useContext(PortalContext);
  if (!context) throw new Error("PortalProvider does not exists");
  return context;
};

const WindowPopup = () => {
  const usePortalWindow = (element, url, title, opts) => {
    /* 
        element: renter target
        url: blank
        title: popup window title
        opts: window.open()이 지원하는 모든 option을 사용 가능합니다.
        https://developer.mozilla.org/ko/docs/Web/API/Window/open
        Google Chrome에서 듀얼 모니터 사용 시 top/left 속성이 적용되지 않는 버그가 존재합니다.
      */
    const windowOpener = usePortals();

    const openWindow = () => {
      let currentKey = nextId();
      const containerEl = document.createElement("div");
      const externalWindow = window.open(url, "", opts);

      externalWindow.document.body.appendChild(containerEl);
      externalWindow.document.title = title;

      windowOpener.open(element, containerEl, externalWindow, currentKey);
      windowOpener.setPopupInfo(currentKey, {
        title: title,
        handler: externalWindow,
      });

      return windowOpener.getPopupInfo();
    };
    return openWindow;
  };

  const useWindowInfo = () => {
    const windowOpener = usePortals();

    const getPopupInfoList = (key, value, isRemove = false) => {
      if (isRemove === "remove") {
        windowOpener.setPopupInfo(key, value, isRemove);
        return null;
      }

      return windowOpener.getPopupInfo();
    };

    return getPopupInfoList;
  };

  return {
    usePortalWindow,
    useWindowInfo,
  };
};

const { usePortalWindow, useWindowInfo } = WindowPopup();
export { usePortalWindow, useWindowInfo };
// export { windowPopup as WindowPopup };
