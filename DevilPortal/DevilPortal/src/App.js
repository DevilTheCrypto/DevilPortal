import { ModalProvider } from "@pancakeswap-libs/uikit";
import { ThemeProvider } from "styled-components";
import { light, dark } from "@pancakeswap-libs/uikit";
import { Web3ReactProvider } from "@web3-react/core";
import React from "react";
import { App as ComponentApp } from "./components/App";
import Web3 from "web3";
function getLibrary(provider, connector) {
  return new Web3(provider); // this will vary according to whether you use e.g. ethers or web3.js
}
const App = () => {
  const SCTheme = dark;
  // @ts-ignore
  SCTheme.zIndices.modal = 1001;
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={SCTheme}>
        <ModalProvider>
          <ComponentApp />
        </ModalProvider>
      </ThemeProvider>
    </Web3ReactProvider>
  );
};

export default App;
