import Rete from "rete";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../../MUI_theme";
import TextField from "@material-ui/core/TextField";
import React from "react";

class PreviewControl extends Rete.Control {
  static component = function ({ value, onChange, label, hasError = false }) {
    return (
      <ThemeProvider theme={theme}>
        <TextField
          variant="outlined"
          size="small"
          error={hasError}
          color="secondary"
          label={label}
          style={{ width: 120 }}
          inputProps={{
            type: "text",
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
  };

  constructor(emitter, key, node, readonly = false, defVal = 1) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = PreviewControl.component;

    const initial = node.data[key] || defVal;

    node.data[key] = initial;
    this.props = {
      label: key,
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      },
    };
  }

  setValue(val) {
    this.props.value = val.toFixed(3);
    this.putData(this.key, val);
    this.update();
  }
}

export default PreviewControl;
