import React, { PureComponent } from "react";

class Buttons extends PureComponent {
  render() {
    const { startNewGame, undoLastMove, replayGame } = this.props;
    return (
      <div className="row">
        <button className="btn-danger btn-lg" onClick={startNewGame}>
          New Game
        </button>
        <button
          className="btn-primary btn-sm"
          onClick={undoLastMove}
        >
          Undo
        </button>
        <button className="btn-success btn-sm" onClick={replayGame}>
          Replay
        </button>
      </div>
    );
  }
}

export default Buttons;
