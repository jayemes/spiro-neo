import Rete from "rete";
import { numSocket } from "./Sockets";
import NumControl from "../NodeControls/NumControl";
import PreviewControl from "../NodeControls/PreviewControl";
import NodeTemplate from "../Rete/NodeTemplate";

class AddComponent extends Rete.Component {
  constructor() {
    super("Add");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    const inp1 = new Rete.Input("num1", "Number", numSocket);
    const inp2 = new Rete.Input("num2", "Number2", numSocket);
    const out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new PreviewControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const n1 = inputs.num1.length ? inputs.num1[0] : node.data.num1;
    const n2 = inputs.num2.length ? inputs.num2[0] : node.data.num2;
    const sum = n1 + n2;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs.num = sum;
  }
}

export default AddComponent;
