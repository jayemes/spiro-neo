import Rete from "rete";
import {numSocket, styleSocket, tranformSocket, vectorSocket} from "./Sockets";
import NumControl from "../NodeControls/NumControl";
import NodeTemplate from "../Rete/NodeTemplate";

let outputId = 1000

export default class OutputComponent extends Rete.Component {
    constructor(handler) {
        super("Output")
        this.handler = handler
        this.data.component = NodeTemplate
    }

    builder(node) {
        node.data.outputId = outputId++

        const vInput = new Rete.Input("v3", "Vector", vectorSocket)
        const styleInput = new Rete.Input("style", "Style", styleSocket)
        const transformInput = new Rete.Input("transform", "Transform", tranformSocket)

        const deltaInput = new Rete.Input("delta", "Delta", numSocket)
        const nopsInput = new Rete.Input("nops", "Point Number", numSocket)

        const initialInput = new Rete.Input("initial", "Initial", numSocket)


        deltaInput.addControl(new NumControl(this.editor, "delta", node, false, 0.005, 0.001))
        nopsInput.addControl(new NumControl(this.editor, "nops", node, false, 2000, 50))
        initialInput.addControl(new NumControl(this.editor, "initial", node, false, 0, 0.1))

        return node
            .addInput(vInput)
            .addInput(styleInput)
            .addInput(transformInput)
            .addInput(deltaInput)
            .addInput(nopsInput)
            .addInput(initialInput)
    }

    worker(node, inputs, outputs) {

        const vector = inputs['v3'][0]
        const style = inputs['style'][0]
        const delta = inputs["delta"].length ? inputs["delta"][0] : node.data.delta
        const nops = inputs["nops"].length ? inputs["nops"][0] : node.data.nops
        const initial = inputs["initial"].length ? inputs["initial"][0] : node.data.initial

        // const transform = {rotation: [1, 2, 3]}
        const transform = inputs['transform'][0]

        // Just for testing purposes, (line below) can be deleted
        window.outputs[node.data.outputId] = {vector, style, delta, nops, initial}

        this.handler(vector, style, delta, nops, initial, transform, node.data.outputId)
    }
}
