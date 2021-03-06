// IMPORT RETE AND PLUGINS

import ConnectionPlugin from "rete-connection-plugin";
import ReactRenderPlugin from "rete-react-render-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";

// IMPORT COMPONENTS
import SphereComponent from "../NodeComponents/SphereComponent";
import CubeComponent from "../NodeComponents/CubeComponent";
import NumComponent from "../NodeComponents/NumComponent";
import AddComponent from "../NodeComponents/AddComponent";
import AnimateComponent from "../NodeComponents/AnimateComponent";
import AddFunctionsComponent from "../NodeComponents/AddFunctionsComponent";
import MultiplyFunctionsComponent from "../NodeComponents/MultiplyFunctionsComponent";
import SolidColorComponent from "../NodeComponents/SolidColorComponent";
import IndexColorComponent from "../NodeComponents/IndexColorComponent";
import MathComponent from "../NodeComponents/MathComponent";
import CustomComponent from "../NodeComponents/CustomFunctionComponent";
import OutputComponent from "../NodeComponents/OutputComponent";
import TransformComponent from "../NodeComponents/TransformComponent";
import ColorPickerComponent from "../NodeComponents/ColorPickerComponent";
import Rete from "rete";
import AudioComponent from "../NodeComponents/AudioComponent";
import ExtrusionStyleComponent from "../NodeComponents/ExtrusionStyleComponent";
import PointsStyleComponent from "../NodeComponents/PointsStyleComponent";
import { ShaderStyleComponent } from "../NodeComponents/ShaderStyleComponent";

export async function createEditor(container, outputHandler) {
  const components = [
    new NumComponent(),
    new AddComponent(),
    new MathComponent(),
    new OutputComponent(outputHandler),
    new SphereComponent(),
    new CubeComponent(),
    new CustomComponent(),
    new AddFunctionsComponent(),
    new MultiplyFunctionsComponent(),
    new AnimateComponent(),
    new SolidColorComponent(),
    new IndexColorComponent(),
    new ExtrusionStyleComponent(),
    new ShaderStyleComponent(),
    new PointsStyleComponent(),
    new TransformComponent(),
    new ColorPickerComponent(),
    new AudioComponent(),
  ];

  let editor = new Rete.NodeEditor("Spiro@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);
  editor.use(AreaPlugin);

  editor.use(ContextMenuPlugin, {
    searchBar: false,
    delay: 100,
  });

  let engine = new Rete.Engine("Spiro@0.1.0");

  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  engine.on("error", ({ message }) => {
    console.log("Engine Error: " + message);
  });

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.on("noderemove", (node) => {
    if (node.name === "Animate") {
      clearInterval(node.data.intervalId);
    } else if (node.name === "Audio") {
      clearInterval(node.data.intervalId);
    } else if (node.name === "Output") {
      delete window.outputs[node.data.outputId];
      outputHandler(
        null,
        null,
        null,
        null,
        null,
        null,
        node.data.outputId,
        "delete"
      );
    }
  });

  editor.trigger("process");
  container.parentElement && editor.view.resize();

  editor.engine = engine;

  return editor;
}
