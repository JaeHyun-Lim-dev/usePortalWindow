import React, { useState, useCallback } from "react";
import SomePage from "./SomePage";
import { makeObservable, observable, action } from "mobx";
import { useObserver } from "mobx-react-lite";
import { usePortalWindow, useWindowInfo } from "./PortalHook";
import styled from 'styled-components';

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
  const popupUrl = "";
  const popupTitle = "newPopupWindow";
  const windowOptions = "width=400, height=600";
  const openMyWindow = usePortalWindow({
    element: <SomePage count={store.value} />,
    opts: windowOptions}
  );  
  const myHandler = useWindowInfo();
  const handleClick = useCallback(() => {
    openMyWindow();
  }, []);
  const handleListClick = useCallback(() => {
    
  }, []);

  return useObserver(() => (
    <>
      {store.value}
      <Button onClick={() => store.increment()}>count+1</Button>
      <button onClick={openMyWindow}>??</button>
    </>
  ));
};

const Button = styled.button`
  background-color: white;
`
export default MainPage;
