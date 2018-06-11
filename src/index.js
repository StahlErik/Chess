import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Tile extends React.Component {
  static defaultProps = { tileColor: "black" };

  render() {
    return (
      <div
        style={{ backgroundColor: this.props.tileColor, width: 50, height: 50 }}
        //TODO: add onClick which renders "X" if clicked
      />
    );
  }
}

class Row extends React.Component {
  render() {
    const modifier = this.props.even ? 0 : 1;
    return (
      <div>
        {Array.from(Array(8)).map((_, index) => (
          <Tile
            tileColor={(index % 2) - modifier === 0 ? "black" : "lightgray"}
            key={index}
          />
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  state = {
    counter: 0
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
  render() {
    console.log("render");
    return (
      <div
        onClick={() => {
          this.setState({ counter: this.state.counter + 1 });
        }}
      >
        {this.state.counter}
        <div style={{ flexDirection: "column" }}>
          {Array.from(Array(8)).map((_, index) => (
            <Row even={index % 2 === 0} key={index} />
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
