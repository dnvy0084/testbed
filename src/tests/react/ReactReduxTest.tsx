import React, { Component, ReactNode } from "react";
import ReactDOM from "react-dom";
import TestBase from "../TestBase";

interface CounterProps {
  value: number;
  color: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

const Counter = ({ value, color, onIncrement, onDecrement }: CounterProps) => {
  return (
    <div className="counter">
      <h1 style={{ color }}>{value}</h1>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  );
};

interface PaletteItemProps {
  color: string;
}

interface PaletteProps {
  colors: string[];
}

class PaletteItem extends Component<PaletteItemProps> {
  public render(): ReactNode {
    const { color } = this.props;

    return <div style={{ color }}>{color}</div>;
  }
}

class Palette extends Component<PaletteProps> {
  public render(): ReactNode {
    const { colors } = this.props;

    return (
      <ul className="palette">
        {colors.map((color, i) => (
          <PaletteItem color={color} key={i}></PaletteItem>
        ))}
      </ul>
    );
  }
}

class ReactApp extends Component {
  public render(): ReactNode {
    return (
      <div className="App">
        <Palette colors={["red", "green", "blue"]}></Palette>
        <Counter
          value={0}
          color="red"
          onIncrement={() => console.log("click")}
          onDecrement={() => console.log("decrement")}
        ></Counter>
      </div>
    );
  }
}

export default class ReactReduxTest extends TestBase {
  protected testDidStart() {
    const container = document.querySelector("#container") as HTMLElement;

    ReactDOM.render(<ReactApp></ReactApp>, container, (...args: any[]): void =>
      console.log("callback", ...args)
    );
  }

  public get innerHTML(): string {
    return `<div id="container"></div>`;
  }
}
