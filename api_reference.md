# API Reference

### Summary of endpoints sample data exchange

### **`POST /recipe/search/`**

**Token**: Needed

**Sample Parameters:**
```
{
    "title":"egg pork sardines fried",
    "ingredients":"pork",
    "method":"Fried",
    "mealType":"dinner"
}
```

**Sample Response**:
```
{
    "0": {
        "recipe_id": 5,
        "recipe_title": "fried egg",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVEhESFR",
        "created_by_user_id": 4,
        "updated": "2021-07-17T12:15:23.238Z",
        "author_name": "apple",
        "like_count": 0,
        "is_liked": "False"
    },
    "1": {
        "recipe_id": 2,
        "recipe_title": "Slow cooker French onion pork roast",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVEhESFR",
        "created_by_user_id": 2,
        "updated": "2021-07-17T08:05:17.124Z",
        "author_name": "lemon",
        "like_count": 0,
        "is_liked": "False"
    },
    "2": {
        "recipe_id": 3,
        "recipe_title": "fried sardines",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVEhESFR",
        "created_by_user_id": 2,
        "updated": "2021-07-17T08:07:21.841Z",
        "author_name": "lemon",
        "like_count": 3,
        "is_liked": "True"
    }
}
```

### **`GET /recipe/comments/:recipe_id/`**

**Token**: Whatever

**Description**: show all comments under a specific recipe

**Sample Response**:
```
[
    {
        "id": 1,
        "recipe_id": 1,
        "content": "OMG, I love it",
        "created_date": "2021-07-19T08:22:11.092Z",
        "created_by_user_id": 1
    },
    {
        "id": 2,
        "recipe_id": 1,
        "content": "yummy",
        "created_date": "2021-07-19T08:22:11.092Z",
        "created_by_user_id": 2
    }
]
```

### **`POST /recipe/comments/:recipe_id/`**

**Token**: Needed

**Description**: post a comment

**Sample Parameters:**
```
{"content":"OMG, I love it"}
```

### **`DELETE /recipe/comments/:recipe_id/`**

**Token**: Needed

**Description**: delete a specific comment by the user

**Sample Parameters:**
```
{"commentId":"1"}
```


### **`GET /recipe/:recipe_id/like/`**

**Token**: Needed

**Description**: show like count and whether the user liked for a specific recipe

**Sample Response:** 

```
{
    "recipe_id": 4,
    "is_liked": true,
    "like_count": 1
}
```


### **`POST /recipe/:recipe_id/like/`**

**Token**: Needed

**Description**: like a specific recipe

**Sample Parameters:**
```
{"content":"OMG, I love it"}
```

### **`DELETE /recipe/:recipe_id/like/`**

**Token**: Needed

**Description**: unlike a specific recipe

**Sample Parameters:** Not Needed


### **`GET /user/subscribe/`**

**Token**: Needed

**Description**: show all subscription of user self

**Sample Response:** 

```
[
    {
        "id": 1,
        "contributor_id": 1,
        "subscriber_id": 4
    },
    {
        "id": 6,
        "contributor_id": 3,
        "subscriber_id": 4
    }
]
```

### **`POST /user/subscribe/`**

**Token**: Needed

**Description**: subscribe to specific contributor

**Sample Parameters:**
```
{
    "contributorId":"3"
}
```

### **`DELETE /user/subscribe/`**

**Token**: Needed

**Description**: cancel subscription to specific contributor

**Sample Parameters:**
```
{
    "contributorId":"3"
}
```

### **`GET /admin/recipeall/:user_id/`**

**Token**: Needed

**Description**: fecth all published recipes by user's id

