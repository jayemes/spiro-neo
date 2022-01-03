import Rete from "rete";
import { colorSocket } from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";
import ColorPickerControl from "../NodeControls/ColorPickerControl";

export default class ColorPickerComponent extends Rete.Component {
  constructor() {
    super("Color Picker");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    let out = new Rete.Output("color", "Color", colorSocket);

    let picker = new ColorPickerControl(this.editor, "color", node, false);

    return node.addControl(picker).addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["color"] = node.data.color;
  }
}
