import React, { useState } from "react";
import Meter from "./Meter";
import Lazy from "./lazy";
import "./style.scss";

function LazyLoad() {
  return (
    <div className="wrapper">
      <Meter id={0} />
      <Meter id={1} />
      {Array.from({ length: 12 }).map((_, index) => {
        return (
          <Lazy top={(index + 2) * 400} height={400} key={index} fallback={<div>meter loading...</div>}>
            <Meter id={index + 2} />
          </Lazy>
        );
      })}
    </div>
  );
}

export default LazyLoad;