**Sample Response**:
```
[
    {
        "recipe_id": 2,
        "recipe_title": "Slow cooker French onion pork roast",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVEhESFR",
        "created_by_user_id": 2,
        "updated": "2021-07-17T08:05:17.124Z",
        "author_name": "lemon",
        "like_count": 0,
        "is_liked": "False"
    },
    {
        "recipe_id": 3,
        "recipe_title": "fried sardines",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVEhESFR",
        "created_by_user_id": 2,
        "updated": "2021-07-17T08:07:21.841Z",
        "author_name": "lemon",
        "like_count": 0,
        "is_liked": "False"
    },
    {
        "recipe_id": 4,
        "recipe_title": "Inside-out scotch eggs",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVEhESFR",
        "created_by_user_id": 2,
        "updated": "2021-07-17T08:11:06.854Z",
        "author_name": "lemon",
        "like_count": 1,
        "is_liked": "True"
    }
]
```

### **`GET /admin/recipe/list/`**

**Token**: Needed

**Description**: fecth all published recipes by userself

**Sample Response**:
```
[
    {
        "recipe_id": 1,
        "recipe_title": "Fresh beetroot salad with egg mimosa",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVEhESFR",
        "created_by_user_id": 1,
        "updated": "2021-07-17T08:02:55.014Z",
        "author_name": "potato",
        "like_count": 0,
        "is_liked": "False"
    }
]
```



### **`GET recipe/top/`**

**Token**: No needed

**Description**: fecth top most liked recipes

**Sample Response**:
```
[
    {
        "recipe_id": 4,
        "recipe_title": "Smoking fish with mushroom",
        "photo": "https://firebasestorage.googleapis.com/v0/b/myrecipe-images.appspot.com/o/recipes%2F15647866?alt=media",
        "created_by_user_id": 3,
        "updated": "2021-07-20T05:00:54.207Z",
        "author_name": "apple",
        "like_count": 4
    },
    {
        "recipe_id": 3,
        "recipe_title": "fried eggplant",
        "photo": "https://firebasestorage.googleapis.com/v0/b/myrecipe-images.appspot.com/o/recipes%2F98765432?alt=media",
        "created_by_user_id": 2,
        "updated": "2021-07-19T13:47:32.967Z",
        "author_name": "demo_b_2_nickname",
        "like_count": 3
    },
    ...
]
```


### **`GET admin/user/:user_id/`**

**Token**: Needed

**Description**: get the user info and subscription status

**Sample Response**:
```
[
    {
        "id": 3,
        "email": "demotest@gmail.com",
        "nick_name": "apple",
        "is_subscribed": false
    }
]
```


### **`GET recipe/:recipe_id/details/`**

**Token**: Not Needed

**Description**: recipe infos

**Sample Response**:
```
[
    {
    "recipe_id": 1,
    "created_by_user": 1,
    "recipe_title": "boil egg",
    "ingredients": {
        "1": {
            "name": "eggs",
            "units": "",
            "amount": "5"}
        }
    "steps": {
        "1": {
            "data": "boil egg for 5 mins."
        }
    }
    "cooking_method": "Boiling",
    "meal_type": "Main",
    "photo": "https://firebasestorage.googleapis.com/v0/b/myrecipe-images.appspot.com/o/myrecipes%2F125-07-2021-16-35-10?alt=media",
    "updated": "2021-07-25T16:35:12.006Z",
    "nick_name": "Lumberjack"
    
]
```

### **`POST admin/recipe/new/`**

**Token**: Needed

**Description**: post recipe to database

**Sample Parameters:**
```
{
    {
    "recipe_id": 1,
    "recipe_title": "boil egg",
    "ingredients": {
        "1": {
            "name": "eggs",
            "units": "",
            "amount": "5"}
        }
    "steps": {
        "1": {
            "data": "boil egg for 5 mins."
        }
    }
    "cooking_method": "Boiling",
    "meal_type": "Main",
}
```

### **`DELETE admin/recipe/:user_id`**

**Token**: Needed

**Description**: delete recipe from database

**Sample Parameters:**
```
{
    "recipe_id": 1
}
```


### **`GET admin/newsfeed/`**

**Token**: Needed

**Description**: fecth recipes newsfeed sortby :  date, total_like_to_contributor, time

