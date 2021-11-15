import OnramperWidget from "@onramper/widget";
import React, { Component, useEffect, useState, setState, useRef } from "react";

export default function OnramperWidgetContainer() {

  return (
    <div style={{maxWidth: '440px',  maxHeight: '595px',  height: '100%',  width: '100%'}}>
      <OnramperWidget
        color="#266678"
        defaultAmount={200}
        defaultCrypto="BNB"
        API_KEY="pk_test_ass3gtLSWQpI11IWUZLJdrfyQhj7bTw_3xwLvhEvH6Q0"
      />
    </div>
  )
}