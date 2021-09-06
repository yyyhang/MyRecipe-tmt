/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */
import config from '../../config.json'

const postMethodOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify()
}

const getMethodOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify()
}

const putMethodOptions = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify()
}

const deleteMethodOptions = {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify()
}

const getJSON = (path, options) => {
  const statusCheck = /2[0-9][0-9]/
  return new Promise((resolve, reject) => {
    fetch(path, options)
      .then(res => {
        if (statusCheck.test(res.status)) {
          console.log(res.status);
          if(res.status !== 204){
            resolve(res.json())
          }
        } else {
          res.json().then((error) => {
            reject(error)
          }).catch((err) => {
            alert('Catch error:' + err);
          })
        }
      })
      .catch(err => console.log(`API_ERROR: ${err.message}`));
  });
}

/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
class API {
  /** @param {String} url */
  constructor(url) {
    this.url = url;
  }

  /** @param {String} path
   * @param option
   */
  makeAPIRequest(path, option) {
    return getJSON(`${this.url}/${path}`, option);
  }
}

const url = 'http://localhost:' + config.BACKEND_PORT;
const api = new API(url);

export const login = (accountName, password) => {
  postMethodOptions.headers.Authorization = undefined
  const info = {
    username: accountName,
    password: password
  };
  postMethodOptions.body = JSON.stringify(info);
  return api.makeAPIRequest('admin/auth/login/', postMethodOptions);
}


export const register = (accountName, nickname, email, password) => {
  postMethodOptions.headers.Authorization = undefined
  const info = {
    username: accountName,
    nick_name: nickname,
    password: password,
    email: email,
  };
  postMethodOptions.body = JSON.stringify(info);
  console.log(postMethodOptions.body);
  return api.makeAPIRequest('admin/auth/register/', postMethodOptions);
}

export const changePassword = (token, oldpassword, newpassword) => {
  putMethodOptions.headers.Authorization = 'Token ' + token;
  const info = {
    oldpassword: oldpassword,
    newpassword: newpassword,
  };
  putMethodOptions.body = JSON.stringify(info);
  return api.makeAPIRequest('admin/auth/changePassword/', putMethodOptions);
}

export const updateInfo = (token, name, email) => {
  putMethodOptions.headers.Authorization = 'Token ' + token;
  const info = {
    name: name,
    email: email,
  };
  putMethodOptions.body = JSON.stringify(info);
  return api.makeAPIRequest('admin/auth/updateInfo/', putMethodOptions);
}

export const logout = (token) => {
  console.log(token);
  postMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest('admin/auth/logout/', postMethodOptions);
}

export const createRecipe = (token, recipeTitle, ingredients, steps, cookingMethod,
  mealType, photos
) => {
  postMethodOptions.headers.Authorization = 'Token ' + token;
  const info = {
    recipe_title: recipeTitle,
    ingredients: ingredients,
    steps: steps,
    cooking_method: cookingMethod,
    meal_type: mealType,
    photo: photos,
  };
  postMethodOptions.body = JSON.stringify(info);
  return api.makeAPIRequest('admin/recipe/new/', postMethodOptions);
}

export const editRecipe = (token, recipeId, recipeTitle, ingredients, steps, cookingMethod,
  mealType, photo
) => {
  putMethodOptions.headers.Authorization = 'Token ' + token;
  const recipe = {
    recipe_title: recipeTitle,
    ingredients: ingredients,
    steps: steps,
    cooking_method: cookingMethod,
    meal_type: mealType,
    photo: photo,
  };
  console.log('what is the ', recipe);
  putMethodOptions.body = JSON.stringify(recipe);
  return api.makeAPIRequest(`admin/recipe/${recipeId}/`, putMethodOptions)
}

export const deleteRecipe = (token, recipeId) => {
  console.log(token)
  deleteMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/recipe/${recipeId}/`, deleteMethodOptions)
}

export const getRecipeList = (token, userId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/recipeall/${userId}/`, getMethodOptions)
}

