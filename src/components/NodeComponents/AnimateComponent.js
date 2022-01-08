import Rete from "rete";
import { numSocket } from "./Sockets";
import NumControl from "../NodeControls/NumControl";
import PreviewControl from "../NodeControls/PreviewControl";
import ToggleControl from "../NodeControls/ToggleControl";
import NodeTemplate from "../Rete/NodeTemplate";

class AnimateComponent extends Rete.Component {
  constructor() {
    super("Animate");
    this.data.component = NodeTemplate;
    this.progress = 0;
    this.TIMER_INTERVAL = 50;
  }

  builder(node) {
    const inp1 = new Rete.Input("min", "Min", numSocket);
    const inp2 = new Rete.Input("max", "Max", numSocket);
    const inp3 = new Rete.Input("delta", "Delta T", numSocket);
    const out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "min", node));
    inp2.addControl(new NumControl(this.editor, "max", node));
    inp3.addControl(new NumControl(this.editor, "delta", node));

    let cb = function () {
      this.progress += 1;
      this.editor.trigger("process");
    };

    this.cb = cb.bind(this);

    if (node.data.intervalId) clearInterval(node.data.intervalId);
    node.data.intervalId = setInterval(this.cb, this.TIMER_INTERVAL);

    this.preview = new PreviewControl(this.editor, "preview", node, true);

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addControl(this.preview)
      .addControl(new ToggleControl(this.editor, "mirror", node, "Mirror"))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    this.min = inputs["min"].length
      ? inputs["min"][0]
      : parseFloat(node.data.min);
    this.max = inputs["max"].length
      ? inputs["max"][0]
      : parseFloat(node.data.max);
    this.delta = inputs["delta"].length
      ? inputs["delta"][0]
      : parseFloat(node.data.delta);

    let b = this.delta;
    let x = this.progress / (1000 / this.TIMER_INTERVAL);

    let triProgress;
    if (node.data.mirror) {
      triProgress =
        0.5 +
        (1 / Math.PI) *
          Math.asin(Math.sin((2 / b) * Math.PI * (0.5 * x - b / 4)));
    } else {
      triProgress = (x % b) / b;
    }

    this.num = this.min + triProgress * (this.max - this.min);

    this.preview.setValue(this.num);

    outputs["num"] = this.num;
  }
}

export default AnimateComponent;
