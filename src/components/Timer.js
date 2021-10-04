import React, { useState, useRef, useEffect } from 'react'
  

  
// const Timer = (props) => {
  
//     // We need ref in this, because we are dealing
//     // with JS setInterval to keep track of it and
//     // stop it when needed
//     const Ref = useRef(null);
  
//     // The state for our timer
//     const [timer, setTimer] = useState('00:00:00');
  
  
//     const getTimeRemaining = (e) => {
//         const total = Date.parse(e) - Date.parse(new Date());
//         const seconds = Math.floor((total / 1000) % 60);
//         const minutes = Math.floor((total / 1000 / 60) % 60);
//         const hours = Math.floor((total / 1000 * 60 * 60) % 24);
//         return {
//             total, hours, minutes, seconds
//         };
//     }
  
  
//     const startTimer = (e) => {
//         let { total, hours, minutes, seconds } 
//                     = getTimeRemaining(e);
//         if (total >= 0) {
  
//             // update the timer
//             // check if less than 10 then we need to 
//             // add '0' at the begining of the variable
//             setTimer(
//                 (hours > 9 ? hours : '0' + hours) + ':' +
//                 (minutes > 9 ? minutes : '0' + minutes) + ':'
//                 + (seconds > 9 ? seconds : '0' + seconds)
//             )
//         }
//     }
  
  
//     const clearTimer = (e) => {
  
//         // If you adjust it you should also need to
//         // adjust the Endtime formula we are about
//         // to code next    
//         setTimer('00:00:10');
  
//         // If you try to remove this line the 
//         // updating of timer Variable will be
//         // after 1000ms or 1sec
//         if (Ref.current) clearInterval(Ref.current);
//         const id = setInterval(() => {
//             startTimer(e);
//         }, 1000)
//         Ref.current = id;
//     }
  
//     const getDeadTime = () => {
//         let deadline = new Date();
  
//         // This is where you need to adjust if 
//         // you entend to add more time
//         deadline.setSeconds(deadline.getSeconds() + 10);
//         return deadline;
//     }
  
//     // We can use useEffect so that when the component
//     // mount the timer will start as soon as possible
  
//     // We put empty array to act as componentDid
//     // mount only
//     useEffect(() => {
//         clearTimer(getDeadTime());
//     }, []);
  
//     // Another way to call the clearTimer() to start
//     // the countdown is via action event from the
//     // button first we create function to be called
//     // by the button
//     const onClickReset = () => {
//         clearTimer(getDeadTime());
//     }
  
//     return (
//         <div className="App">
//             <h2>{timer}</h2>
//             <button onClick={onClickReset}>Reset</button>
//         </div>
//     )
// }
  
// export default Timer;


// import React from 'react'
// import { useState, useEffect } from 'react';


const Timer = (props) => {
    const {initialMinute = 0,initialSeconds = 0} = props;
    const [minutes, setMinutes ] = useState(initialMinute);
    const [seconds, setSeconds ] =  useState(initialSeconds);
    
    useEffect(()=>{
    let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    });

    return (
        <div>
        { minutes === 0 && seconds === 0
            ? null
            : <h1> {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h1> 
            
        }
        </div>
        
    )
}

// export default Timer;

    // const Timer = (props) => {
   
    //     const { hours = 0, minutes = 10, seconds = 60 } = props.hoursMinSecs;
    //     const [[hrs, mins, secs], setTime] = React.useState([props.hours, props.minutes, props.seconds]);
        
    
    //     const tick = () => {
       
    //         if (hrs === 0 && mins === 0 && secs === 0) 
    //             reset()
    //         else if (mins === 0 && secs === 0) {
    //             setTime([hrs - 1, 59, 59]);
    //         } else if (secs === 0) {
    //             setTime([hrs, mins - 1, 59]);
    //         } else {
    //             setTime([hrs, mins, secs - 1]);
    //         }
    //     };
    
    
    //     const reset = () => setTime([parseInt(props.hours), parseInt(props.minutes), parseInt(props.seconds)]);
    
        
    //     React.useEffect(() => {
    //         const timerId = setInterval(() => tick(), 1000);
    //         return () => clearInterval(timerId);
    //     });
    
        
    //     return (
    //         <div class="h2 justify-content-center" style={{ textAlign: 'center' }}>
    //             <p>{`${hrs.toString().padStart(2, '0')}:${mins
    //             .toString()
    //             .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</p> 
    //         </div>
    //     );
    // }
    

export default Timer;