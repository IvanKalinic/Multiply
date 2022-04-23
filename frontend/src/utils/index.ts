export const vertical = (boardArray: any) => {
  let column;
  for (let i = 0; i < 8; i++) {
    column = boardArray[i];
    for (let j = 0; j < 8 - 3; j++) {
      if (
        column[j] !== null &&
        column[j].clicked &&
        column[j + 1].clicked &&
        column[j + 2].clicked &&
        column[j + 3].clicked
      ) {
        return true;
      }
    }
  }
};

export const horizontal = (boardArray: any) => {
  for (let i = 0; i < 8 - 3; i++) {
    for (let j = 0; j < 8; j++) {
      if (
        boardArray[i][j] !== null &&
        boardArray[i][j].clicked &&
        boardArray[i + 1][j].clicked &&
        boardArray[i + 2][j].clicked &&
        boardArray[i + 3][j].clicked
      ) {
        return true;
      }
    }
  }
};

export const diagonalUp = (boardArray: any) => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (
        boardArray[i][j] !== null &&
        boardArray[i][j].clicked &&
        boardArray[i + 1][j + 1].clicked &&
        boardArray[i + 2][j + 2].clicked &&
        boardArray[i + 3][j + 3].clicked
      ) {
        return true;
      }
    }
  }
};

export const diagonalDown = (boardArray: any) => {
  for (let i = 0; i < 5; i++) {
    for (let j = 7; j >= 3; j--) {
      if (
        boardArray[i][j] !== null &&
        boardArray[i][j].clicked &&
        boardArray[i + 1][j - 1].clicked &&
        boardArray[i + 2][j - 2].clicked &&
        boardArray[i + 3][j - 3].clicked
      ) {
        return true;
      }
    }
  }
};

export const handleShuffle = (options: any) => {
  return options.sort(() => Math.random() - 0.5);
};

export const randomRoomName = () => {
  return Array.from(Array(8), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
};
