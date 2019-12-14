import React, { Component } from "react";
import { playerType } from "./constants";

class CursorZone extends Component {
  render() {
    const { gameCursor, moveCursor, dropDiscToZone } = this.props;
    console.log("this.props.gameCursor", gameCursor);

    return (
      <div className="bottom-buffer">
        <div className="clearfix area-width">
          {gameCursor.map((cursor, index) => {
            return (
              <div
                className="cursor-area"
                onMouseOver={() => moveCursor(cursor)}
                onClick={() => dropDiscToZone(cursor)}
              >
                <div style={{ verticalAlign: "middle" }}>
                  {cursor.player === playerType.One && (
                    <div className="circleBase circle-red" />
                  )}
                  {cursor.player === playerType.Two && (
                    <div className="circleBase circle-yellow" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CursorZone;
