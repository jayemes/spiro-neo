import Rete from "rete";
import {mean} from "lodash"
import {numSocket} from "./Sockets";
import PreviewControl from "../NodeControls/PreviewControl";
import ToggleControl from "../NodeControls/ToggleControl";
import NodeTemplate from "../Rete/NodeTemplate";


class AudioComponent extends Rete.Component {

  constructor() {
    super("Audio");
    this.data.component = NodeTemplate

    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then(stream => {
      console.log("Loaded")

      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.source = undefined;

      this.source = this.audioCtx.createMediaStreamSource(stream);
      this.source.connect(this.analyser);

      window.localStream = stream; // A

    }).catch(err => {
      console.log('u got an error:' + err)
    });

  }

  getData() {
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  builder(node) {
    const out = new Rete.Output("num", "Level", numSocket);

    let cb = function () {
      this.getData()
      this.editor.trigger("process")
    }

    this.cb = cb.bind(this)

    if (node.data.intervalId) clearInterval(node.data.intervalId)
    node.data.intervalId = setInterval(this.cb, 50)

    return node
      .addControl(new PreviewControl(this.editor, "preview", node, true))
      .addControl(new ToggleControl(this.editor, "micAccess", node, "Mic Access"))
      .addOutput(out)
  }

  worker(node, inputs, outputs) {

    outputs["num"] = mean(this.dataArray);

    this.editor.nodes
      .find(n => n.id === node.id)
      .controls.get("preview")
      .setValue(outputs["num"])

  }
}

export default AudioComponent