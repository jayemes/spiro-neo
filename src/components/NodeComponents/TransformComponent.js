import Rete from "rete";
import {numSocket, tranformSocket} from "./Sockets";
import NumControl from "../NodeControls/NumControl";
import NodeTemplate from "../Rete/NodeTemplate";

class TransformComponent extends Rete.Component {
    constructor() {
        super("Transform");
        this.data.component = NodeTemplate
    }

    builder(node) {
        const out1 = new Rete.Output("transform", "Transform", tranformSocket)

        const rotX = new Rete.Input("rot X", "Rot X", numSocket)
        const rotY = new Rete.Input("rot Y", "Rot Y", numSocket)
        const rotZ = new Rete.Input("rot Z", "Rot Z", numSocket)

        rotX.addControl(new NumControl(this.editor, "rot X", node, false, 0, 0.1))
        rotY.addControl(new NumControl(this.editor, "rot Y", node, false, 0, 0.1))
        rotZ.addControl(new NumControl(this.editor, "rot Z", node, false, 0, 0.1))

        return node
            .addOutput(out1)
            .addInput(rotX)
            .addInput(rotY)
            .addInput(rotZ)
    }

    worker(node, inputs, outputs) {
        const rotX = inputs["rot X"].length ? inputs["rot X"][0] : node.data["rot X"]
        const rotY = inputs["rot Y"].length ? inputs["rot Y"][0] : node.data["rot Y"]
        const rotZ = inputs["rot Z"].length ? inputs["rot Z"][0] : node.data["rot Z"]

        outputs["transform"] = {rotation: [rotX, rotY, rotZ]}
    }
}

export default TransformComponent