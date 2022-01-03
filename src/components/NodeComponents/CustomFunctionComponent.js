import Rete from "rete";
import { vectorSocket } from "./Sockets";
import FunctionControl from "../NodeControls/FunctionControl";
import NodeTemplate from "../Rete/NodeTemplate";
import { evaluate, parse } from "mathjs";

export default class CustomComponent extends Rete.Component {
  constructor() {
    super("Custom");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    const out1 = new Rete.Output("v3", "Vector", vectorSocket);

    const fx = new FunctionControl(this.editor, "fx", node, false, "sin(t)");
    const fy = new FunctionControl(
      this.editor,
      "fy",
      node,
      false,
      "t*floor(t)"
    );
    const fz = new FunctionControl(this.editor, "fz", node, false, "1.1^t");

    return node.addControl(fx).addControl(fy).addControl(fz).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    let fx, fy, fz;

    const controls = this.editor.nodes.find((n) => n.id === node.id).controls;

    controls.get("fx").setColor("black");
    controls.get("fy").setColor("black");
    controls.get("fz").setColor("black");

    try {
      // fx = new Function("i", "return " + node.data.fx)
      // fy = new Function("i", "return " + node.data.fy)
      // fz = new Function("i", "return " + node.data.fz)

      let t = 0.1;

      fx = parse("f(t) =" + node.data.fx)
        .compile()
        .evaluate();
      fy = parse("f(t) =" + node.data.fy)
        .compile()
        .evaluate();
      fz = parse("f(t) =" + node.data.fz)
        .compile()
        .evaluate();

      fx(t);
      fy(t);
      fz(t);

      // if (isNaN(fx(0.5))) throw new Error('fx error')
      // if (isNaN(fy(0.5))) throw new Error('fy error')
      // if (isNaN(fz(0.5))) throw new Error('fz error')
    } catch (error) {
      fx = function () {
        return 0;
      };
      fy = function () {
        return 0;
      };
      fz = function () {
        return 0;
      };
      controls.get("fx").setColor("red");
      controls.get("fy").setColor("red");
      controls.get("fz").setColor("red");
    }

    outputs["v3"] = {
      x: fx,
      y: fy,
      z: fz,
    };
  }
}
