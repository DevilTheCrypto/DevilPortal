import React, { Component } from "react";
import { injected } from "./connectors.js";
import getWeb3 from "./getWeb3";

function Navbar(props) {
  return (
    <header class="section rd-navbar-wrap">
      <nav class="rd-navbar">
        <div class="navbar-container">
          <div class="navbar-cell">
            <div class="navbar-panel">
              <button
                class="navbar-switch"
                data-multi-switch='{"targets":".rd-navbar","scope":".rd-navbar","isolate":"[data-multi-switch]"}'
              ></button>
              <div class="navbar-logo">
                <h3>DEVIL PORTAL</h3>
                </div>
              
              <p></p>
              {/* <p>Contract: {contract} </p> */}
              <p></p>
            </div>
          </div>
          <div class="navbar-spacer"></div>
          <div class="navbar-cell navbar-sidebar">
            <ul class="navbar-navigation rd-navbar-nav fullpage-navigation">
              <li
                class="navbar-navigation-root-item"
                data-menuanchor="ndex.html"
              >
                <a class="navbar-navigation-root-link" href="index.html">
                  Home
                </a>
              </li>
            </ul>
          </div>
          <div class="navbar-cell">
            <div class="navbar-subpanel">
              <div class="navbar-subpanel-item">
                <button
                  class="navbar-button navbar-info-button mdi-dots-vertical"
                  data-multi-switch='{"targets":".rd-navbar","scope":".rd-navbar","class":"navbar-info-active","isolate":"[data-multi-switch]"}'
                ></button>
                <div class="navbar-info">
                  {/* {this.state.account === undefined ?  */}
                  <button
                    class="btn btn-sm"
                    onClick={() => {
                      if (props.account === undefined) {
                        props.onPresentConnectModal();
                      } else {
                        props.onPresentAccountModal();
                      }
                    }}
                  >
                    {!props.account ? "Connect Wallet" : " "}{props.account}
                  </button>
                  {/* :    */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
