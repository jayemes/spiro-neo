import Rete from "rete";
import {numSocket} from "./Sockets";
import NumControl from "../NodeControls/NumControl";
import NodeTemplate from "../Rete/NodeTemplate";

class NumComponent extends Rete.Component {
    constructor() {
        super("Number");
        this.data.component = NodeTemplate
    }

    builder(node) {
        var out1 = new Rete.Output("num", "Number", numSocket);
        var ctrl = new NumControl(this.editor, "num", node);

        return node.addControl(ctrl).addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs["num"] = node.data.num;
    }
}

export default NumComponent