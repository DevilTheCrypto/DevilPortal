import React, { Component, useEffect, useState, setState, useRef } from "react";
import Web3 from "web3";
import "./App.css";
import DevilVaultAbi from "../remix_abis/DevilVault.json";
import TetherAbi from "../remix_abis/Tether.json";
import RwdAbi from "../remix_abis/RWD.json";
import DevilTokenAbi from "../remix_abis/DevilToken.json";

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
  const [pendingUserRewardsBusd, setPendingUserRewardsBusd] = React.useState("0");
  const [pendingUserRewardsDevl, setPendingUserRewardsDevl] = React.useState("0");
  const [symbol, setSymbol] = React.useState([undefined]);
  const [rangeval, setRangeval] = useState(null);
  const [updateState, setUpdateState] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(0);
  const inputRef = useRef();

  let account = props.account

  useEffect(() => {

    
    const init = async () => {

      window.web3 = await new Web3(window.ethereum);
        const web3 = await window.web3;
        if(account !== undefined) {
            const networkId = await web3.eth.net.getId();
            setNetworkId(networkId);
        }

      try{

      //LOAD Devil Vault
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

        //Load our staking state and other account data

        if (account !== undefined){
          let devilTokenBalance = await devilToken.methods.balanceOf(account).call();
          setDevilTokenBalance(devilTokenBalance.toString());
          
          const amountStaked = await devilVault.methods.getUserStaked(account).call();
          setAmountStaked(amountStaked.toString());

          let globalStakingBalance = await devilVault.methods.getTotalStaked().call();
          setGlobalStakingBalance(globalStakingBalance.toString());

          // let lifetimeRewardsGiven = await devilVault.methods.getLifetimeRewards(account).call();
          // setLifetimeRewardsGiven(lifetimeRewardsGiven.toString());

          let pendingUserRewardsBusd = await devilVault.methods.earnedBusd(account).call();
          setPendingUserRewardsBusd(pendingUserRewardsBusd.toString());

          let pendingUserRewardsDevl = await devilVault.methods.earnedDevl(account).call();
          setPendingUserRewardsDevl(pendingUserRewardsDevl.toString());

          let symbol = await rwd.methods.symbol().call();
          setSymbol(symbol);

          //event subscriptions that call update function to sync state variables w/ block chain

          devilVault.events.Staked({fromBlock: 0})
            .on('data', event => update()
            );

          devilVault.events.Withdrawn({fromBlock: 0})
            .on('data', event => update()
            );

          devilVault.events.RewardPaidBusd({fromBlock: 0})
            .on('data', event => update()
            );

            devilVault.events.RewardPaidDevl({fromBlock: 0})
            .on('data', event => update()
            );
          
          devilVault.events.RewardAddedBusd({fromBlock: 0})
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
          
      const amountStaked = await devilVault.methods.getUserStaked(account).call();
      setAmountStaked(amountStaked.toString());

      let globalStakingBalance = await devilVault.methods.getTotalStaked().call();
      setGlobalStakingBalance(globalStakingBalance.toString());

      // let lifetimeRewardsGiven = await devilVault.methods.getLifetimeRewards(account).call();
      // setLifetimeRewardsGiven(lifetimeRewardsGiven.toString());

      let pendingUserRewardsBusd = await devilVault.methods.earnedBusd(account).call();
      setPendingUserRewardsBusd(pendingUserRewardsBusd.toString());

      let pendingUserRewardsDevl = await devilVault.methods.earnedDevl(account).call();
          setPendingUserRewardsDevl(pendingUserRewardsDevl.toString());

    }
    init();
  }

  const stakeTokensVault = async (amount) => {
    setUpdateState(true)
    amount = window.web3.utils.toWei(amount, 'Ether')
    devilToken.methods.approve(devilVault._address, amount).send({from: account}).on('transactionHash', (hash) => { 
    devilVault.methods.stake(amount).send({from: account}).on('transactionHash', (hash) => { 
      })
    })
}

  const unstakeTokensVault = (amount) => {
  setUpdateState(true)
  amount = window.web3.utils.toWei(amount, 'Ether')
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
                        </div>
                    </div>
                  </div>
                <div class="row row-30 justify-content-center">
                    <div class="col-4">
                        <div class="h3">
                            TOTAL STAKED   
                        </div>
                            <p> {parseFloat(window.web3.utils.fromWei(globalStakingBalance, 'Ether')).toFixed(5)} DEVL </p>
                    </div>
                    <div class="col-4 justify-content-center">
                        <img class="mt-xxl-4" src="assets/media/DEVIL_logo_red_centered.png" alt="" width="674" height="572"/>
                    </div>
                        <div class="col-4">
                            <div class="h3" style={{ textAlign: 'right' }}>
                              DEVL REWARDS   
                            </div>
                                <p style={{ textAlign: 'right' }}>{parseFloat(window.web3.utils.fromWei(pendingUserRewardsDevl, 'Ether')).toFixed(5)} DEVL </p>
                        </div>
                </div>
                <div class="row row-30 justify-content-center">
                    <div class="col-4">
                        <div class="h3">
                            USER 
                            STAKED   
                        </div>
                            <p> {parseFloat(window.web3.utils.fromWei(amountStaked, 'Ether')).toFixed(5)} DEVL </p>
                    </div>
                    <div class="col-4 justify-content-center">
                        <form class="block block-sm" data-np-checked="1">
                                <p>Balance: {parseFloat(window.web3.utils.fromWei(devilTokenBalance, 'Ether')).toFixed(5)}</p>  
                            {/* <input type="number" ref={inputRef} className="form-control"/> */}
                            <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="form-control"/> 
                                
                                <button 
                                  class="link"
                                  onClick={(event) => {
                                  event.preventDefault()
                                  let amount
                                  amount = devilTokenBalance.toString() 
                                  amount = window.web3.utils.fromWei(amount, 'Ether')
                                  setInputValue(amount)
                                  }}
                                  >Max
                                </button>
                                
                                <button 
                                    type='submit'
                                    onClick={(event) => {
                                    event.preventDefault()
                                    let amount
                                    amount = inputValue
                                    stakeTokensVault(amount)
                                    }}
                                    className='btn btn-primary btn-lg btn-block'>DEPOSIT
                                </button>
                                
                                
                            
                                <button 
                                    type='submit'
                                    onClick={(event) => {
                                    event.preventDefault()
                                    let amount
                                    amount = inputValue
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
                                BUSD REWARDS   
                            </div>
                                <p style={{ textAlign: 'right' }}> {parseFloat(window.web3.utils.fromWei(pendingUserRewardsBusd, 'Ether')).toFixed(5)} BUSD </p>
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