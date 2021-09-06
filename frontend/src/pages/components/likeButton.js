import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Typography from '@material-ui/core/Typography';
import { primaryColor } from './styles';
import {
    getLike,
    postLike,
    deleteLike,
} from './api';

const useStyles = makeStyles({
    likes: {
        padding: 5,
    },
});

// const token = localStorage.getItem('token');
// console.log('====token inside like button component: ', token)



export default function likeButton({ recipeId }) {

    const classes = useStyles();
    // const [likeData, setLikeData] = useState([]);
    const [isLiked, setLike] = useState(false);
    // const [likeCount, setLikeNumb] = useState(likeData.like_count);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        getLike(localStorage.getItem('token'), recipeId).then((info) => {
            // setLikeData(info);
            // console.log('===backend like data', info);
            setLike(info.is_liked);
            setLikeCount(info.like_count);
        }).catch((err) => {
            console.log("error getting comment", err.error)
            // alert(err.error);
        })
    }, []);

    // console.log('like = ', isLiked);
    // console.log('count = ', likeCount);

    function toggleLike(event) {
        event.preventDefault();
        // console.log('=====toggle function');
        if (isLiked) { //delete like
            // console.log('start handling like delete')
            deleteLike(localStorage.getItem('token'), recipeId)
                .then(
                    response => response.text()
                ).catch((err) => {
                    // alert("cdelete like error: ", err);
                })
        } else { //post like
            // console.log('start handling like post')
            postLike(localStorage.getItem('token'), recipeId)
                .then(
                    response => response.text()
                ).catch((err) => {
                    // alert("post like error: ", err);
                })
        };
        setLike(!isLiked);
        setLikeCount(!isLiked ? likeCount + 1 : likeCount - 1);
    }

    return (
        <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className={classes.likes}>
            <IconButton aria-label="add to favorites" >

                <FavoriteIcon
                    style={{ color: !isLiked ? '' : primaryColor }}
                    onClick={toggleLike} />
            </IconButton>
            <Typography variant="body2" color="textSecondary" component="p">{likeCount}</Typography>
        </Grid>
    );
}
