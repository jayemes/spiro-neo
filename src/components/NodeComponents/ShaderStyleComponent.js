import Rete from "rete";
import { styleSocket } from "./Sockets";
import NodeTemplate from "../Rete/NodeTemplate";
import { ShaderControl } from "../NodeControls/ShaderControl";

const defaultFragment = `
varying vec3 _position;
varying vec3 _normal;
varying vec2 _uv;
uniform float frame;
    
void main() {
gl_FragColor = vec4((0.2 + 0.8*(_position.x)),
      (0.2 + 0.8*(_position.y)),
      (0.2 + 0.8*(_position.z)),
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
