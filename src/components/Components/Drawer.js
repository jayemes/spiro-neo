import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from '@material-ui/core/Typography';
import PresetCard from './PresetCard'
import Box from "@material-ui/core/Box";
import theme from "../../MUI_theme";

const useStyles = makeStyles({
    list: {
        width: 300,
    }
});


export default function TemporaryDrawer(props) {
    const classes = useStyles()

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({...state, [anchor]: open});
    };

    const list = (anchor) => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box style={{padding: '20px 0 20px 0'}}>
                <Typography style={{color: theme.palette.primary.contrastText}} align='center' variant="h5" component="h2">
                    Presets
                </Typography>
            </Box>

            <Divider/>

            {props.data.presets.map((it, idx) => <PresetCard data={it} key={idx} handler={props.data.handler}/>)}

        </div>
    );

    let anchor = 'left'
    return (

        <React.Fragment>
            <Button variant="contained" color="primary" onClick={toggleDrawer(anchor, true)}>Presets</Button>
            <Drawer
                PaperProps={{style: {background: theme.palette.primary.dark}}}
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)
                }
            >
                {list(anchor)}
            </Drawer>
        </React.Fragment>


    );
}
