import Rete from "rete";
import TextField from "@material-ui/core/TextField";
import React from "react";
import theme from "../../MUI_theme";
import { ThemeProvider } from "@material-ui/core/styles";

class FunctionControl extends Rete.Control {
  static component = ({ value, onChange, fontColor, label }) => (
    <ThemeProvider theme={theme}>
      <TextField
        variant="outlined"
        size="small"
        color="secondary"
        label={label}
        inputProps={{
          type: "text",
          style: { color: fontColor },
        }}
        ref={(ref) => {
          ref &&
            ref.addEventListener("pointerdown", (e) => e.stopPropagation());
        }}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </ThemeProvider>
  );

  constructor(
    emitter,
    key,
    node,
    readonly = false,
    defVal = "Math.sin(Math.PI))"
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = FunctionControl.component;

    const initial = node.data[key] || defVal;

    node.data[key] = initial;
    this.props = {
      label: key,
      fontColor: "black",
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      },
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  setColor(color) {
    this.props.fontColor = color;
    this.update();
  }
}

export default FunctionControl;
