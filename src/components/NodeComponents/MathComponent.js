import Rete from "rete";
import { numSocket } from "./Sockets";
import FunctionControl from "../NodeControls/FunctionControl";
import NumControl from "../NodeControls/NumControl";
import PreviewControl from "../NodeControls/PreviewControl";
import NodeTemplate from "../Rete/NodeTemplate";

import { evaluate } from "mathjs";

class MathComponent extends Rete.Component {
  constructor() {
    super("Math");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    let out1 = new Rete.Output("result", "Result", numSocket);

    const fc = new FunctionControl(
      this.editor,
      "fc",
      node,
      false,
      "Math.round(a+b)*c"
    );

    const inA = new Rete.Input("a", "Arg A", numSocket);
    inA.addControl(new NumControl(this.editor, "a", node, false, 1, 0.1));

    const inB = new Rete.Input("b", "Arg B", numSocket);
    inB.addControl(new NumControl(this.editor, "b", node, false, 2, 0.1));

    const inC = new Rete.Input("c", "Arg C", numSocket);
    inC.addControl(new NumControl(this.editor, "c", node, false, 3, 0.1));

    return node
      .addControl(new PreviewControl(this.editor, "preview", node, true))
      .addControl(fc)
      .addInput(inA)
      .addInput(inB)
      .addInput(inC)
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    const a = inputs["a"].length ? inputs["a"][0] : node.data.a;
    const b = inputs["b"].length ? inputs["b"][0] : node.data.b;
    const c = inputs["c"].length ? inputs["c"][0] : node.data.c;

    const fcControl = this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("fc");

    fcControl.setColor("black");

    let result;
    try {
      let context = { a, b, c };
      result = evaluate(node.data.fc, context);
    } catch (error) {
      result = 0;
      fcControl.setColor("red");
    }

    outputs["result"] = result;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("preview")
      .setValue(outputs["result"]);
  }
}

export default MathComponent;
