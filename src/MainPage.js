import React, { useState, useCallback } from "react";
import SomePage from "./SomePage";
import { usePortals } from "./PortalHook";
import { makeObservable, observable, action } from "mobx";
import { useObserver } from "mobx-react-lite";
import { WindowPopup } from "./PortalHook";

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
  const [handler, setHandler] = useState();
  const openMyWindow = WindowPopup.useWindowPopup(<SomePage count={count} />);

  const handleToggle = useCallback(() => setIsOpen(!isOpen));
  const closePortalWindow = useCallback((e) => {
    e.close();
  });
  const windowOptions = "width=400px, height=600px";
  const windowOpener = usePortals();
  const handleClick = useCallback(() => {
    // setHandler(windowOpener.open(<SomePage count={count} />, "", windowOptions));
    setHandler(openMyWindow());
    // windowOpener.open(<SomePage count={count} />, "", windowOptions);
  }, [count]);

  const handleListClick = useCallback(() => {
    // console.log(WindowPopup.portalList());
  }, []);

  const handleClose = () => {
    handler.close();
  };
  return useObserver(() => (
    <>
      {store.value}
      <button onClick={() => store.increment()}>count+1</button>
      <button onClick={handleClick}>??</button>
      <button onClick={handleListClick}>!!</button>
      <button onClick={handleClose}>close last window</button>
      {/* {ReactDOM.createPortal(<SomePage count={count}/>, document.getElementById("root"))} */}
      {/* <NewWindow>
        <SomePage count={count} />
      </NewWindow> */}
    </>
  ));
};

export default MainPage;
