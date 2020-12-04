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
  const usePortalWindow = ({
    element = null,
    url = "",
    title = "",
    opts = "",
  }) => {
    /* 
        element: render target
        url: 별도로 지정 시 teespace app을 새로 엽니다(스토어 공유 불가)
        title: popup window창의 title
        opts: window.open()이 지원하는 모든 option을 사용 가능합니다.
        https://developer.mozilla.org/ko/docs/Web/API/Window/open
        Google Chrome에서 듀얼 모니터 사용 시 top/left 속성이 적용되지 않는 버그가 존재합니다.
      */
    const windowOpener = usePortals();
    function copyStyles(sourceDoc, targetDoc) {
      Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
        if (styleSheet.href) {
          // for <link> elements loading CSS from a URL
          const newLinkEl = sourceDoc.createElement("link");

          newLinkEl.rel = "stylesheet";
          newLinkEl.href = styleSheet.href;
          targetDoc.head.appendChild(newLinkEl);
        } else if (styleSheet.cssRules && styleSheet.cssRules.length > 0) {
          // for <style> elements
          const newStyleEl = sourceDoc.createElement("style");

          Array.from(styleSheet.cssRules).forEach((cssRule) => {
            // write the text of each rule into the body of the style element
            newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
          });

          targetDoc.head.appendChild(newStyleEl);
        }
      });
    }
    const openWindow = () => {
      let currentKey = nextId();
      const containerEl = document.createElement("div");
      const externalWindow = window.open(url, "", opts);

      externalWindow.document.body.appendChild(containerEl);
      externalWindow.document.title = title;
      copyStyles(document, externalWindow.document);
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
