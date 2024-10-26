import React, { Component, useState } from "react";
import "./style.scss";

class Meter extends Component {
  render() {
    const { id } = this.props;
    return <div className="meter">{`This is a Meter, ID: ${id}`}</div>;
  }
}

export default Meter;
