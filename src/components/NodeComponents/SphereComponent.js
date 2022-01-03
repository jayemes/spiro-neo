import Rete from "rete";
import NumControl from "../NodeControls/NumControl";

import { vectorSocket, numSocket } from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";

class SphereComponent extends Rete.Component {
  constructor() {
    super("Sphere");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    const out1 = new Rete.Output("v3", "Vector", vectorSocket);
    const inpRad = new Rete.Input("rad", "Radius", numSocket);
    const inpK = new Rete.Input("k", "K", numSocket);
    const inpK2 = new Rete.Input("k2", "K2", numSocket);

    inpRad.addControl(new NumControl(this.editor, "rad", node, false, 50, 1));
    inpK.addControl(new NumControl(this.editor, "k", node, false, 3, 0.1));
    inpK2.addControl(new NumControl(this.editor, "k2", node, false, 1, 0.1));

    return node.addOutput(out1).addInput(inpRad).addInput(inpK).addInput(inpK2);
  }

  worker(node, inputs, outputs) {
    const r = inputs["rad"].length ? inputs["rad"][0] : node.data.rad;
    const k = inputs["k"].length ? inputs["k"][0] : node.data.k;
    const k2 = inputs["k2"].length ? inputs["k2"][0] : node.data.k2;

    outputs["v3"] = {
      x: function (i) {
        return r * Math.sin(k * i) * Math.cos(k2 * i);
      },
      y: function (i) {
        return r * Math.sin(k * i) * Math.sin(k2 * i);
      },
      z: function (i) {
        return r * Math.cos(k * i);
      },
    };
  }
}

export default SphereComponent;
