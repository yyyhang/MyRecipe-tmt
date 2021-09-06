import React, { useEffect, useState, useRef } from 'react';
import MenuBar from "./components/menu";
import LikeButton from './components/likeButton';
import Comment from './components/comment';
import SubscribeButton from './components/subscribeButton';
import AddToBasket from './components/addToBasket';
import RecipeReviewCard from './components/recipesCard.js';
import { lightColor } from './components/styles';

import {
    getRecipeDetails,
    postComment,
    getComment,
    getRecList,
} from './components/api';

import {
    makeStyles,
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    Button,
    Typography,
    Container,
    Chip,
    Grid,
    Avatar,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
} from '@material-ui/core';

const useStyles = makeStyles({
    container: {
        justifyContent: 'center',
    },
    banner: {
        margin: 20,
    },
    media: {
        height: 500,
    },
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: 5,
        },
    },
    divider: {
        margin: 20,
    },
    myCommentAvatar: {
        margin: '15px 0 0 0',
    },
    createComment: {
        margin: 9,
    },
    recommendCards: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    avatar: {
        backgroundColor: lightColor,
        // '&:hover': {
        //     cursor: 'pointer'
        // }
    },
});

// transfer json from backend to array to pass to elements
function transferFormat(object) {
    let i = 1;
    let array = [];
    for (const key in object) {
        object[key].n = i;
        array.push(object[key]);
        i += 1;
    }
    return array;
}

const myName = localStorage.getItem('nickname');

export default function Recipe(props) {
    const recipeId = props.location.state.recipe_id;

    const classes = useStyles();
    const [resultList, setResultList] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [recList, setRecList] = useState([]);
    const [newComment, setNewCommment] = useState([]);
    const [commentLen, setCommentLen] = useState([]);
    const commentRef = useRef('');

    function handlePostComment(event) {
        event.preventDefault();
        const commentText = commentRef.current.value;

        postComment(localStorage.getItem('token'), recipeId, commentText)
        // .then(
        //     response => response.text()
        // ).catch((err) => {
        //     alert("comment submit error: ", err);
        // })
        commentRef.current.value = '';
        setNewCommment(newComment.concat(
            <Comment nickName={myName} content={commentText} />
        ));
        setCommentLen(commentLen + 1)
    }

    useEffect(() => {
        getRecipeDetails(localStorage.getItem('token'), recipeId).then((info) => {
            setResultList(info);
        }).catch((err) => {
            console.log("error getting recipe details", err.error)
        });

        getComment(localStorage.getItem('token'), recipeId).then((info) => {
            setCommentList(info);
            setCommentLen(info.length)
        }).catch((err) => {
            console.log("error getting comment", err.error)
            alert(err.error);
        });

        getRecList(localStorage.getItem('token'), recipeId).then((info) => {
            setRecList(info);
        }).catch((err) => {
            alert("error getting recommand list: ", err);
        })

    }, []);

    const transferredSteps = transferFormat(resultList.steps);

    return (
        <div >
            <MenuBar />
            <Card className={classes.banner}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={resultList.photo}
                        title="banner"
                    />
                </CardActionArea>
                <CardActions>
                    <Grid item xs>
                        <Typography Typography gutterBottom variant="h5" component="h2">
                            {resultList.recipe_title}
                        </Typography>
                        <div className={classes.chipContainer}>
                            <Chip variant="outlined" size="small" label={resultList.meal_type} />
                            <Chip variant="outlined" size="small" label={resultList.cooking_method} />
                        </div>


                    </Grid>
                    <Grid item>

                        <LikeButton recipeId={recipeId} />
                    </Grid>
                </CardActions>
            </Card>
            <Container maxwidth='sm' className={classes.container}>
                    <div className={classes.contributor}>
                        <Grid container alignItems="center" spacing={3}>
                            <Grid item>
                                <Avatar className={classes.avatar}>
                                    {resultList.nick_name ? resultList.nick_name.charAt(0) : ''}
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography Typography variant="h6">
                                    {resultList.nick_name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                {console.log('contributor id= ', resultList.created_by_user)}
                                {console.log('my id= ', localStorage.getItem("userId"))}
                                {
                                    resultList.created_by_user === localStorage.getItem("userId")?
                                        <SubscribeButton contributor={resultList.created_by_user} /> : null
                                }
                            </Grid>
                        </Grid>
                        <Divider variant="middle" className={classes.divider} />
                    </div>
                <div className={classes.ingredients}>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography Typography variant="h6">
                                Ingredients
                            </Typography>
                        </Grid>
                        <Grid item>
                            <AddToBasket recipe={recipeId} />
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="center" >
                        <Grid item xs={8}>
                            <TableContainer >
                                <Table className={classes.table} size="small" aria-label="simple table">
                                    <TableBody>
                                        {resultList.ingredients && Object.values(resultList.ingredients).map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.amount}</TableCell>
                                                <TableCell>{row.units}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Divider variant="middle" className={classes.divider} />
                </div>
                <div className={classes.steps}>
                    <Typography Typography variant="h6">
                        Steps
                    </Typography>
                    <Grid container justifyContent="center" >
                        <Grid item xs={10}>
                            <TableContainer >
                                <Table className={classes.table} aria-label="simple table">
                                    <TableBody>
                                        {transferredSteps.map((row) => (
                                            <TableRow key={row.n}>
                                                <TableCell>{row.n}</TableCell>
                                                <TableCell>{row.data}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Divider variant="middle" className={classes.divider} />
                </div>
                <div className={classes.comments}>
                    <Typography Typography variant="h6">
                        {commentLen} Comments
                    </Typography>
                    {commentList.map((data, key) => {
                        return (
                            <Comment nickName={data.nick_name} content={data.content} />
                        );
                    })}
                    {newComment}
                    <Grid container justifyContent="left" spacing={2} className={classes.createComment}>
                        <Grid item className={classes.myCommentAvatar}>
                            <Avatar  className={classes.avatar}>
                                {myName ? myName.charAt(0) : ''}
                                </Avatar>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <TextField
                                className={classes.inputComment}
                                placeholder="Add your comment"
                                fullWidth
                                multiline
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                inputRef={commentRef}
                            />
                            <Button type="save"
                                onClick={handlePostComment}
                                variant="contained" color='primary' size="small">
                                Post
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider variant="middle" className={classes.divider} />
                </div>
                <div className={classes.recommend}>
                    <Typography Typography variant="h6">
                        Other delicious idea for you...
                    </Typography>
                    <div className={classes.recommendCards}>
                        {
                            recList && Object.values(recList).map((item, index) => {
                                const { recipe_title, updated, photo, recipe_id, created_by_user_id, author_name, like_count, is_liked } = item;
                                return (
                                    <RecipeReviewCard key={index}
                                        recipe_id={recipe_id}
                                        recipe_title={recipe_title}
                                        photo={photo}
                                        created_by_user_id={created_by_user_id}
                                        author_name={author_name}
                                        like_count={like_count}
                                        is_liked={is_liked}
                                        updated={updated}
                                        isProfile={false}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
}