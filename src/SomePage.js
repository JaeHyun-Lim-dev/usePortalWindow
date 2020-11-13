import React from "react";
import { store } from "./MainPage";
import { useObserver } from "mobx-react-lite";

const SomePage = () => {
  return useObserver(() => (
    <>
      <div>Some Page here</div>
      <div>using Portal</div>
      {store.value}
      {/* <button onClick={closePortalWindow}>only thing you can</button> */}
    </>
  ));
};

export default SomePage;
