import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Tile extends React.Component {
  static defaultProps = { tileColor: "black" };

  render() {
    //console.log(this.state);
    return (
      <div
        style={{ backgroundColor: this.props.tileColor, width: 70, height: 70 }}
        onClick={this.props.onClick}
      >
        <p>{this.props.value}</p>
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
            tileColor={(index % 2) - modifier === 0 ? "black" : "lightgray"}
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
    tiles: Array(64).fill(null)
    //TODO: Create state for all 64 tiles which checks if tile is clicked
  };
  //TODO: Create the onClick function here
  componentDidMount() {
    console.log("component did mount");
  }
  componentDidUpdate() {
    console.log("component did update");
  }
  componentWillUnmount() {
    console.log("component will unmount");
  }
  shouldComponentUpdate(nextProps, nextState) {
    //if (nextState.counter === 5) return false;
    return true;
  }
  handleClick(i) {
    const tiles = this.state.tiles;
    tiles[i] = "X";
    this.setState({ tiles: tiles });
  }

  render() {
    console.log("render");
    return (
      <div style={{ flexDirection: "column" }}>
        <div>{this.state.counter}</div>
        <div
          style={{ flexDirection: "column" }}
          onClick={() => {
            this.setState({ counter: this.state.counter + 1 });
          }}
        >
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
