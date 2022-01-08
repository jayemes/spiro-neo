import Rete from "rete";
import { colorSocket, styleSocket } from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";

class SolidColorComponent extends Rete.Component {
  constructor() {
    super("Solid Color");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    let out1 = new Rete.Output("style", "Style", styleSocket);

    const inColor = new Rete.Input("color", "Color", colorSocket);

    return node.addInput(inColor).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    const pick = inputs["color"].length
      ? inputs["color"][0]
      : { rgb: { r: 100, g: 100, b: 200, a: 1 } };

    outputs["style"] = {
      type: "solid",
      color: { type: "RGB", r: pick.rgb.r, g: pick.rgb.g, b: pick.rgb.b, a: 1 },
    };
  }
}

export default SolidColorComponent;
