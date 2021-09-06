import React, {  useState } from 'react';
import MenuBar from './components/menu';
import { useLocation } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchSelectors from './components/searchSelectors';
import RecipeReviewCard from './components/recipesCard';

const useStyles = makeStyles((theme) => ({
    root: {
        // padding: '30px'
        display: 'flex',
        flexDirection: 'column',
        zIndex: '-1'
    },
    navbar: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'rgb(249,245,241)',
    },
    textBox: {
        margin: '30px 50px',
        fontFamily: 'Roboto_Slab',
        fontSize: '1.1rem'
    },
    thumbContainer: {
        display: 'flex',
        padding: '100px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

}
))


function SearchResultsList({ recipeList }) {
    const classes = useStyles();

    return (
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
    )
}


function SelectorBar({ _title }) {
    const classes = useStyles();
    const [recipeList, setRecipeList] = useState({});

    return (
        <div className={classes.root}>
            <AppBar position={'relative'} >
                <Toolbar className={classes.navbar} >
                    <SearchSelectors _title={_title} setRecipeList={setRecipeList} />
                </Toolbar>
            </AppBar>

            <Typography variant="h7" className={classes.textBox} >
                {Object.keys(recipeList).length} results
            </Typography>
            <SearchResultsList recipeList={recipeList} />
        </div>
    )
}

export default function SearchReaults() {
    const location = useLocation();
    const title = location.state.title;

    // useEffect(() => {
    //     getSearchResult(
    //         title, lingredients, method, mealType
    //     ).then((info) => {
    //         setSearchResults(data)
    //     }).catch((err) => {
    //         console.log("getSearchResult err: " + err);
    //     })
    // }, [searchResults])

    return (
        <div>
            <MenuBar flag={true}/>
            <SelectorBar _title={title} />

        </div>
    )
}
