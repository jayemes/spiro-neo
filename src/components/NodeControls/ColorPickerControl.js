import Rete from "rete";
import {ThemeProvider} from "@material-ui/core/styles";
import theme from "../../../../static/js/MUI_theme";
import React from "react";
import {SketchPicker} from 'react-color'

export default class ColorPickerControl extends Rete.Control {

    static component = function ({color, onChange}) {

        return (
            <ThemeProvider theme={theme}>
                <SketchPicker color={color} onChange={onChange}/>
            </ThemeProvider>
        );
    }

    constructor(emitter, key, node, readonly = false) {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.component = ColorPickerControl.component;

        const initial = node.data[key] || {rgb: {r: 100, g: 100, b: 200, a: 1}}

        node.data[key] = initial;

        this.props = {
            readonly,
            color: initial,
            onChange: (color, event) => {
                this.handleChange(color, event);
                this.emitter.trigger("process");
            }
        };
    }

    handleChange(color, event) {
        this.props.color = color
        this.putData(this.key, color)
        this.update();
    }

}
