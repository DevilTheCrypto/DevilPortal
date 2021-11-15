import React, { Component, useEffect, useState, setState } from "react";

const RangeSliderDEVL = (props) => {

    const [rangeval, setRangeval] = useState(0);
    const [displayNum, setDisplaynum] = useState(0);
    // const [sliderMax, setSliderMax] = useState(0);

    let sliderMax = props.ethBalance*(10**18);
    // let sliderMax = parseFloat(window.web3.utils.fromWei(props.ethBalance, 'Ether')).toFixed(5);
    // setSliderMax(ethBalance);
  
    return (
          <div class="slidecontainer">
        <input type="range" ref={props.inputRef2} className="custom-range" min="0" max={sliderMax} 
         onChange={(event) => setRangeval(event.target.value)} />
        {rangeval}
        {/* <p>{parseFloat(window.web3.utils.fromWei(props.ethBalance, 'Ether')).toFixed(5)}</p> */}
      </div>
    );
  };
  
  export default RangeSliderDEVL;