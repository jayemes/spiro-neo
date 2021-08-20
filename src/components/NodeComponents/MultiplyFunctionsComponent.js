import Rete from "rete";
import {vectorSocket} from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";

class MultiplyFunctionsComponent extends Rete.Component {
    constructor() {
        super("Multiply Functions");
        this.data.component = NodeTemplate
    }

    builder(node) {
        const f1 = new Rete.Input("f1", "F1", vectorSocket);
        const f2 = new Rete.Input("f2", "F2", vectorSocket);
        const out = new Rete.Output("out", "Result", vectorSocket);

        return node
            .addInput(f1)
            .addInput(f2)
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        const f1 = inputs["f1"].length ? inputs["f1"][0] : node.data.f1; // {x: f, y: f, z:f}
        const f2 = inputs["f2"].length ? inputs["f2"][0] : node.data.f2;

        let g

        if (f1 && !f2) g = f1
        if (f2 && !f1) g = f2
        if (f1 && f2) {
            g = {
                x: function (i) {
                    return f1.x(i) * f2.x(i)
                },
                y: function (i) {
                    return f1.y(i) * f2.y(i)
                },
                z: function (i) {
                    return f1.z(i) * f2.z(i)
                },
            }
        }

        outputs["out"] = g;
    }
}

export default MultiplyFunctionsComponent