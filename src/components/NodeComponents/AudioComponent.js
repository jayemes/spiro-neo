import Rete from "rete";
import { max } from "lodash";
import { numSocket } from "./Sockets";
import PreviewControl from "../NodeControls/PreviewControl";
import NodeTemplate from "../Rete/NodeTemplate";

class AudioComponent extends Rete.Component {
  constructor() {
    super("Audio");
    this.data.component = NodeTemplate;
  }

  builder(node) {
    const level = new Rete.Output("level", "Level", numSocket);
    const lows = new Rete.Output("lows", "Lows", numSocket);
    const mids = new Rete.Output("mids", "Mids", numSocket);
    const highs = new Rete.Output("highs", "Highs", numSocket);

    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then((stream) => {
        console.log("Loaded");

        this.audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Uint8Array(bufferLength);
        this.source = undefined;

        this.source = this.audioCtx.createMediaStreamSource(stream);
        this.source.connect(this.analyser);

        window.localStream = stream; // A
      })
      .catch((err) => {
        console.log("u got an error:" + err);
      });

    let cb = function () {
      if (this.analyser) {
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.editor.trigger("process");
      }
    };

    this.cb = cb.bind(this);

    if (node.data.intervalId) clearInterval(node.data.intervalId);
    node.data.intervalId = setInterval(this.cb, 50);

    return node
      .addControl(new PreviewControl(this.editor, "level", node, true))
      .addControl(new PreviewControl(this.editor, "lows", node, true))
      .addControl(new PreviewControl(this.editor, "mids", node, true))
      .addControl(new PreviewControl(this.editor, "highs", node, true))
      .addOutput(level)
      .addOutput(lows)
      .addOutput(mids)
      .addOutput(highs);
  }

  worker(node, inputs, outputs) {
    const lows = this.frequencyData.slice(0, 1);
    const mids = this.frequencyData.slice(1, 13);
    const highs = this.frequencyData.slice(13, 40);

    outputs["level"] = max(this.frequencyData) / 256;
    outputs["lows"] = max(lows) / 256;
    outputs["mids"] = max(mids) / 256;
    outputs["highs"] = max(highs) / 256;

    ["level", "lows", "mids", "highs"].forEach((value) => {
      this.editor.nodes
        .find((n) => n.id === node.id)
        .controls.get(value)
        .setValue(outputs[value]);
    });
  }
}

export default AudioComponent;
