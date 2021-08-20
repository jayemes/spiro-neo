import Rete from "rete";
import {numSocket, vectorSocket} from "./Sockets";
import NumControl from "../NodeControls/NumControl";
import NodeTemplate from "../Rete/NodeTemplate";

export class CubeComponent extends Rete.Component {
    constructor() {
        super("Cube");
        this.data.component = NodeTemplate
    }

    builder(node) {
        const out1 = new Rete.Output("v3", "Vector", vectorSocket);
        const inpRad = new Rete.Input("rad", "Radius", numSocket)
        const inpK = new Rete.Input("k", "K", numSocket)

        inpRad.addControl(new NumControl(this.editor, "rad", node,false, 50, 1))
        inpK.addControl(new NumControl(this.editor, "k", node, false, 7, 0.1))

        return node
            .addOutput(out1)
            .addInput(inpRad)
            .addInput(inpK)
    }

    worker(node, inputs, outputs) {
        const r = inputs["rad"].length ? inputs["rad"][0] : node.data.rad
        const k = inputs["k"].length ? inputs["k"][0] : node.data.k

        outputs["v3"] = {
            x: function (i) {
                return r * Math.sin(i) * Math.cos(k * i) / Math.pow(Math.pow(Math.sin(i), 6) * (Math.pow(Math.sin(k * i), 6) + Math.pow(Math.cos(k * i), 6)) + Math.pow(Math.cos(i), 6), 1 / 6);
            },
            y: function (i) {
                return r * Math.sin(i) * Math.sin(k * i) / Math.pow(Math.pow(Math.sin(i), 6) * (Math.pow(Math.sin(k * i), 6) + Math.pow(Math.cos(k * i), 6)) + Math.pow(Math.cos(i), 6), 1 / 6);
            },
            z: function (i) {
                return r * Math.cos(i) / Math.pow(Math.pow(Math.sin(i), 6) * (Math.pow(Math.sin(k * i), 6) + Math.pow(Math.cos(k * i), 6)) + Math.pow(Math.cos(i), 6), 1 / 6);
            }
        }
    }
}

export default CubeComponent