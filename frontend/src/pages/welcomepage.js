import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuBar from './components/menu.js';
import RecipeReviewCard from './components/recipesCard.js';
import { userFetchNewsFeed, getTop, postLike, deleteLike } from './components/api';
import CardMedia from '@material-ui/core/CardMedia';
import { useHistory } from 'react-router-dom';
import { lightColor } from './components/styles.js';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { primaryColor } from './components/styles.js';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // padding: '50px',
        backgroundColor: "rgb(243,245,231)",

    },
    thumbContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    textBox: {
        margin: '20px 50px',
        fontFamily: 'Abril_Fatface',
        fontWeight: 'Bold 700',
        fontSize: '2rem',
        color: '#212121',
    },

}));

function NoSubscribetion() {
    const c = {
        root: {
            width: '100%',
            height: '100px',
            fontFamily: 'Raleway, sans-serif',
            fontSize: '2em',
            fontWeight: "800",
            marginTop: '20px',
            color: 'grey',
            display: 'flex',
            justifyContent: 'center',
        },
    }


    return (
        <div style={c.root}>
            You haven't subscribed to anyone yet~
        </div>
    )
}

function WelcomePage() {
    const classes = useStyles();
    // const token = localStorage.getItem('token');
    const [recipeList, setRecipeList] = useState({});

    useEffect(() => {
        userFetchNewsFeed(localStorage.getItem('token')).then((info) => {
            setRecipeList(info)
            console.log(recipeList)
        }).catch((err) => {
            console.log("new feeds" + err)
        })
    }, [])

    return (
        <div className={classes.root}>
            <Typography variant="h7" className={classes.textBox} >
                Your Subscription:
            </Typography>
            {console.log("helloooooo" + Object.keys(recipeList).length)}
            {Object.keys(recipeList).length === 0 ? <NoSubscribetion /> : null}
            <div className={classes.thumbContainer}>
                {recipeList ?
                    Object.keys(recipeList).map((re, index) => {
                        const recipe = recipeList[re];
                        return (
                            <RecipeReviewCard key={index}
                                recipe_id={recipe["recipe_id"]}
                                recipe_title={recipe["recipe_title"]}
                                photo={recipe["photo"]}
                                created_by_user_id={recipe["created_by_user_id"]}
                                author_name={recipe["author_name"]}
                                like_count={recipe["like_count"]}
                                is_liked={recipe["is_liked"]}
                                updated={recipe["updated"]}
                                isProfile={false}
                            />
                        )
                    })
                    : null
                }

            </div>
        </div>
    )
}

function ShowHot({ recipeList }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="h7" className={classes.textBox} >
                Hot Recipes:
            </Typography>
            <div className={classes.thumbContainer}>

                {
                    Object.keys(recipeList).map((re, index) => {
                        const recipe = recipeList[re];
                        return (
                            <RecipeReviewCard key={index}
                                recipe_id={recipe["recipe_id"]}
                                recipe_title={recipe["recipe_title"]}
                                photo={recipe["photo"]}
                                created_by_user_id={recipe["created_by_user_id"]}
                                author_name={recipe["author_name"]}
                                like_count={recipe["like_count"]}
                                is_liked={recipe["is_liked"]}
                                updated={recipe["updated"]}
                                isProfile={false}
                            />
                        )
                    })
                }

            </div>
        </div>
    )
}

