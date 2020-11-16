import React, { useState, useCallback } from "react";
import SomePage from "./SomePage";
import { usePortals } from "./PortalHook";
import { makeObservable, observable, action } from "mobx";
import { useObserver } from "mobx-react-lite";
import { usePortalWindow, useWindowInfo } from "./PortalHook";

class Store {
  value = 0;

  constructor(value) {
    makeObservable(this, {
      value: observable,
      increment: action,
    });
  }

  increment() {
    this.value++;
  }
}

export const store = new Store();

const MainPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const popupUrl = "";
  const popupTitle = "newPopupWindow";
  const windowOptions = "width=400, height=600, center=true";
  const openMyWindow = usePortalWindow(
    <SomePage count={count} />,
    popupUrl,
    popupTitle,
    windowOptions
  );
  const myHandler = useWindowInfo();
  const handleClick = useCallback(() => {
    openMyWindow();
  }, [count]);
  const handleListClick = useCallback(() => {
    for (let [key, value] of myHandler()) {
      value.handler.close();
      myHandler(key, value, "remove");
    }
  }, []);

  return useObserver(() => (
    <>
      {store.value}
      <button onClick={() => store.increment()}>count+1</button>
      <button onClick={handleClick}>??</button>
      <button onClick={handleListClick}>collapse</button>
    </>
  ));
};

export default MainPage;
