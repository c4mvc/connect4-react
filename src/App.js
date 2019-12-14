import React, { Component } from "react";
import _ from "underscore";
import checkWin from "connect4-check-win";
import "./App.css";
import { getLastGame, postMoves } from "./game-storage";
import Header from "./Header";
import Buttons from "./Buttons";
import GameArea from "./GameArea";
import { playerType, totalColumns, totalRows } from "./constants";

function gameZoneCell(player, rowIndex, columnIndex) {
  this.player = player;
  this.rowIndex = rowIndex;
  this.columnIndex = columnIndex;
}

function GameCursor(isAvailable, columnIndex, player) {
  this.isAvailable = isAvailable;
  this.columnIndex = columnIndex;
  this.player = player;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameZone: [],
      currentRow: undefined,
      currentColumn: undefined,
      movesStorage: [],
      currentPlayer: playerType.One,
      gameCursor: new Array(totalColumns)
    };
    this.startNewGame = this.startNewGame.bind(this);
    this.undoLastMove = this.undoLastMove.bind(this);
    this.replayGame = this.replayGame.bind(this);
    this.moveCursor = this.moveCursor.bind(this);
    this.dropDiscToZone = this.dropDiscToZone.bind(this);
  }

  startNewGame() {
    console.log("startNewGame", this.state.currentPlayer);
    const gameZone = this.buildGameZone();
    this.loadGameCursor(0);
    this.setState({
      gameZone,
      movesStorage: [],
      currentPlayer: playerType.One
    });
  }

  undoLastMove() {
    const { lastMove, gameZone } = this.state;
    if (lastMove) {
      const gameZoneNew = [...gameZone];
      gameZoneNew[lastMove.rowIndex][lastMove.columnIndex].player = playerType.None;

      this.toggleCursorOfPlayer();
      this.setState({ gameZone: gameZoneNew, lastMove: undefined });
    }
  }

  replayGame() {
    const gameZone = this.buildGameZone();
    this.loadGameCursor(0);
    const self = this;

    const moves = getLastGame();
    if (!moves || moves.length === 0) {
      return;
    }
    let i = 0;
    let gameZoneNew = [...gameZone];
    function drawMovesForReplay() {
      setTimeout(function() {
        const move = moves[i];
        gameZoneNew[move.rowIndex][move.columnIndex].player = move.player;

        self.setState({ gameZone: gameZoneNew });

        i++;
        if (i < moves.length) {
          drawMovesForReplay();
        }
      }, 1100);
    }
    drawMovesForReplay();
  }

  buildGameZone() {
    const gameZone = [];
    for (let row = 0; row < totalRows; row++) {
      gameZone[row] = [];
      for (let column = 0; column < totalColumns; column++) {
        gameZone[row].push(new gameZoneCell(playerType.None, row, column));
      }
    }
    return gameZone;
  }

  loadGameCursor(columnIndex) {
    const { gameCursor, currentPlayer } = this.state;

    _.each(gameCursor, function(cursor, index) {
      const cursorObj = new GameCursor(false, index, playerType.None);
      gameCursor[index] = cursorObj;
    });
    gameCursor[columnIndex] = new GameCursor(
      false,
      columnIndex,
      currentPlayer
    );
    const lastCursor = _.first(gameCursor);
    this.setState({ gameCursor, lastCursor });
    // return { gameCursor, lastCursor };
  }

  componentDidMount() {
    const gameZone = this.buildGameZone();
    this.loadGameCursor(0);
    // const { gameCursor, lastCursor } = this.loadGameCursor(0);
    // this.setState({ gameZone, gameCursor, lastCursor });
    this.setState({ gameZone });
  }

  moveCursor(cursor) {
    const { lastCursor } = this.state;
    if (lastCursor.columnIndex === cursor.columnIndex) {
      return;
    }

    this.loadGameCursor(cursor.columnIndex);
    this.setState({ lastCursor: cursor });
  }

  availableColumns() {
    const { gameZone } = this.state;
    const movesArray = [];
    for (let i = 0; i < totalColumns; i++) {
      if (gameZone[0][i].player === 0) {
        movesArray.push(i);
      }
    }
    return movesArray;
  }

  availableFirstRow(col, player) {
    const { gameZone } = this.state;
    let i;
    for (i = 0; i < totalRows; i++) {
      if (gameZone[i][col].player !== 0) {
        break;
      }
    }
    return i - 1;
  }

  moveAndPlaceDisk(currentColumn) {
    const { currentPlayer, gameZone } = this.state;
    const currentRow = this.availableFirstRow(currentColumn, currentPlayer);
    let gameZoneNew = [...gameZone];
    gameZoneNew[currentRow][currentColumn] = new gameZoneCell(
      currentPlayer,
      currentRow,
      currentColumn
    );

    this.setState({ gameZone: gameZoneNew });

    return { currentRow, gameZone: gameZoneNew };
  }

  dropDiscToZone(cursor) {
    console.log("dropDiscToZone", cursor);
    const { movesStorage, currentPlayer } = this.state;
    const availableColumns = this.availableColumns();
    if (availableColumns.indexOf(cursor.columnIndex) !== -1) {
      const currentColumn = cursor.columnIndex;
      const { currentRow, gameZone } = this.moveAndPlaceDisk(currentColumn);
      const lastMove = new gameZoneCell(
        currentPlayer,
        currentRow,
        currentColumn
      );
      const movesStorageNew = [...movesStorage, lastMove];
      console.log("movesStorageNew", movesStorageNew);
      this.setState({ currentColumn, lastMove, movesStorage: movesStorageNew });

      this.checkForWin(gameZone, currentPlayer, movesStorageNew);
    }
  }

  getNextPlayer() {
    const { currentPlayer } = this.state;
    if (currentPlayer === playerType.One) {
      return playerType.Two;
    }
    return playerType.One;
  }

  toggleCursorOfPlayer() {
    this.loadGameCursor(0);
    const currentPlayer = this.getNextPlayer();
    let { gameCursor } = this.state;
    gameCursor[0] = new GameCursor(false, 0, currentPlayer);
    this.setState({ currentPlayer, gameCursor });
  }

  checkForWin(gameZone, currentPlayer, movesStorage) {
    if (
      checkWin({
        totalRows,
        totalColumns,
        gameZone,
        currentPlayer
      })
    ) {
      const winPlayer = currentPlayer; // this.state.currentPlayer;
      const self = this;

      setTimeout(() => {
        alert("Player " + winPlayer + " Wins");
        const gameZoneNew = self.buildGameZone();
        self.loadGameCursor(0);
        console.log("movesStorage", movesStorage);
        postMoves(movesStorage);
        this.setState({ gameZone: gameZoneNew });
      }, 300);
    } else {
      this.toggleCursorOfPlayer();
    }
  }

  // buildGameZone();

  render() {
    const { gameZone, gameCursor } = this.state;
    console.log("", gameZone, gameCursor);
    return (
      <div className="container">
        <Header />

        <Buttons
          startNewGame={this.startNewGame}
          undoLastMove={this.undoLastMove}
          replayGame={this.replayGame}
        />

        <div className="row">
          <div className="col-md-3">
            <h3>Player1</h3>
            <div className="circleBase circle-red-small" />
          </div>
          <div className="col-md-3">
            <h3>Player2</h3>
            <div className="circleBase circle-yellow-small" />
          </div>
        </div>

        <GameArea
          gameCursor={gameCursor}
          gameZone={gameZone}
          moveCursor={this.moveCursor}
          dropDiscToZone={this.dropDiscToZone}
        />
      </div>
    );
  }
}

export default App;
