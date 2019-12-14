import React, { Component } from "react";
import CursorZone from "./CursorZone";
import GameZone from "./GameZone";

class GameArea extends Component {
  render() {
    const { gameCursor, gameZone, moveCursor, dropDiscToZone } = this.props;
    return (
      <div className="row">
        <div className="row">
          <div className="col-xs-9">
            <CursorZone
              gameCursor={gameCursor}
              moveCursor={moveCursor}
              dropDiscToZone={dropDiscToZone}
            />

            <GameZone gameZone={gameZone} />
          </div>
        </div>
      </div>
    );
  }
}

export default GameArea;
