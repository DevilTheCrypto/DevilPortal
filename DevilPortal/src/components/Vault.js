import React, { Component, useEffect, useState, setState, useRef } from "react";
import Web3 from "web3";
import "./App.css";
import DevilVaultAbi from "../remix_abis/DevilVault.json";
import TetherAbi from "../remix_abis/Tether.json";
import RwdAbi from "../remix_abis/RWD.json";
import DevilTokenAbi from "../remix_abis/DevilToken.json";
import { getNetworkLibrary } from "../connectors/index";

const Vault = (props) => {

  const [networkId, setNetworkId] = React.useState(undefined);
  const [devilToken, setDevilToken] = React.useState([undefined]);
  const [devilTokenAddress, setDevilTokenAddress] = React.useState("");
  const [rwd, setRwd] = React.useState(undefined);
  const [rwdAddress, setRwdAddress] = React.useState("");
  const [rewardTokenAddress, setRewardTokenAddress] = React.useState("");
  const [devilVault, setDevilVault] = React.useState([undefined]);
  const [devilVaultAddress, setDevilVaultAddress] = React.useState("");
  const [devilTokenBalance, setDevilTokenBalance] = React.useState("0");
  const [rwdTokenBalance, setRwdTokenBalance] = React.useState("0");
  const [stakingBalance, setStakingBalance] = React.useState("0");
  const [amountStaked, setAmountStaked] = React.useState("0");
  const [lifetimeRewardsGiven, setLifetimeRewardsGiven] = React.useState("0");
  const [globalStakingBalance, setGlobalStakingBalance] = React.useState("0");
  const [pendingUserRewards, setPendingUserRewards] = React.useState("0");
  const [symbol, setSymbol] = React.useState([undefined]);
  const [rangeval, setRangeval] = useState(null);
  const [updateState, setUpdateState] = React.useState(false);
  const inputRef = useRef();

  let account = props.account;
  let web3Enabled = props.web3Enabled;
  
  useEffect(() => {
    window.web3 = new Web3(getNetworkLibrary());
    console.log("web3 connected");
  }, [account]);

  useEffect(() => {
    
    const init = async () => {

      const web3 = window.web3;
      if (web3.eth !== undefined)
      {
        console.log("creating contract objects");
        web3Enabled = true;
        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);

        try{

        //LOAD Chad Vault
        const devilVaultAddress = "0xe12f2f9Bf3939BCe8F41CAd1247924a0B2dda942";
        setDevilVaultAddress(devilVaultAddress);
        const devilVault = new web3.eth.Contract(
          DevilVaultAbi,
          devilVaultAddress
        );
        setDevilVault(devilVault);
        console.log(devilVault);
        } catch (error) {
          alert(
            'Failed to load devil vault.',
                );
        }

        //LOAD devilToken
        const devilTokenAddress = "0x65aEd7F90a0cF876D496d8093D3F89748ba66b57";
        setDevilTokenAddress(devilTokenAddress);
        const devilToken = new web3.eth.Contract(
          DevilTokenAbi,
          devilTokenAddress
        );
        setDevilToken(devilToken);
        console.log(devilToken);

        //LOAD RWD
        const rwdAddress = "0x19027aEf0fDB5C30b3dC4E863fccFC6F05aCf184";
        setRwdAddress(rwdAddress);
        const rwd = new web3.eth.Contract(
          RwdAbi,
          rwdAddress
        );
        setRwd(rwd);
        console.log(rwd);
      }
      

        //Load our staking state and other account data

        if (account !== undefined){
          let devilTokenBalance = await devilToken.methods.balanceOf(account).call();
          setDevilTokenBalance(devilTokenBalance.toString());
          
          const amountStaked = await devilVault.methods.amountStaked(account).call();
          setAmountStaked(amountStaked.toString());

          let globalStakingBalance = await devilVault.methods.globalStakingTokenBalance().call();
          setGlobalStakingBalance(globalStakingBalance.toString());

          let lifetimeRewardsGiven = await devilVault.methods.lifetimeRewardsGiven().call();
          setLifetimeRewardsGiven(lifetimeRewardsGiven.toString());

          let pendingUserRewards = await devilVault.methods.rewardsPending(account).call();
          setPendingUserRewards(pendingUserRewards.toString());

          let symbol = await rwd.methods.symbol().call();
          setSymbol(symbol);

          //event subscriptions that call update function to sync state variables w/ block chain

          devilVault.events.Staked({fromBlock: 0})
            .on('data', event => update()
            );

          devilVault.events.Withdrawn({fromBlock: 0})
            .on('data', event => update()
            );

          devilVault.events.RewardClaimed({fromBlock: 0})
            .on('data', event => update()
            );
          
          devilVault.events.RewardDistributed({fromBlock: 0})
            .on('data', event => update()
            );

          const updateState = false
          setUpdateState(updateState)
        } 
        
    }
    init();
  }, [account, amountStaked, setAmountStaked]);
    
  async function update() {
    
    const init = async () => {

      let devilTokenBalance = await devilToken.methods.balanceOf(account).call();
      setDevilTokenBalance(devilTokenBalance.toString());
      
      let amountStaked = await devilVault.methods.amountStaked(account).call();
      setAmountStaked(amountStaked.toString());

      let globalStakingBalance = await devilVault.methods.globalStakingTokenBalance().call();
      setGlobalStakingBalance(globalStakingBalance.toString());

      let lifetimeRewardsGiven = await devilVault.methods.lifetimeRewardsGiven().call();
      setLifetimeRewardsGiven(lifetimeRewardsGiven.toString());

      let pendingUserRewards = await devilVault.methods.rewardsPending(account).call();
      setPendingUserRewards(pendingUserRewards.toString());

    }
    init();
  }

  const stakeTokensVault = async (amount) => {
    setUpdateState(true)
    devilToken.methods.transfer(devilVault._address, amount).send({from: account}).on('transactionHash', (hash) => { 
    devilVault.methods.stake(amount).send({from: account}).on('transactionHash', (hash) => { 
      })
    })
}

  const unstakeTokensVault = (amount) => {
  setUpdateState(true)
  devilVault.methods.withdraw(amount).send({from: account}).on('transactionHash', (hash) => {
  })
}

  const claimRewards = () => {
  setUpdateState(true)
  devilVault.methods.claim().send({from: account}).on('transactionHash', (hash) => {
  })
}
    
        return (
            <div> 
                <div class="row row-30 justify-content-left">
                    <div class="col-4">
                        <div>
                            Status: <b>{updateState ? 'loading' : 'complete'}</b>
                            <p>DO NOT STAKE VAULT IS PAUSED FOR WITHDRAWL DUE TO EXPLOIT. TEAM IS FIXING IT. </p>
                        </div>
                    </div>
                  </div>
                <div class="row row-30 justify-content-center">
                    <div class="col-4">
                        <div class="h3">
                            TOTAL STAKED   
                        </div>
                            <p> {web3Enabled ? parseFloat(window.web3.utils.fromWei(globalStakingBalance, 'Ether')).toFixed(5) : 0} DEVL </p>
                    </div>
                    <div class="col-4 justify-content-center">
                        <img class="mt-xxl-4" src="assets/media/DEVIL_logo_red_centered.png" alt="" width="674" height="572"/>
                    </div>
                        <div class="col-4">
                            <div class="h3" style={{ textAlign: 'right' }}>
                              TOTAL REWARDS   
                            </div>
                                <p style={{ textAlign: 'right' }}>{web3Enabled ? parseFloat(window.web3.utils.fromWei(lifetimeRewardsGiven, 'Ether')).toFixed(5) : 0} BUSD </p>
                        </div>
                </div>
                <div class="row row-30 justify-content-center">
                    <div class="col-4">
                        <div class="h3">
                            USER 
                            STAKED   
                        </div>
                            <p> {web3Enabled ? parseFloat(window.web3.utils.fromWei(amountStaked, 'Ether')).toFixed(5) : 0} DEVL </p>
                    </div>
                    <div class="col-4 justify-content-center">
                        <form class="block block-sm" data-np-checked="1">
                            <p>Balance: {web3Enabled ? parseFloat(window.web3.utils.fromWei(devilTokenBalance, 'Ether')).toFixed(5) : 0}</p>
                            <input type="number" ref={inputRef} className="form-control" />
                                
                                <button 
                                    type='submit'
                                    onClick={(event) => {
                                    event.preventDefault()
                                    let amount
                                    amount = inputRef.current.value.toString() 
                                    amount = window.web3.utils.toWei(amount, 'Ether')
                                    // stakeTokensVault(amount)
                                    }}
                                    className='btn btn-primary btn-lg btn-block'>DEPOSIT
                                </button>
                                
                            
                                <button 
                                    type='submit'
                                    onClick={(event) => {
                                    event.preventDefault()
                                    let amount
                                    amount = inputRef.current.value.toString()
                                    amount = window.web3.utils.toWei(amount, 'Ether')
                                    unstakeTokensVault(amount)
                                    }}
                                    className='btn btn-primary btn-lg btn-block'>WITHDRAW
                                </button> 

                                <button 
                                    type='submit'
                                    onClick={(event) => {
                                    event.preventDefault()
                                    claimRewards()
                                    }}
                                    className='btn btn-primary btn-lg btn-block'>CLAIM
                                </button>                              
                        </form>
                    </div>
                        <div class="col-4">
                            <div class="h3" style={{ textAlign: 'right' }}>
                                USER REWARDS   
                            </div>
                                <p style={{ textAlign: 'right' }}> {web3Enabled ? parseFloat(window.web3.utils.fromWei(pendingUserRewards, 'Ether')).toFixed(5) : 0} BUSD </p>
                        </div>
                </div>
                {/* <div class="row row-30 justify-content-left">
                <p>Address: {props.account && props.account}</p>
                </div> */}
             
                                                                  
                      {/* <!-- Modal: JUST A CODE SAVE FOR TEMPLATE NOT ACTIVE--> */}
                      {/* <div class="modal fade" id="modal-login" tabindex="-1" role="dialog">
                          <div class="modal-dialog" role="document">
                              <div class="modal-content">
                                  <div class="modal-body text-center">
                                      <h3>Log In</h3>
                                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                                      <form class="rd-mailform">
                                      <div class="form-group">
                                          <input class="form-control" type="text" name="name" placeholder="Your name *" data-constraints="@Required" />
                                      </div>
                                      <div class="form-group">
                                          <input class="form-control" type="password" name="password" placeholder="Password *" data-constraints="@Required" />
                                      </div>
                                      <div class="offset-xxs group-40 d-flex flex-wrap flex-xs-nowrap align-items-center">
                                          <button class="btn btn-block" type="submit">Log in</button>
                                      </div>
                                      </form>
                                  </div>
                              <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                              </div>
                          </div>
                      </div> */}
                       {/* <!-- Preloader--> */}
                      <div class="preloader">
                          <div class="preloader-inner">
                              <div class="preloader-dot"></div>
                              <div class="preloader-dot"></div>
                              <div class="preloader-dot"></div>
                              <div class="preloader-dot"></div>
                          </div>
                      </div>
            </div>    
          );
        }
    
export default (Vault);