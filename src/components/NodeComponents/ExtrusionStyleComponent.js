import Rete from "rete";
import { colorSocket, numSocket, styleSocket } from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";
import NumControl from "../NodeControls/NumControl";

class ExtrusionStyleComponent extends Rete.Component {
  constructor() {
    super("Extrusion Style");
    this.data.component = NodeTemplate;

    this.inputsNames = ["radius", "segments", "steps"];
  }

  builder(node) {
    const inputs = this.inputsNames.map(
      (name) => new Rete.Input(name, name, numSocket)
    );

    const colorInput = new Rete.Input("color", "Color", colorSocket);
    const styleInput = new Rete.Input("style", "Style", styleSocket);

    inputs[0].addControl(
      new NumControl(this.editor, "radius", node, false, 2, 0.1)
    );
    inputs[1].addControl(
      new NumControl(this.editor, "segments", node, false, 36, 1)
    );
    inputs[2].addControl(
      new NumControl(this.editor, "steps", node, false, 0, 100)
    );

    let out1 = new Rete.Output("style", "Style", styleSocket);

    inputs.forEach((input) => node.addInput(input));

    return node.addOutput(out1).addInput(colorInput).addInput(styleInput);
  }

  worker(node, inputs, outputs) {
    const params = {};

    const color = inputs["color"]?.[0];
    const style = inputs["style"]?.[0];

    this.inputsNames.forEach(
      (param) => (params[param] = inputs[param]?.[0] || node.data[param])
    );

    outputs["style"] = {
      type: "extrusion",
      ...params,
      color,
      styleInput: style,
    };
  }
}

export default ExtrusionStyleComponent;
