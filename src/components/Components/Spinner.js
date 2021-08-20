import React from 'react'
import {CircularProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'fixed',
        background: "white",
        width: '20vmin',
        height: '20vmin',
        left: 'calc(50vw - 10vmin)',
        top: 'calc(50vh - 10vmin)',
        borderRadius: '4vmin',

        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
    }
}));

export default function () {
    const classes = useStyles()

    return (

        <div className={classes.container}>
            <CircularProgress/>
        </div>

    )
}