export const getRecipeDetails = (token, recipeId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`recipe/${recipeId}/details/`, getMethodOptions)
}


export const userFetchNewsFeed = (token) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/newsfeed/`, getMethodOptions)
}

export const getIfSub = (token, contributorId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/ifsub/${contributorId}/`, getMethodOptions);
}

export const postSub = (token, contributorId) => {
  const info = {
    contributorId: contributorId
  };
  postMethodOptions.body = JSON.stringify(info);
  postMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`user/subscribe/`, postMethodOptions);
}

export const deleteSub = (token, contributorId) => {
  const info = {
    contributorId: contributorId
  };
  deleteMethodOptions.body = JSON.stringify(info);
  deleteMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`user/subscribe/`, deleteMethodOptions);
}

export const getLike = (token, recipeId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`recipe/${recipeId}/like`, getMethodOptions);
}

export const postLike = (token, recipeId) => {
  const info = {
    recipeId: recipeId
  };
  postMethodOptions.body = JSON.stringify(info);
  postMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`recipe/${recipeId}/like/`, postMethodOptions);
}

export const deleteLike = (token, recipeId) => {
  deleteMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`recipe/${recipeId}/like`, deleteMethodOptions);
}

export const postComment = (token, recipeId, content) => {
  const info = {
    content: content
  };
  postMethodOptions.body = JSON.stringify(info);
  postMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`recipe/comments/${recipeId}/`, postMethodOptions);
}

export const getComment = (token, recipeId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`recipe/comments/${recipeId}/`, getMethodOptions)
}

export const getFoodBasket = (token) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/foodbasket/info`, getMethodOptions)
}


export const getIfBasket = (token, recipeId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/ifinbasket/${recipeId}/`, getMethodOptions);
}

export const postBasket = (token, recipeId) => {

  postMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/addtobasket/${recipeId}/`, postMethodOptions);
}

export const deleteBasket = (token, recipeId) => {
  deleteMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/deletefrombasket/${recipeId}`, deleteMethodOptions);
}

export const clearBasket = (token) => {
  deleteMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/basketclear`, deleteMethodOptions);
}

export const getRecList = (token, recipeId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/recommendation/${recipeId}/`, getMethodOptions)
}

export const getSearchResult = (title, ingredients, method, mealType) => {
  postMethodOptions.headers.Authorization = undefined
  const info = {
    title: title,
    ingredients: ingredients,
    method: method,
    mealType: mealType,
  };
  console.log(info);
  postMethodOptions.body = JSON.stringify(info);
  return api.makeAPIRequest(`recipe/search/`, postMethodOptions)
}

export const getBasketRecipes = (token) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/viewbasketrecipes/`, getMethodOptions);
}

export const getBasketSummary = (token) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/viewbasketsummary/`, getMethodOptions);
}


export const postToBasket = (token, recipe_id) => {
  const info = {
    recipe_id: recipe_id
  };
  postMethodOptions.body = JSON.stringify(info);
  postMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/addtobasket/`, postMethodOptions);
}

export const deleteFromBasket = (token, recipe_id) => {
  const info = {
    recipe_id: recipe_id
  };
  deleteMethodOptions.body = JSON.stringify(info);
  deleteMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/deletefrombasket`, deleteMethodOptions);
}

export const getEditInfoList = (token, userId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/recipeall_prefill/${userId}/`, getMethodOptions)
}

export const getContributorProfile = (token, userId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/recipeall/${userId}/`, getMethodOptions)
}

export const getUserInfo = (token, userId) => {
  getMethodOptions.headers.Authorization = 'Token ' + token;
  return api.makeAPIRequest(`admin/user/${userId}/`, getMethodOptions)

}

export const getTop = (token) => {
  if (token != null) {
    getMethodOptions.headers.Authorization = 'Token ' + token;
  }
  return api.makeAPIRequest(`recipe/top/`, getMethodOptions)

}