function Hotest({ recipe, isAuth }) {


    const history = useHistory();

    function goToSignUp() {

        console.log("go to sign up")
        history.push('/signup', { inviteRegister: true });
    }

    const localStyle = makeStyles((theme) => ({
        root: {
            display: 'flex',
            width: '100%',
            height: '500px',
            marginTop: "64px",
            marginBottom: '8px',
            justifyContent: "space-between",
            flex: "1",
            boxShadow: "5px 5px 5px gray",
        },
        leftContainer: {
            width: '50%',
            height: "100%",
            display: 'block',

        },
        media: {
            height: '100%',
            paddingTop: '0%', // 16:9
            '&:hover': {
                cursor: 'pointer'
            },
        },
        rightContainer: {
            display: 'flex',
            height: '100%',
            width: window.innerWidth / 2,
            justifyContent: 'center',
            alignItems: 'center',
            "& > div": {
                width: "80%",
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
            }
        },
        StyleOne: {
            fontFamily: 'Raleway, sans-serif',
            fontSize: '1.2em',
            fontWeight: "600",
            marginBottom: '30px',
            color: 'grey',
            "&:hover": {
                color: lightColor,
                cursor: 'pointer',
                textDecoration: 'underline',
            }
        },
        StyleTwo: {
            display: 'flex',
            fontFamily: 'Merriweather',
            maxWidth: window.innerWidth * 0.45,
            height: 'auto',
            fontSize: '3em',
            alignContent: 'center',
            marginBottom: '30px',
            color: '#212121',
            "&:hover": {
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationColor: lightColor,
            }
        },
        StyleThree: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            "& > div": {
                marginRight: '10px',
                "&:hover":{
                    cursor: 'pointer',
                }
            }
        }
    }));

    const c = localStyle();
    const [Like, setLike] = useState(recipe.is_liked === 'True' ? true : false);
    const [LikeNumb, setNumber] = useState(recipe.like_count);

    useEffect(() => {
        console.log("******" + recipe.like_count)
        setLike(recipe.is_liked)
        setNumber(recipe.like_count)
        if (!isAuth) {
            setLike(false)
        }
    }, [recipe, Like])

    function handleLike() {
        // const token = localStorage.getItem('token');
        if (Like) {
            deleteLike(localStorage.getItem('token'), recipe.recipe_id).catch((err) => {
                console.log("delete like error: " + err);
            })
            setLike(false);
            setNumber(LikeNumb - 1)
        } else {
            postLike(localStorage.getItem('token'), recipe.recipe_id).catch((err) => {
                console.log("post like err: " + err)
            })
            setLike(true);
            setNumber(LikeNumb + 1)
        }
    }

    function handleAuthorClick(e) {
        const author_id = recipe.created_by_user_id
    
        history.push({
          pathname: '/profile',
          profile: '?id=' + author_id,
          state: { authorId: author_id }
        });
      }

    return (
        <div className={c.root}>
            <div className={c.leftContainer} onClick={isAuth ? () => { history.push('/recipeInfo', { recipe_id: recipe.recipe_id }) } : goToSignUp}>
                <CardMedia
                    className={c.media}
                    image={recipe.photo}
                    // image={"https://www.simplyrecipes.com/thmb/OCi18J2V8OeKDFV3FxoeKvgq74E=/1423x1067/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2012__07__grilled-sweet-potatoes-horiz-a-1600-7c8292daa98e4020b447f0dc97a45cb7.jpg"}
                    title={recipe.recipe_title}

                />
            </div>
            <div className={c.rightContainer}>
                <div>
                    <div className={c.StyleOne} onClick={isAuth ?  handleAuthorClick : goToSignUp}>
                        {recipe.author_name}
                    </div>
                    <div className={c.StyleTwo} onClick={isAuth ? () => { history.push('/recipeInfo', { recipe_id: recipe.recipe_id }) } : goToSignUp}>
                        {recipe.recipe_title}
                    </div>
                    <div className={c.StyleThree} onClick={isAuth ? handleLike : goToSignUp}>
                        <div>
                            {
                                Like ?
                                    <FavoriteIcon style={{ color: primaryColor }} onClick={isAuth ? handleLike : goToSignUp} /> :
                                    <FavoriteBorderOutlinedIcon style={{ color: "" }} onClick={isAuth ? handleLike : goToSignUp} />
                            }
                        </div>
                        <div>
                            {LikeNumb}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// function AdvanceSearch() {

// }

export default function HomePage(props) {
    // const token = localStorage.getItem('token');
    const [TopRecipeList, setTopRecipeList] = useState([]);
    const [HotestRecipe, setHotest] = useState({})
    const isAuth = localStorage.getItem('token') ? true : false

    useEffect(() => {
        getTop(localStorage.getItem('token')).then((info) => {
            console.log(info)
            setHotest(info[0])
            setTopRecipeList(info.slice(1))
        }).catch((err) => {
            console.log("get top recipes error: " + err)
        })
    }, [])

    return (
        <div>
            <MenuBar />
            <Hotest recipe={HotestRecipe} isAuth={isAuth} />
            {isAuth ? <WelcomePage /> : null}
            <ShowHot recipeList={TopRecipeList} isAuth={isAuth} />
        </div>
    )
}
