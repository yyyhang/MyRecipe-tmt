import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import SignIn from "./pages/login";
import Register from "./pages/register";
import HomePage from "./pages/welcomepage";
import NewsFeed from "./pages/newsfeed";
import CreateRecipe from "./pages/createRecipe";
import FoodBasket from "./pages/foodBasket";
import Profile from "./pages/myProfile";
import EditMyProfile from "./pages/editMyProfile";
import RecipeInfo from "./pages/recipeInfo";
import SearchReaults from "./pages/showSearchResults";
import EditRecipe from "./pages/editRecipe";

function App() {
  return (
    <Router>
      <Switch>
      <Route exact path="/" component={HomePage} />
        <Route path="/home" component={HomePage} />
        <Route path="/login" component={SignIn} />
        <Route path="/signup" component={Register} />
        <Route path='/newsfeed' component={NewsFeed} />
        <Route path='/createRecipe' component={CreateRecipe} />
        <Route path='/foodbasket' component={FoodBasket} />
        <Route path='/profile' component={Profile} />
        <Route path='/recipeInfo' component={RecipeInfo} />
        <Route path='/editMyProfile' component={EditMyProfile} />
        <Route path='/search' component={SearchReaults}/>
        <Route path='/editRecipe' component={EditRecipe}/>
      </Switch>
    </Router>
  );
}

export default App;