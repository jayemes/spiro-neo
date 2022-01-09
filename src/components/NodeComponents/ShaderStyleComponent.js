import Rete from "rete";
import { styleSocket } from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";
import { ShaderControl } from "../NodeControls/ShaderControl";

const defaultFragment = `
varying vec3 pos;
uniform float frame;
    
void main() {
gl_FragColor = vec4((0.2 + 0.8*(pos.x)),
      (0.2 + 0.8*(pos.y)),
      (0.2 + 0.8*(pos.z)),
      1.0).rgba;
      }
                `;

export class ShaderStyleComponent extends Rete.Component {
  constructor() {
    super("Shader Style");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    let out1 = new Rete.Output("style", "Style", styleSocket);

    return node
      .addOutput(out1)
      .addControl(
        new ShaderControl(this.editor, "fragment", node, false, defaultFragment)
      );
  }

  worker(node, inputs, outputs) {
    const fragment = node.data.fragment;

    outputs["style"] = {
      type: "shader",
      fragment,
    };
  }
}
