import React, { Component } from "react";
import { playerType } from "./constants";

class GameZone extends Component {
  render() {
    const { gameZone } = this.props;
    return (
      <div>
        {gameZone.map((row, index) => {
          return (
            <div key={index} className="clearfix area-width">
              {row.map((cell, i) => {
                return (
                  <div className="box-cell">
                    {cell.player === playerType.One && (
                      <div className="circleBase circle-red" />
                    )}
                    {cell.player === playerType.Two && (
                      <div className="circleBase circle-yellow" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default GameZone;
