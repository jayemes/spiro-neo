import Rete from "rete";
import {ThemeProvider} from "@material-ui/core/styles";
import theme from "../../MUI_theme";
import TextField from "@material-ui/core/TextField";
import React from "react";

class NumControl extends Rete.Control {

    static component = function ({value, onChange, step, label, hasError = false}) {

        return (
            <ThemeProvider theme={theme}>
                <TextField variant='outlined' size='small' error={hasError} color='secondary'
                           label={label}
                           inputProps={{
                               'type': "number",
                               'step': step,
                           }}
                           ref={ref => {
                               ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
                           }}
                           onChange={e => onChange(e.target.value)}
                           value={value}
                />
            </ThemeProvider>
        );
    }

    constructor(emitter, key, node, readonly = false, defVal = 1, step = 0.1) {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.component = NumControl.component;

        const initial = node.data[key] || defVal;

        node.data[key] = initial;
        this.props = {
            label: key,
            step: step,
            readonly,
            value: initial,
            onChange: v => {
                this.setValue(v);
                this.emitter.trigger("process");
            }
        };
    }

    setValue(val) {

        if(!val) {
            this.props.hasError = true
            this.props.value = val
            // this.putData(this.key, 0.01)
        } else {
            this.props.hasError = false
            this.props.value = val;
            this.putData(this.key, parseFloat(val))

        }
        this.update();

    }
}

export default NumControl