**Sample Response**:
```
[
{
    "0": {
        "recipe_id": 3,
        "recipe_title": "Poached eggs with smoked salmon and bubble & squeak",
        "photo": "https://firebasestorage.googleapis.com/v0/b/myrecipe-images.appspot.com/o/myrecipes%2F125-07-2021-16-42-09?alt=media",
        "created_by_user_id": 3,
        "updated": "2021-07-23T14:42:10.197Z",
        "author_name": "Melissa",
        "like_count": 0,
        "is_liked": false
    },
    "1": {
        "recipe_id": 1,
        "recipe_title": "Zucchini slice",
        "photo": "https://firebasestorage.googleapis.com/v0/b/myrecipe-images.appspot.com/o/myrecipes%2F125-07-2021-16-35-10?alt=media",
        "created_by_user_id": 1,
        "updated": "2021-07-23T10:35:12.006Z",
        "author_name": "Lumberjack",
        "like_count": 0,
        "is_liked": false
    },
]
```

### **`GET admin/ifsub/:contributor_id`**

**Token**: Needed

**Description**: check if user subscribed this contributor

**Sample Response**:
```
{
    "ifSub": true
}
```

### **`GET admin/recommendation/:recipe_id/`**

**Token**: Needed

**Description**: fecth recipes similar to reference recipe based on ingredient jaccard similarity

**Sample Response**:
```
[
{
    "0": {
        "recipe_id": 3,
        "recipe_title": "Poached eggs with smoked salmon and bubble & squeak",
        "photo": "https://firebasestorage.googleapis.com/v0/b/myrecipe-images.appspot.com/o/myrecipes%2F125-07-2021-16-42-09?alt=media",
        "created_by_user_id": 3,
        "updated": "2021-07-23T14:42:10.197Z",
        "author_name": "Melissa",
        "like_count": 0,
        "is_liked": false
    },
    "1": {
        "recipe_id": 1,
        "recipe_title": "Zucchini slice",
        "photo": "https://firebasestorage.googleapis.com/v0/b/myrecipe-images.appspot.com/o/myrecipes%2F125-07-2021-16-35-10?alt=media",
        "created_by_user_id": 1,
        "updated": "2021-07-23T10:35:12.006Z",
        "author_name": "Lumberjack",
        "like_count": 0,
        "is_liked": false
    },
]
```

### **`POST admin/addtobasket/:recipe_id`**

**Token**: Needed

**Description**: add the recipe to this user's basket

**Sample Response**:
```
{
    "addtobasket": "already in basket"
}
Or 
{
    "addtobasket": "added"
}
```

### **`DELETE admin/deletefrombasket/:recipe_id`**

**Token**: Needed

**Description**: delete the recipe from this user's basket

**Sample Response**:
```
{
    "deletefrombasket" : "not in the basket"
}
Or 
{
    "deletefrombasket" : "deleted from basket"
}
```

### **`GET admin/ifinbasket/:recipe_id`**

**Token**: Needed

**Description**: check if the recipe is in this user's basket

**Sample Response**:
```
{
    "ifBasket": true
}
Or 
{
    "ifBasket": false
}
```

### **`DELETE admin/basketclear`**

**Token**: Needed

**Description**: clear all the recipe from this user's basket

**Sample Response**:
```
{
    "basketclear" : "all basket items deleted"
}
```

### **`GET admin/viewbasketrecipes`**

**Token**: Needed

**Description**: get a brief only showing recipe title and its ingredents from this user's basket

**Sample Response**:
```
{
    {
    "0": {
        "recipe_id": 11,
        "recipe_title": "Bengali roast chicken",
        "ingredients": {
            "1": {
                "name": "bone-in chicken thighs or drumsticks, flesh scored ",
                "units": "",
                "amount": "4-6"}
            }
        }
    }
}
```


### **`GET admin/viewbasketsummary`**

**Token**: Needed

**Description**: get ingredient summary from all the recipes from this user's basket

**Sample Response**:
```
{
    "mild curry powder ": {
        "1": {
            "unit": "spoons",
            "amount": "3.0"
        }
    },
    "turmeric": {
        "1": {
            "unit": "spoons",
            "amount": "1"
        }
    },
}
```
