import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


export default function PresetCard(props) {
    const color = useTheme().palette.primary

    const useStyles = makeStyles({
        root: {
            maxWidth: 300,
            background: color.light,
            margin: 5
        },
        media: {
            height: 20,
        },
    });
    const classes = useStyles();

    const handleClick = function(){
        props.handler(props.data)
    }            

    return (
        <Card className={classes.root} onClick={handleClick}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        {props.data.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.data.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
