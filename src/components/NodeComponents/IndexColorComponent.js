import Rete from "rete";
import { styleSocket } from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";

class IndexColorComponent extends Rete.Component {
  constructor() {
    super("Index Color");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    let out1 = new Rete.Output("style", "Style", styleSocket);

    return node.addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["style"] = {
      type: "index",
    };
  }
}

export default IndexColorComponent;
