import React from "react";
import {
    makeStyles,
    Grid,
    Avatar,
    Typography,
} from '@material-ui/core';
import { lightColor } from './styles';


const useStyles = makeStyles({
    listComment: {
        margin: 10,
    },
    avatar: {
        backgroundColor: lightColor,
        // '&:hover': {
        //     cursor: 'pointer'
        // }
    },
});

export default function comment({ nickName, content }) {
    const classes = useStyles();
    // console.log('====basketRecipe got ', recipeName, ingredients)
    return (
        <div>
            <Grid
                container
                justifyContent="left"
                spacing={2}
                // key={key}
                className={classes.listComment}>
                <Grid item>
                    <Avatar className={classes.avatar}>
                        {nickName.charAt(0)}
                    </Avatar>
                </Grid>
                <Grid item xs zeroMinWidth>
                    <Typography Typography variant="h6">
                        {nickName}
                    </Typography>
                    <Typography Typography variant="body">
                        {content}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}
