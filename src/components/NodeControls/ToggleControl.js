import Rete from "rete";
import {ThemeProvider} from "@material-ui/core/styles";
import theme from "../../../../static/js/MUI_theme";
import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class ToggleControl extends Rete.Control {

    static component = function ({checked, onChange, label}) {

        return (
            <ThemeProvider theme={theme}>
                <FormControlLabel
                    control={<Checkbox
                        checked={checked}
                        onChange={e => onChange(e.target.checked)}
                    />}
                    label={label}/>

            </ThemeProvider>
        );
    }

    constructor(emitter, key, node, label = key) {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.component = ToggleControl.component;

        node.data[key] = false;

        this.props = {
            label: label,
            checked: false,
            onChange: v => {
                this.setValue(v);
                this.emitter.trigger("process");
            }
        };
    }

    setValue(val) {
        this.props.checked = val;
        this.putData(this.key, val)
        this.update();
    }
}

export default ToggleControl