import React, { Component, useEffect, useState, setState } from "react";
import Navbar from "./Navbar";
import "./App.css";
import Vault from "./Vault.js";
import Gateway from "./Gateway"
import { useWeb3React } from "@web3-react/core";
import useAuth from "../hooks/useAuth";
import { useWalletModal } from "@pancakeswap-libs/uikit";
import Governance from "./Governance";
import { Web3Provider } from "@ethersproject/providers";
import Web3 from "web3";

//Web3Modal
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

function App() {

  const { login, logout } = useAuth();
  const { active, account, library, connector, activate, deactivate, web3} = useWeb3React();
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(
    login,
    logout,
    account || undefined
  );
  console.log(account);

  return (
    <>
      <div>
        <Navbar
          account={account}
          onPresentConnectModal={onPresentConnectModal}
          onPresentAccountModal={onPresentAccountModal}
        />
        <main role="main" className="col-lg-12 ml-auto mr-auto">
          <div class="page">
            <section class="section-lg section-one-screen">
              <div class="container">
                <div class="tab tab-line">
                  <ul class="nav nav-line biggest">
                    <li class="nav-item" role="presentation">
                      <a class="nav-link active show" href="#tabs-1-1" data-toggle="tab">
                        Gateway
                      </a>
                    </li>
                    <li class="nav-item" role="presentation">
                      <a class="nav-link" href="#tabs-1-2" data-toggle="tab">
                        Vault
                      </a>
                    </li>
                    <li class="nav-item" role="presentation">
                      <a class="nav-link" href="#tabs-1-3" data-toggle="tab">
                        Lock
                      </a>
                    </li>
                    <li class="nav-item" role="presentation">
                      <a class="nav-link" href="#tabs-1-4" data-toggle="tab">
                        Information
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="tab-content">
                  <div class="tab-pane fade active show" id="tabs-1-1">
                    <div class="box px-sm-4 px-xl-4 px-xxl-4">
                      <div className="content">
                      <div class="row row-30 justify-content-center">
                        {/* <p><p2>{account}</p2></p> */}
                        <p></p>
                      </div>
                        <Gateway
                          account={account}
                          web3={web3}
                        />  
                      </div>
                      {/* <!-- Tab panes--> */}
                    </div>
                  </div>
                  <div class="tab-pane fade" id="tabs-1-2">
                    <div class="box px-xl-4 px-xxl-4">
                    <div className="content">
                      <Vault
                          account={account}
                          web3={web3}
                        />
                    </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="tabs-1-3">
                    <div class="box px-xl-4 px-xxl-4">
                    <div className="content">
                      {/* <Governance 
                          account={account}
                          web3={web3}
                        /> */}
                    </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="tabs-1-4">
                    <div class="box px-xl-4 px-xxl-4">
                      <div class="row row-30 justify-content-center">
                        <div class="col-10 justify-content-center">
                          <div class="h3" style={{ textAlign: 'center' }}>
                              DEVIL'S VAULT   
                          </div>
                          <p style={{ textAlign: 'center' }}>
                             <b>Version 1</b>
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             Deposit your DEVL in order to earn your share of the 3% tax in the form of BUSD.
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             Global Staked refers to the total DEVL currently staked, while User Staked refers to your personal staking balance.
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             Lifetime Rewards tracks the total amount of BUSD awarded to all holders since the beginning.
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             Pending Rewards indicates the amount of BUSD you can claim.
                          </p>
                        </div>
                      </div>
                      <div class="row row-30 justify-content-center">
                        <div class="col-10 justify-content-center">
                          <div class="h3" style={{ textAlign: 'center' }}>
                              DEVIL LOCK  
                          </div>
                          <p style={{ textAlign: 'center' }}>
                             <b>Version 1</b>
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             Allows users to vote on when the contract can be unlocked, allowing the DEVL team to make changes to the token.
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             The information at the top inform you if the contract is locked or unlocked, when locked, the token's functions cannot be called by the DEVL team until a successful vote.
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             Total Support and Total Oppose track the total votes in favor or in opposition to the DEVL team's request to unlock the contract.
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             User Support and User Oppose track your votes.
                          </p>
                        </div>
                      </div>
                      <div class="row row-30 justify-content-center">
                        <div class="col-10 justify-content-center">
                          <div class="h3" style={{ textAlign: 'center' }}>
                              DEVIL GATEWAY 
                          </div>
                          <p style={{ textAlign: 'center' }}>
                             <b>Version 1</b>
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             To buy DEVL - enter the amount of BNB you wish to use.
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             To sell DEVL - enter the amount of DEVL you wish to sell.
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             To onramp fiat for BSC BNB (BEP-20), click "Buy Crypto"
                          </p>
                          <p style={{ textAlign: 'center' }}>
                             Note: Price information coming after launch when connection available.
                          </p>
                        </div>
                      </div>
                    </div>
                    </div>
                  
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

// }
export { App };
