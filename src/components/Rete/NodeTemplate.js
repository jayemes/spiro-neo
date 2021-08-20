import React from "react";
import {Control, Node} from "rete-react-render-plugin";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
// import Avatar from "@material-ui/core/Avatar";
// import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import {MuiThemeProvider} from "@material-ui/core";
import theme from "../../../../static/js/MUI_theme";
import SocketTemplate from "./SocketTemplate";

export default class NodeTemplate extends Node {

    render() {

        const {node, bindSocket, bindControl} = this.props;
        const {outputs, controls, inputs} = this.state;

        return (
            <MuiThemeProvider theme={theme}>
                <Card style={{minWidth: 200}}>
                    <CardHeader style={{padding: '10px 10px 0px 10px'}}
                        // avatar={<Avatar> {node.name[0]}</Avatar>}
                        // action={<IconButton aria-label="settings">+</IconButton>}
                        title={node.name}/>

                    <CardContent style={{padding: '0 8px'}}>
                        {outputs.map(output => (
                            <Grid container key={output.key} alignItems="baseline" justify="flex-end" spacing={0}>
                                <Grid item>
                                    <Typography variant="body1" color="textPrimary">
                                        {output.name}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <SocketTemplate
                                        type="output"
                                        socket={output.socket}
                                        io={output}
                                        innerRef={bindSocket}
                                        style = {{background: theme.palette.primary}}
                                    />
                                </Grid>

                            </Grid>
                        ))}

                        {controls.map(control => (
                            <Control
                                className="control"
                                key={control.key}
                                control={control}
                                innerRef={bindControl}
                            />
                        ))}

                        {inputs.map(input => (
                            <Grid container className="input" key={input.key}
                                  alignItems="center" justify="flex-start"
                                  spacing={0} style={{height: '60px'}}>
                                <Grid item>
                                    <SocketTemplate
                                        type="input"
                                        socket={input.socket}
                                        io={input}
                                        innerRef={bindSocket}
                                    />
                                </Grid>

                                <Grid item >
                                    {!input.showControl() && (
                                        <div className="input-title">{input.name}</div>
                                    )}
                                    {input.showControl() && (
                                        <Control
                                            className="input-control"
                                            control={input.control}
                                            innerRef={bindControl}
                                        />
                                    )}
                                </Grid>


                            </Grid>
                        ))}

                    </CardContent>


                </Card>
            </MuiThemeProvider>


        )
    }
}
