const getLastGame = () => {
  const moves = JSON.parse(localStorage.getItem("lastGame"));
  return moves;
};

const postMoves = (gameMoves) => {
  localStorage.setItem("lastGame", JSON.stringify(gameMoves));
};

export {
  postMoves,
  getLastGame
};
