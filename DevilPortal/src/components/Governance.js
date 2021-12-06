import React, {Component, useRef, ReactDOM, useState, useEffect} from 'react';
import Web3 from "web3";
import Timer from './Timer';
import DevilLockAbi from "../remix_abis/DevilLock.json";
import TetherAbi from "../remix_abis/Tether.json";
import DevilTokenAbi from "../remix_abis/DevilToken.json";
import { provider, walletconnect } from '../connectors/index';

const Governance = (props) => {

    //timer variables
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [formattedTime, setFormattedTime] = React.useState()
    const [hoursMinSecs, setHoursMinSecs] = React.useState({hours:hours, minutes:minutes, seconds:seconds})
    

    const [networkId, setNetworkId] = React.useState(undefined);
    const [devilToken, setDevilToken] = React.useState([undefined]);
    const [devilTokenAddress, setDevilTokenAddress] = React.useState("");
    const [rwd, setRwd] = React.useState(undefined);
    const [rwdAddress, setRwdAddress] = React.useState("")
    const [devilVault, setDevilVault] = React.useState([undefined]);
    const [devilVaultAddress, setDevilVaultAddress] = React.useState("");
    const [devilTokenBalance, setDevilTokenBalance] = React.useState("0");
    const [updateState, setUpdateState] = React.useState(false);
    const [web3Enabled, setWeb3Enabled] = React.useState(false);

    //Devil Lock loading
    const [devilLock, setDevilLock] = React.useState([undefined]);
    const [devilLockAddress, setDevilLockAddress] = React.useState("");
    const [votingActive, setVotingActive] = React.useState(false);
    const [totalSupportVotes, setTotalSupportVotes] = React.useState(0);
    const [totalOpposeVotes, setTotalOpposeVotes] = React.useState(0);
    const [userSupportVotes, setUserSupportVotes] = React.useState(0);
    const [userOpposeVotes, setUserOpposeVotes] = React.useState(0);
    const [votingDeadline, setVotingDeadline] = React.useState(0);
    const [votingStartTime, setVotingStartTime] = React.useState(0);
    const [timeNow, setTimeNow] = React.useState();
    const [timeLeft, setTimeLeft] = React.useState();
    const [minutesLeft, setMinutesLeft] = React.useState();
    const [devilLockStatus, setDevilLockStatus] = React.useState(true);

    const inputRef = useRef()
    let account = props.account
  
   // window.web3 = new Web3(window.web3.currentProvider);
   useEffect(() => {
    if (account !== undefined){
        setWeb3Enabled(true);
      window.web3 = new Web3(window.web3 ? window.web3.currentProvider : walletconnect.walletConnectProvider);
    }
    else setWeb3Enabled(false);;
  }, [account]);
  
    useEffect(() => {
      
      const init = async () => {
  
        const web3 = window.web3;
        if (web3Enabled) {
            const networkId = await web3.eth.net.getId();
            setNetworkId(networkId);
    
            try{
            //LOAD Devil lock
            const devilLockAddress = "0xd39217757AfAFd226AeDCA1Bd20F34A97ECbeb50";
            setDevilLockAddress(devilLockAddress);
            const devilLock = new web3.eth.Contract(
            DevilLockAbi,
            devilLockAddress
            );
            setDevilLock(devilLock);
            } catch (error) {
            alert(
                'Failed to load Devil Lock.',
                    );
            }

            //LOAD devilToken
            const devilTokenAddress = "0xD280e0Fea29BcAe6ED9DD9fb4B9e5Fa90F5C249D";
            setDevilTokenAddress(devilTokenAddress);
            const devilToken = new web3.eth.Contract(
            DevilTokenAbi,
            devilTokenAddress
            );
            setDevilToken(devilToken);
            console.log(devilToken);
    
        //Load our staking state and other account data
          
            let votingActive = await devilLock.methods.getVotingActive().call()
            setVotingActive(votingActive)

            let totalSupportVotes = await devilLock.methods.getTotalYesVotes().call()
            setTotalSupportVotes(totalSupportVotes)

            let totalOpposeVotes = await devilLock.methods.getTotalNoVotes().call()
            setTotalOpposeVotes(totalOpposeVotes)

            let userSupportVotes = await devilLock.methods.getUserYesVotes(account).call()
            setUserSupportVotes(userSupportVotes)

            let userOpposeVotes = await devilLock.methods.getUserNoVotes(account).call()
            setUserOpposeVotes(userOpposeVotes);

            let devilTokenBalance = await devilToken.methods.balanceOf(account).call()
            setDevilTokenBalance(devilTokenBalance.toString())

            let votingDeadline = await devilLock.methods.votingDeadline().call()
            setVotingDeadline(votingDeadline);

            let votingStartTime = await devilLock.methods.votingStartTime().call()
            setVotingStartTime(votingStartTime);

            let devilLockStatus = await devilLock.methods.devilLockStatus().call()
            setDevilLockStatus(devilLockStatus);

            let timeNow = Math.floor(Date.now() / 1000)
            setTimeNow(timeNow);

            //event subscriptions that call update function to sync state variables w/ block chain

            devilLock.events.UserVotedSupport({fromBlock: 0})
                .on('data', event => update()
            );

            devilLock.events.UserVotedOppose({fromBlock: 0})
                .on('data', event => update()
            );

            devilLock.events.DevilContractLocked({fromBlock: 0})
                .on('data', event => update()
            );

            devilLock.events.VotingElectionStatus({fromBlock: 0})
                .on('data', event => update()
            );

            //Timer code 
            const timeLeft = votingDeadline - timeNow
            setTimeLeft(timeLeft)

            const minutesLeft = Math.floor(timeLeft / 60)
            setMinutesLeft(minutesLeft) 
            
            const updateState = false
            setUpdateState(updateState)
          } 
      }
      init();
    }, [web3Enabled]);
    
    async function update() {
    
        const init = async () => {
    
            let votingActive = await devilLock.methods.getVotingActive().call()
            setVotingActive(votingActive);

            let totalSupportVotes = await devilLock.methods.getTotalYesVotes().call()
            setTotalSupportVotes(totalSupportVotes);

            let totalOpposeVotes = await devilLock.methods.getTotalNoVotes().call()
            setTotalOpposeVotes(totalOpposeVotes);

            let userSupportVotes = await devilLock.methods.getUserYesVotes(account).call()
            setUserSupportVotes(userSupportVotes);

            let userOpposeVotes = await devilLock.methods.getUserNoVotes(account).call()
            setUserOpposeVotes(userOpposeVotes);

            let devilTokenBalance = await devilToken.methods.balanceOf(account).call()
            setDevilTokenBalance(devilTokenBalance.toString());

            let votingDeadline = await devilLock.methods.votingDeadline().call()
            setVotingDeadline(votingDeadline);

            let votingStartTime = await devilLock.methods.votingStartTime().call()
            setVotingStartTime(votingStartTime);

            let devilLockStatus = await devilLock.methods.devilLockStatus().call()
            setDevilLockStatus(devilLockStatus);

            let timeNow = Math.floor(Date.now() / 1000)
            setTimeNow(timeNow);
    
        }
        init();
      }
  
    const voteSupport = async (amount) => {
      setUpdateState(true)
      devilLock.methods.voteSupport(amount).send({from: account}).on('transactionHash', (hash) => {
      })
  }

    return (
                    <div> 
                        <div class="row row-30 justify-content-center">
                            <div class="col-3">
                            </div>
                            <div class="col-6 justify-content-center">
                                <div class="h3" style={{ textAlign: 'center' }}>
                                    DEVIL LOCK
                                </div>
                                <div class="p" style={{ textAlign: 'center' }}>
                                    The Devil contract is currently <b>unlocked</b>. There is {votingActive ? 'an' : 'no'} active election.
                                </div>
                                <div class="p" style={{ textAlign: 'center' }}>
                                    There are <b>{minutesLeft > 1 ? minutesLeft : '0'} </b> minutes remaining.
                                </div>
                               
                            </div>
                            <div class="col-3">
                            </div>
                        </div>
                        <div class="row row-40 justify-content-center">
                                {/* <div class="offset-xl"> */}
                                <div class="col-4">
                                </div>
                                {/* <!-- Countdown--> */}                                 
                                    <div class="col-4 justify-content-center">
                                    
                                        {/* <Timer 
                                        hoursMinSecs={hoursMinSecs}
                                        hours={hours}
                                        minutes={minutes}
                                        seconds={seconds}
                                        votingDeadline={votingDeadline}
                                        /> */}
                                    {/* <p>{hours}</p>
                                    <p>{minutes}</p>
                                    <p>{seconds}</p>
                                    <p>Deadline: {votingDeadline}</p>
                                    <p>Vote start: {votingStartTime}</p>
                                    <p>Difference: </p>
                                    <p>Formatted: {formattedTime}</p>
                                    <p>Time Left: {timeLeft} </p> */}
                                        
                                    </div>
                                <div class="col-4">
                                </div>
                        </div>         
                        <div class="row row-30 justify-content-center">
                        </div>
                        <div class="row row-30 justify-content-center">
                            <div class="col-4">
                                <div class="h3">
                                    TOTAL SUPPORT  
                                </div>
                                    <p> {totalSupportVotes} </p>
                            </div>
                            <div class="col-4 justify-content-center">
                                {devilLockStatus === false ? <img class="mt-xxl-4" src="assets/media/devl_locked_4.png" alt="" width="674" height="572"/> : <img class="mt-xxl-4" src="assets/media/devl_locked_3.png" alt="" width="674" height="572"/> }
                            </div>
                                <div class="col-4">
                                    <div class="h3" style={{ textAlign: 'right' }}>
                                       TOTAL OPPOSE   
                                    </div>
                                    <p style={{ textAlign: 'right' }}>{totalOpposeVotes}</p>
                                </div>
                        </div>
                        <div class="row row-30 justify-content-center">
                            <div class="col-4">
                                <div class="h3">
                                    USER SUPPORT   
                                </div>
                                <p> {userSupportVotes} </p>      
                            </div>
                            <div class="col-4">
                                      
                            </div>
                            <div class="col-4">
                                    <div class="h3" style={{ textAlign: 'right' }}>
                                        USER OPPOSE    
                                    </div>
                                         <p style={{ textAlign: 'right' }}>{userOpposeVotes}</p>
                            </div>
                        </div>
                        <div class="row row-30 justify-content-center">
                            <div class="col-4 justify-content-center">
                                <form class="block block-sm justify-content-center" data-np-checked="1">
                                    <p>Balance: {web3Enabled ? window.web3.utils.fromWei(devilTokenBalance, 'Ether') : 0} </p>
                                    {/* <AmountForm /> */}
                                    {/* <input type="number" ref={inputRef} className="form-control"/> */}
                                        
                                        <button 
                                            type='submit'
                                            onClick={(event) => {
                                            event.preventDefault()
                                            let amount
                                            amount = 0
                                            voteSupport(amount)
                                            }}
                                            className='btn btn-primary btn-lg btn-block'>Support
                                        </button>
                                        <button 
                                            type='submit'
                                            onClick={(event) => {
                                            event.preventDefault()
                                            let amount
                                            amount = inputRef.current.value.toString()
                                            amount = window.web3.utils.toWei(amount, 'Ether')
                                            props.unstakeTokensVault(amount)
                                            }}
                                            className='btn btn-primary btn-lg btn-block'>Oppose
                                        </button> 
                                        {/* <button 
                                            type='submit'
                                            onClick={(event) => {
                                            event.preventDefault()
                                            }}
                                            className='btn btn-primary btn-lg btn-block'>Update
                                        </button> */}
                                </form>
                            </div>
                                
                        </div>
                    </div>    
        );
    }
          
    export default (Governance);
   
