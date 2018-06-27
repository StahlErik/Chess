import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Tile extends React.Component {
  static defaultProps = { tileType: "light" };

  render() {
    const { tileType, value, onClick } = this.props;

    let backgroundColor = tileType === "light" ? "#ffce9e" : "#d18b47";

    if (value.availableMove) {
      backgroundColor = tileType === "light" ? "pink" : "hotpink";
    }

    return (
      <div
        style={{
          backgroundColor,
          width: 70,
          height: 70,
          borderStyle: value.clicked ? "dashed" : "none"
        }}
        onClick={onClick}
      >
        <i
          className={value.piece}
          style={{
            color: value.color
          }}
        />
      </div>
    );
  }
}

class Row extends React.Component {
  state = {
    rowCol: {}
  };

  calcTileNr(row, col) {
    return 8 * row + col;
  }

  render() {
    const modifier = this.props.even ? 0 : 1;
    const colArray = Array.from(Array(8));
    return (
      <div>
        {colArray.map((_, index) => (
          <Tile
            tileType={(index % 2) - modifier === 0 ? "light" : "dark"}
            key={index}
            value={this.props.tiles[this.calcTileNr(this.props.rowInd, index)]}
            onClick={() =>
              this.props.onClick(this.calcTileNr(this.props.rowInd, index))
            }
          />
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  state = {
    counter: 0,
    turn: "white",
    tiles: Array(64).fill({
      piece: "",
      color: "",
      clicked: false,
      availableMove: false
    }),
    prevClickedTile: null,
    prevClickedTileNr: null
  };
  fillBoard(array, startIndex, color) {
    let modifier = 0;
    if (color === "white") {
      modifier = 8;
    }
    array[startIndex + modifier] = {
      ...this.state.tiles[startIndex + modifier],
      piece: "fas fa-chess-rook",
      color: color
    };
    array[startIndex + 1 + modifier] = {
      ...this.state.tiles[startIndex + 1 + modifier],
      piece: "fas fa-chess-knight",
      color: color
    };
    array[startIndex + 2 + modifier] = {
      ...this.state.tiles[startIndex + 2 + modifier],
      piece: "fas fa-chess-bishop",
      color: color
    };
    array[startIndex + 3 + modifier] = {
      ...this.state.tiles[startIndex + 3 + modifier],
      piece: "fas fa-chess-king",
      color: color
    };
    array[startIndex + 4 + modifier] = {
      ...this.state.tiles[startIndex + 4 + modifier],
      piece: "fas fa-chess-queen",
      color: color
    };
    array[startIndex + 5 + modifier] = {
      ...this.state.tiles[startIndex + 5 + modifier],
      piece: "fas fa-chess-bishop",
      color: color
    };
    array[startIndex + 6 + modifier] = {
      ...this.state.tiles[startIndex + 6 + modifier],
      piece: "fas fa-chess-knight",
      color: color
    };
    array[startIndex + 7 + modifier] = {
      ...this.state.tiles[startIndex + 7 + modifier],
      piece: "fas fa-chess-rook",
      color: color
    };
    let i;
    for (i = 0; i < 8; i++) {
      array[startIndex + 8 + i - modifier] = {
        ...this.state.tiles[startIndex + 8 + i - modifier],
        piece: "fas fa-chess-pawn",
        color: color
      };
    }
    return array;
  }

  componentDidMount() {
    console.log("component did mount");
    let start = this.state.tiles.slice();
    //console.log(start, "before");
    start = this.fillBoard(start, 0, "black");
    start = this.fillBoard(start, 48, "white");
    //console.log(start, "after");
    this.setState({
      ...this.state,
      tiles: start
    });
  }
  componentDidUpdate() {
    //console.log("component did update");
    console.log(this.state);
  }
  componentWillUnmount() {
    console.log("component will unmount");
  }
  shouldComponentUpdate(nextProps, nextState) {
    //if (nextState.counter === 5) return false;
    return true;
  }
  handleClick(i) {
    let tiles = this.state.tiles.slice();
    let state = this.state;
    let j;

    if (tiles[i].availableMove) {
      tiles[i] = state.prevClickedTile;
      tiles[state.prevClickedTileNr] = {
        ...tiles[state.prevClickedTileNr],
        color: "",
        piece: ""
      };
      if (state.turn === "white") {
        state.turn = "black";
      } else {
        state.turn = "white";
      }
      for (j = 0; j < tiles.length; j++) {
        tiles[j] = {
          ...tiles[j],
          clicked: false,
          availableMove: false
        };
      }
    } else {
      for (j = 0; j < tiles.length; j++) {
        tiles[j] = {
          ...tiles[j],
          clicked: false,
          availableMove: false
        };
      }

      tiles[i] = {
        ...tiles[i],
        clicked: true
      };
      if (this.checkPlayerOnTile(i)) {
        tiles = this.highlightAvailableMoves(i, tiles);
      }
    }
    this.setState({
      ...this.state,
      counter: this.state.counter + 1,
      tiles: tiles,
      prevClickedTile: tiles[i],
      prevClickedTileNr: i
    });
  }
  checkPlayerOnTile(i) {
    const currentState = this.state;
    if (currentState.tiles[i].color === currentState.turn) {
      return true;
    } else {
      return false;
    }
  }
  highlightAvailableMoves(i, tiles) {
    let moves = [];
    moves = this.calculatePieceMoves(i, tiles);
    console.log("moves: ", moves);
    let j;
    for (j = 0; j < moves.length; j++) {
      tiles[i + moves[j]] = {
        ...tiles[i + moves[j]],
        availableMove: true
      };
    }
    return tiles;
  }

  calculatePieceMoves(i, tiles) {
    let moves = [];
    let piece = tiles[i].piece;
    if (piece.includes("pawn")) {
      let startPosRook = [];
      let modifier = 1;
      if (tiles[i].color === "white") {
        startPosRook = [48, 49, 50, 51, 52, 53, 54, 55];
        modifier = -1;
      } else {
        startPosRook = [8, 9, 10, 11, 12, 13, 14, 15];
      }
      if (tiles[i + 8 * modifier].piece === "") {
        moves.push(8 * modifier);
        if (startPosRook.includes(i)) {
          if (tiles[i + 16 * modifier].piece === "") {
            moves.push(16 * modifier);
          }
        }
      }
      if (
        tiles[i + 7 * modifier].piece !== "" &&
        tiles[i + 7 * modifier].color !== tiles[i].color
      ) {
        if (
          (modifier === -1 && i % 8 !== 7) ||
          (modifier === 1 && i % 8 !== 0)
        ) {
          moves.push(7 * modifier);
        }
      }
      if (
        tiles[i + 9 * modifier].piece !== "" &&
        tiles[i + 9 * modifier].color !== tiles[i].color
      ) {
        if (
          (modifier === -1 && i % 8 !== 0) ||
          (modifier === 1 && i % 8 !== 7)
        ) {
          moves.push(9 * modifier);
        }
      }
    } else if (piece.includes("rook")) {
      let j;
      let count;
      let upMove = true;
      let downMove = true;
      let rightMove = true;
      let leftMove = true;
      for (j = 0; j < 7; j++) {
        count = i + j + 1;
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          rightMove &&
          i % 8 !== 7
        ) {
          moves.push(j + 1);
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count % 8 === 7
          ) {
            rightMove = false;
          }
        } else {
          rightMove = false;
        }
        count = i - j - 1;
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          leftMove &&
          i % 8 !== 0
        ) {
          moves.push(-j - 1);
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count % 8 === 0
          ) {
            leftMove = false;
          }
        } else {
          leftMove = false;
        }
        count = i + (j + 1) * 8;
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          downMove &&
          i < 56
        ) {
          moves.push((j + 1) * 8);
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count > 55
          ) {
            downMove = false;
          }
        } else {
          downMove = false;
        }
        count = i + (-j - 1) * 8;
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          upMove &&
          i > 7
        ) {
          moves.push((-j - 1) * 8);
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count < 8
          ) {
            upMove = false;
          }
        } else {
          upMove = false;
        }
      }
    } else if (piece.includes("knight")) {
      let knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];
      if (i % 8 === 0) {
        knightMoves.splice(knightMoves.indexOf(-17), 1);
        knightMoves.splice(knightMoves.indexOf(-10), 1);
        knightMoves.splice(knightMoves.indexOf(6), 1);
        knightMoves.splice(knightMoves.indexOf(15), 1);
      } else if (i % 8 === 1) {
        knightMoves.splice(knightMoves.indexOf(-10), 1);
        knightMoves.splice(knightMoves.indexOf(6), 1);
      }
      if (i % 8 === 7) {
        knightMoves.splice(knightMoves.indexOf(-15), 1);
        knightMoves.splice(knightMoves.indexOf(-6), 1);
        knightMoves.splice(knightMoves.indexOf(10), 1);
        knightMoves.splice(knightMoves.indexOf(17), 1);
      } else if (i % 8 === 6) {
        knightMoves.splice(knightMoves.indexOf(-6), 1);
        knightMoves.splice(knightMoves.indexOf(10), 1);
      }
      if (i >= 0 && i <= 15) {
        if (knightMoves.includes(-17)) {
          knightMoves.splice(knightMoves.indexOf(-17), 1);
        }
        if (knightMoves.includes(-15)) {
          knightMoves.splice(knightMoves.indexOf(-15), 1);
        }
        if (i >= 0 && i <= 7) {
          if (knightMoves.includes(-10)) {
            knightMoves.splice(knightMoves.indexOf(-10), 1);
          }
          if (knightMoves.includes(-6)) {
            knightMoves.splice(knightMoves.indexOf(-6), 1);
          }
        }
      }

      if (i >= 48 && i <= 63) {
        if (knightMoves.includes(17)) {
          knightMoves.splice(knightMoves.indexOf(17), 1);
        }
        if (knightMoves.includes(15)) {
          knightMoves.splice(knightMoves.indexOf(15), 1);
        }
        if (i >= 56 && i <= 63) {
          if (knightMoves.includes(10)) {
            knightMoves.splice(knightMoves.indexOf(10), 1);
          }
          if (knightMoves.includes(6)) {
            knightMoves.splice(knightMoves.indexOf(6), 1);
          }
        }
      }
      let j;
      let count;
      for (j in knightMoves) {
        count = i + knightMoves[j];
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color
        ) {
          moves.push(knightMoves[j]);
        }
      }
    } else if (piece.includes("bishop")) {
      let j;
      let count;
      let upLeftMove = true;
      let upRightMove = true;
      let downLeftMove = true;
      let downRightMove = true;
      for (j = 0; j < 7; j++) {
        count = i - 9 * (j + 1);
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          upLeftMove &&
          i % 8 !== 0 &&
          i > 7
        ) {
          moves.push(-9 * (j + 1));
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count % 8 === 0 ||
            count < 8
          ) {
            upLeftMove = false;
          }
        } else {
          upLeftMove = false;
        }
        count = i - 7 * (j + 1);
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          upRightMove &&
          i % 8 !== 7 &&
          i > 7
        ) {
          moves.push(-7 * (j + 1));
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count % 8 === 7 ||
            count < 8
          ) {
            upRightMove = false;
          }
        } else {
          upRightMove = false;
        }
        count = i + 7 * (j + 1);
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          downLeftMove &&
          i < 56 &&
          i % 8 !== 0
        ) {
          moves.push(7 * (j + 1));
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count > 55 ||
            count % 8 === 0
          ) {
            downLeftMove = false;
          }
        } else {
          downLeftMove = false;
        }
        count = i + 9 * (j + 1);
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          downRightMove &&
          i < 56 &&
          i % 8 !== 7
        ) {
          moves.push(9 * (j + 1));
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count > 55 ||
            count % 8 === 7
          ) {
            downRightMove = false;
          }
        } else {
          downRightMove = false;
        }
      }
    } else if (piece.includes("queen")) {
      let j;
      let count;
      let upLeftMove = true;
      let upRightMove = true;
      let downLeftMove = true;
      let downRightMove = true;
      let upMove = true;
      let downMove = true;
      let rightMove = true;
      let leftMove = true;
      for (j = 0; j < 7; j++) {
        count = i - 9 * (j + 1);
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          upLeftMove &&
          i % 8 !== 0 &&
          i > 7
        ) {
          moves.push(-9 * (j + 1));
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count % 8 === 0 ||
            count < 8
          ) {
            upLeftMove = false;
          }
        } else {
          upLeftMove = false;
        }
        count = i - 7 * (j + 1);
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          upRightMove &&
          i % 8 !== 7 &&
          i > 7
        ) {
          moves.push(-7 * (j + 1));
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count % 8 === 7 ||
            count < 8
          ) {
            upRightMove = false;
          }
        } else {
          upRightMove = false;
        }
        count = i + 7 * (j + 1);
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          downLeftMove &&
          i < 56 &&
          i % 8 !== 0
        ) {
          moves.push(7 * (j + 1));
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count > 55 ||
            count % 8 === 0
          ) {
            downLeftMove = false;
          }
        } else {
          downLeftMove = false;
        }
        count = i + 9 * (j + 1);
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          downRightMove &&
          i < 56 &&
          i % 8 !== 7
        ) {
          moves.push(9 * (j + 1));
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count > 55 ||
            count % 8 === 7
          ) {
            downRightMove = false;
          }
        } else {
          downRightMove = false;
        }
        count = i + j + 1;
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          rightMove &&
          i % 8 !== 7
        ) {
          moves.push(j + 1);
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count % 8 === 7
          ) {
            rightMove = false;
          }
        } else {
          rightMove = false;
        }
        count = i - j - 1;
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          leftMove &&
          i % 8 !== 0
        ) {
          moves.push(-j - 1);
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count % 8 === 0
          ) {
            leftMove = false;
          }
        } else {
          leftMove = false;
        }
        count = i + (j + 1) * 8;
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          downMove &&
          i < 56
        ) {
          moves.push((j + 1) * 8);
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count > 55
          ) {
            downMove = false;
          }
        } else {
          downMove = false;
        }
        count = i + (-j - 1) * 8;
        if (
          count <= 63 &&
          count >= 0 &&
          tiles[count].color !== tiles[i].color &&
          upMove &&
          i > 7
        ) {
          moves.push((-j - 1) * 8);
          if (
            (tiles[count].piece !== "" &&
              tiles[count].color !== tiles[i].color) ||
            count < 8
          ) {
            upMove = false;
          }
        } else {
          upMove = false;
        }
      }
    } else if (piece.includes("king")) {
      let j;
      let count;
      for (j = -9; j < -6; j++) {
        count = i + j;
        if (count >= 0 && count <= 63 && tiles[count].piece === "") {
          moves.push(j);
        }
      }
      for (j = 7; j < 10; j++) {
        count = i + j;
        if (count >= 0 && count <= 63 && tiles[count].piece === "") {
          moves.push(j);
        }
      }
      count = i + 1;
      if (count >= 0 && count <= 63 && tiles[count].piece === "") {
        moves.push(1);
      }
      count = i - 1;
      if (count >= 0 && count <= 63 && tiles[count].piece === "") {
        moves.push(-1);
      }
    }
    return moves;
  }

  render() {
    //console.log("render");
    //console.log(this.state);
    return (
      <div style={{ flexDirection: "column" }}>
        <div>
          Click counter: {this.state.counter} Turn: {this.state.turn}
        </div>
        <div style={{ flexDirection: "column" }}>
          {Array.from(Array(8)).map((_, index) => (
            <Row
              even={index % 2 === 0}
              key={index}
              rowInd={index}
              tiles={this.state.tiles}
              onClick={i => this.handleClick(i)}
            />
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
