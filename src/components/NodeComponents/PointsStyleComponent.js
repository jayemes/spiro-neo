import Rete from "rete";
import { colorSocket, numSocket, styleSocket } from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";
import NumControl from "../NodeControls/NumControl";

class PointsStyleComponent extends Rete.Component {
  constructor() {
    super("Point Style");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    const colorInput = new Rete.Input("color", "Color", colorSocket);

    const sizeInput = new Rete.Input("size", "Size", numSocket);

    sizeInput.addControl(
      new NumControl(this.editor, "size", node, false, 2, 0.1)
    );

    let out1 = new Rete.Output("style", "Style", styleSocket);

    return node.addOutput(out1).addInput(colorInput).addInput(sizeInput);
  }

  worker(node, inputs, outputs) {
    const color = inputs["color"]?.[0] || {
      rgb: { r: 100, g: 100, b: 150, a: 1 },
    };

    const size = inputs["size"]?.[0] || node.data["size"];

    outputs["style"] = {
      type: "points",
      size,
      color,
    };
  }
}

export default PointsStyleComponent;
