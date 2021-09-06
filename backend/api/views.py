from .models import *
from datetime import datetime
from collections import Counter
import json
import time
import os
import base64
import difflib
import pytz

from knox.models import AuthToken
from pyrebase.pyrebase import Storage, Firebase

from rest_framework import permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.db.models import Q, F, Count, Case, When, Value
from django.core.serializers.json import DjangoJSONEncoder
from django.db import connection

from .serializers import *
from .models import Comment
from .models import Recipe_info_model
from .models import Like
from .models import Subscription

from django.contrib.auth import get_user_model

# set timezone to Sydney
os.environ['TZ'] = 'Australia/Sydney'
time.tzset()

##### Photo Storage ######

config = {
    "apiKey": "**OfN9XjM4KvWbc3WMUtDdjQ4WdDk",
    "authDomain": "myrecipe-images.firebaseapp.com",
    "projectId": "myrecipe-images",
    "storageBucket": "myrecipe-images.appspot.com",
    "messagingSenderId": "**7105018715",
    "serviceAccount": "myrecipe.json",
    "appId": "1:****:web:377a7175b0cf07fe37c47e",
    "measurementId": "****",
    "databaseURL": ""
}

# Override class from Pyrebase
class NewFireBase(Firebase):
    def __init__(self, config):
        super().__init__(config)

    def storage(self):
        return FireStorage(self.credentials, self.storage_bucket, self.requests)

class FireStorage(Storage):
    def __init__(self, credentials, storage_bucket, requests):
        super().__init__(credentials, storage_bucket, requests)

    def put(self, file, token=None):
        path = self.path
        self.path = None
        file_object = file
        request_ref = self.storage_bucket + "/o?name={0}".format(path)
        request_object = self.requests.post(request_ref, data=file_object)
        return request_object.json()

app = NewFireBase(config)
storage = app.storage()


##### Customed User ######

User = get_user_model()

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # send comfirmation email to the new user
        # user.email_user("Thanks for registering MyRecipe", "Register Successfully! Just for test though :) ", from_email="myrecipe@gmx.com", **kwargs)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class PasswordChangeAPI(generics.GenericAPIView):
    # serializer_class = PasswordSerializer

    def put(self, request, *args, **kwargs):
        # serializer = self.get_serializer(data=request.data)
        permission_classes = [permissions.IsAuthenticated, ]
        data = request.data
        user = self.request.user
        # hash password
        if user.check_password(data["oldpassword"]) == False:
            return Response(status=401, data={"message": "The old password is not correct."})
        user.set_password(data["newpassword"])
        user.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data
        })


class InfoChangeAPI(generics.GenericAPIView):

    def put(self, request, *args, **kwargs):
        permission_classes = [permissions.IsAuthenticated, ]
        data = request.data
        # get the user object and change field
        user = self.request.user
        user.nick_name = data["name"]
        user.email = data["email"]
        user.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


##### Recipe ######


class RecipeAPI (generics.GenericAPIView):
    def post(self, request, *args, **kwargs): # post recipe
        data = request.data  # data now is a json file
        user = self.request.user  # get this user
        _, encoded = data['photo'].split(",", 1) # get encoded photo
        image = base64.b64decode(encoded) # decode photo
        suffix = str(user.id) + str(pytz.utc.localize(datetime.now()).strftime("%d-%m-%Y-%H-%M-%S")) # give a unique suffix
        storage.child("recipes/" + suffix).put(image) # store the image in firebase
        image_url = storage.child("recipes/" + suffix).get_url(None) # get the url of the photo

        created_recipe = Recipe_info_model(created_by_user = user,  # user as a foreign key
                                         recipe_title = data['recipe_title'],
                                         ingredients = data['ingredients'],
                                         steps = data['steps'],
                                         cooking_method = data['cooking_method'],
                                         meal_type = data['meal_type'],
                                         photo = image_url, # store the url in mysql
                                         updated = pytz.utc.localize(datetime.now()))                              
        created_recipe.save()  # save
        return JsonResponse({"result": "Created Successfully"}, status=200)

    def put(self, request, pk):
        user = self.request.user  # get this user
        data = request.data  # json
        try:
            put_recipe = Recipe_info_model.objects.get(recipe_id=pk)  # get model to put
            image_base = put_recipe.photo
            put_image_name = image_base.replace("?alt=media","").split("%2F")[-1]
            try:
                header,encoded = data['photo'].split(",",1)
                image = base64.b64decode(encoded)
                storage.child("recipes/"+put_image_name).put(image)
                data['photo'] =image_base
            except:
                pass

            for elementTochange in data.keys():  # for loop to put
                setattr(put_recipe, elementTochange, data[elementTochange])  # value assignment
            setattr(put_recipe, 'updated', pytz.utc.localize(datetime.now())) # need to update the time
            put_recipe.save()
            return JsonResponse(model_to_dict(put_recipe), status=200)
        except Recipe_info_model.DoesNotExist:
            return JsonResponse({"return":"requested recipe does not exists"}, status=404)

    def get(self, request, pk):
        try:
            view_recipe = Recipe_info_model.objects.get(recipe_id = pk) # get this recipe from db
            user = User.objects.get(id = view_recipe.created_by_user.id) # get this user
            json_dict = model_to_dict(view_recipe) # convert model to dict
            json_dict["nick_name"] = user.nick_name # add nick_name to this json
            return JsonResponse(json_dict, status=200) 
        except Recipe_info_model.DoesNotExist:
            return JsonResponse({"return":"requested recipe does not exists"}, status=404)

    def delete(self, request, pk):
        user = self.request.user
        try:
            delete_recipe = Recipe_info_model.objects.get(recipe_id=pk, created_by_user= user.id) # get the recipe to delete
            image_base = delete_recipe.photo # also delete photo in firebase
            delete_image_name = image_base.replace("?alt=media", "").split("%2F")[-1]
            storage.delete("recipes/" + delete_image_name)
            delete_recipe.delete()
            return JsonResponse({"return": "Deleted Successfully"}, status=200)
        except Recipe_info_model.DoesNotExist:
            return JsonResponse({"return":"requested recipe does not exists"}, status=404)
                  
class NewsFeedByUserId (generics.GenericAPIView): # need to sort by date then number of likes then time
    def get (self, request):
        user = self.request.user # get this user
        # get contributors this user subscribed
        contributors = Subscription.objects.all().filter(subscriber_id = user.id).values('contributor').distinct() 
        # get recipes which contributors wrote, and likes
        recipes_with_creator = Recipe_info_model.objects.all().filter(created_by_user__in = contributors).select_related('created_by_user')\
                                    .annotate(like_count = Count('like'))\
                                    .annotate(is_liked_num = Count('like', filter = Q(like__user_id = user.id))) \
                                    .annotate(is_liked = Case(When(is_liked_num=0, then=Value('False')), default=Value('True')))
        recipe_ids = recipes_with_creator.values('recipe_id').distinct() # further get recipe ids
        like_table = Like.objects.all() # get like table
        result_list = [] # create an empty list for sorting later
        for recipe_json in recipes_with_creator: # model
            temp_dict = {} # get an empty dict prepared for return
            temp_dict['recipe_id'] = recipe_json.recipe_id 
            temp_dict['recipe_title'] = recipe_json.recipe_title
            temp_dict['photo'] = recipe_json.photo
            temp_dict['created_by_user_id'] = recipe_json.created_by_user.id
            temp_dict['updated'] = recipe_json.updated
            temp_dict['author_name'] = recipe_json.created_by_user.nick_name
            temp_dict['like_count'] = recipe_json.like_count
            temp_dict['is_liked'] = recipe_json.is_liked 
            # generate total like user have for this creator, only for sorting purpose
            temp_dict['total_like_user_have_for_creator'] = like_table.filter(recipe_id__in = recipe_ids, user_id = user.id).count()
            result_list.append(temp_dict)
        # sort by, date, total like, time
        sorted_result = sorted (result_list, key = lambda x: (x.get('updated').date(), -x.get('total_like_user_have_for_creator'), x.get('updated').time()), reverse=True)
        result_dic = {}
        for i in range(min(len(sorted_result),10)): # limit the return to Top 10
            del sorted_result[i]['total_like_user_have_for_creator']
            result_dic[i] = sorted_result[i] # add to dict
        return JsonResponse(data = result_dic, status = 200)

from django.utils.functional import keep_lazy

class Recommendation (generics.GenericAPIView): # by recipe_id
    def get (self, request, pk):
        user = self.request.user
        # query, get data into local
        all_recipes = Recipe_info_model.objects.all().prefetch_related('created_by_user')\
                                    .annotate(like_count = Count('like'))\
                                    .annotate(is_liked_num = Count('like', filter = Q(like__user_id = user.id))) \
                                    .annotate(is_liked = Case(When(is_liked_num=0, then=Value('False')), default=Value('True')))
        reference_recipe = all_recipes.get(recipe_id = pk) # reference recipe
        other_recipes = list(all_recipes.exclude(recipe_id = pk)) # other recipes, make it to a list to avoid lazy loading
        to_sort_list = []
        # to calculate jaccard similarity, we need to prepare two sets from two ingredients jsons
        reference_set = {each_ingre['name'] for each_ingre in reference_recipe.ingredients.values()}
        for recipe_json in other_recipes: # loop through recipes
            # do fuzzy match, if {'cherry'} comparing {'cherries'}, should be recognised as the same one
            current_ingre_set = {each_ingre['name'] for each_ingre in recipe_json.ingredients.values()}
            final_ingre_set = set()
            for ingre in current_ingre_set:
                fuzzy_ingre_list = []
                for ref_ingre in reference_set: # check if there is a fuzzy match 
                    string_similarity = difflib.SequenceMatcher(None, ref_ingre, ingre).ratio()
                    if string_similarity >= 0.7: # threshold for fuzzy match
                        fuzzy_ingre_list.append([string_similarity, ref_ingre]) 
                if len(fuzzy_ingre_list) > 0: # if we have the fuzzy match
                    # add the name based on ref, to the set, max list default maximising list[0]
                    final_ingre_set.add(max(fuzzy_ingre_list)[1]) 
                else:
                    final_ingre_set.add(ingre)
            # now final_ingre_set is ready after fuzzy match, ready to calculate jaccard similarity inter/union
            union_len = len(reference_set.union(final_ingre_set))
            intersect_len = len(reference_set.intersection(final_ingre_set))
            jaccard_similarity = intersect_len/union_len
            if jaccard_similarity > 0: # not keeping compeletely irrelevant recipes
                temp_list = []
                temp_list.append(recipe_json)
                temp_list.append(jaccard_similarity) 
                to_sort_list.append(temp_list)
        # now we have a list with recipe_id and its ingre_similarity to reference, ready to sort
        sorted_result = sorted (to_sort_list[:10], key = lambda x: x[1] ,reverse=True) # limit return to 10
        # now we output our result as a structured json format
        result_json = {}
        for i in range(len(sorted_result)):
            current_recipe_model = sorted_result[i][0]
            temp_dict = {}
            temp_dict['recipe_id'] = current_recipe_model.recipe_id
            temp_dict['recipe_title'] = current_recipe_model.recipe_title
            temp_dict['photo'] = current_recipe_model.photo
            temp_dict['created_by_user_id'] = current_recipe_model.created_by_user.id
            temp_dict['updated'] = current_recipe_model.updated
            temp_dict['author_name'] =  current_recipe_model.created_by_user.nick_name
            temp_dict['like_count'] =current_recipe_model.like_count
            temp_dict['is_liked'] = current_recipe_model.is_liked 
            result_json[i] = temp_dict
        return JsonResponse(data = result_json, status = 200)


class ifSub (APIView):
    def get (self, request, pk):
        user = self.request.user # get this user
        result = Subscription.objects.filter(contributor_id = pk, subscriber_id = user.id).exists() # check
        return JsonResponse(data = {'ifSub': result}, status = 200)

####### Basket #########
class Basket (APIView):
    def post (self, request, pk): # addtobasket
        user = self.request.user# get this user
        check_basket = Basket_model.objects.filter(recipe_id = pk, user_id = user.id).exists() 
        if check_basket: # check if already in basket
            result = {"addtobasket": "already in basket"}
        else:
            new_itemin_basket = Basket_model (user_id = user.id, recipe_id = pk) # if not exist, create a new one
            new_itemin_basket.save()
            result = {"addtobasket": "added"}
        return JsonResponse(data = result, status = 200)

    def delete (self, request, pk):
        user = self.request.user
        try:
            to_delete_basket = Basket_model.objects.get(user = user.id, recipe = pk) # get this to delete
            to_delete_basket.delete()
            result = {"deletefrombasket" : "deleted from basket"}
        except:
            result =  {"deletefrombasket" : "not in the basket"}
        return JsonResponse(data = result, status = 200)

    def get (self, request, pk):
        user_c = self.request.user # get this user
        result = Basket_model.objects.filter(recipe = pk, user = user_c.id).exists()
        return JsonResponse(data = {"ifBasket": result}, status = 200)

class BasketClear (APIView): 
    def delete (self, request): # when to delete all from basket
        user_c = self.request.user # get this user
        to_delete_set = Basket_model.objects.filter(user = user_c.id)
        for model in to_delete_set:
            model.delete()
        return JsonResponse(data = {"basketclear" : "all basket items deleted"}, status = 200)

##### Basket Info #####
class BasketRecipe (APIView):
    def get (self, request): # get all recipes in this basket
        user_c = self.request.user
        all_baskets_models = Basket_model.objects.filter(user_id = user_c.id).select_related('recipe') # all baskets
        recipe_ids = all_baskets_models.values('recipe_id').distinct()
        recipes_in_basket = Recipe_info_model.objects.all().filter(recipe_id__in = recipe_ids)
        result_dict = {} # define an empty dict prepared for return
        for i in range(len(recipes_in_basket)): # only return minimal recipe info
            result_dict[i] = {"recipe_id": recipes_in_basket[i].recipe_id,
                                "recipe_title" : recipes_in_basket[i].recipe_title,
                                "ingredients" : recipes_in_basket[i].ingredients}
        return JsonResponse(data = result_dict, status = 200)

class BasketSummary (APIView):
    def get (self, request):
        user_c = self.request.user # get user
        all_baskets_models = Basket_model.objects.filter(user_id = user_c.id).select_related('recipe') # all baskets
        recipe_ids = all_baskets_models.values('recipe_id').distinct()
        recipes_in_basket = Recipe_info_model.objects.all().filter(recipe_id__in = recipe_ids)
        result_dict = {} # define an empty dict prepared for return
        for recipe in recipes_in_basket: # recipe model
            for each_ingre in recipe.ingredients.keys(): 
                ingre_name = recipe.ingredients[each_ingre]['name']
                ingre_unit = recipe.ingredients[each_ingre]['units'] # each ingre has one unit
                ingre_amount = recipe.ingredients[each_ingre]['amount']
                updated_ingre = False 
                if  ingre_name not in result_dict.keys(): # create new ingredient to result
                    result_dict[ingre_name] = {1 : {'unit': ingre_unit, 'amount':ingre_amount}}
                else:  # ingredient exists, need to aggregate
                    for each_ingre in result_dict[ingre_name].keys():
                        if result_dict[ingre_name][each_ingre]['unit'] == ingre_unit:
                            aggregated = float(result_dict[ingre_name][each_ingre]['amount']) + float(ingre_amount)
                            if aggregated.is_integer:
                                aggregated = int(aggregated)
                            result_dict[ingre_name][each_ingre]['amount'] =  str(aggregated)
                            updated_ingre = True
                    if not updated_ingre: # if no update from above two steps, add this unit
                        result_dict[ingre_name][max(result_dict[ingre_name].keys())+1] = {'unit' : ingre_unit, 'amount':ingre_amount}# when 1,2,3 create 4
        return JsonResponse(data = result_dict, status = 200)

##### Comment #####



class CommentAPI(APIView):

    def post(self, request, pk):
        # get request data and user object
        comment_data = request.data  
        user = self.request.user

        try:
            recipe = Recipe_info_model.objects.get(recipe_id = pk)
        except:
            return Response(status=400, data={"message": "The recipe was not found."})

        comment = Comment(content = comment_data["content"], recipe_id = pk, created_by_user_id = user.id )  
        comment.save()

        return Response(status=200, data={"message": "Successfully created a comment"})

    def delete(self, request, pk):
        # check auth, right user, recipe
        uid = self.request.user.id
        comment_data = request.data

        try:
            comment = Comment.objects.filter(recipe_id = pk).filter(id = comment_data["commentId"]).get(created_by_user_id = uid)
        except:
            return Response(status=400, data={"message": "The comment or recipe cannot find"})

        comment.delete()
        return Response(status=200, data={"message": "Comment deleted."})

    def get(self, request, pk):
        comment_list_items = Comment.objects.filter(recipe_id = pk).select_related('created_by_user_id__nick_name').annotate(nick_name=F('created_by_user_id__nick_name'))
        values = list(comment_list_items.values('id','content','created_date','created_by_user_id','recipe_id','recipe_id','nick_name'))
        return JsonResponse(status=200, data=values, safe=False)


##### Like #####


class LikeRecipeAPI(APIView):
    def get(self, request, pk):
        # check if this recipe exists?
        check_recipe = Recipe_info_model.objects.filter(recipe_id=pk).exists()
        # if exists, filter all likes for this recipe and count; then check if this user liked this recipe 
        if check_recipe:
            uid = self.request.user.id
            like_queryset = Like.objects.filter(recipe_id=pk)
            like_count = like_queryset.count()
            is_liked = like_queryset.filter(user_id = uid).exists()
            return Response(status=200, data={"recipe_id": pk, "is_liked": is_liked, "like_count": like_count})
        else:
            return Response(status=404, data={"message": "Could't find the recipe."})
            

    def post(self, request, pk):
        uid = self.request.user.id
        #  check if this user already liked this recipe
        is_liked = Like.objects.filter(recipe_id=pk).filter(user_id = uid).exists()
        # if haven't liked, create a new entry to table like
        if not is_liked:
            like = Like(user_id = uid, recipe_id = pk)  
            like.save()
            return Response(status=200, data={"message": "Successfully liked"})
        else:
            return Response(status=400, data={"message": "Could't find the recipe or already liked."})

    def delete(self, request, pk):
        try:
            user = self.request.user
            # check if this usr really liked this recipe
            like = Like.objects.filter(recipe_id=pk).get(user_id = user.id)
        except:
            return Response(status=404, data={"message": "The like cannot find"})
        # if liked, delete
        like.delete()
        return Response(status=200, data={"message": "like deleted."})

##### Search ######

class Search(APIView):

    def rank_scores(self, ref_words, search_words):
        intersection_set = set()
        similarity_set = []
        similarity = 0
        # Since the length of keyword(f) and title(t) is small, we can assume O(f*t) = C
        for keyword in search_words:
            for ref_word in ref_words:
                word_similarity = difflib.SequenceMatcher(None, keyword, ref_word).ratio()
                # similar words
                if word_similarity > 0.70:
                    intersection_set.add(ref_word)
                    similarity_set.append(word_similarity)
            # CONTAINS (especially for ingredients):
            if not similarity_set:
                for single_word in search_words:
                    if single_word in ref_word:
                        word_similarity = 0.70
                        similarity_set.append(word_similarity)
        # after comparing the two string word by word, check if is there any similar word
        if similarity_set:
            # in case search query is patern "A A A A A" to match "B C A D" 
            similarity_adjustment = sum(similarity_set) / len(similarity_set)
            # adjustment jaccard_similarity
            similarity = len(intersection_set) / len(set(ref_words + search_words)) * similarity_adjustment
        return similarity

    def post(self, request):
        # start = time.time()
        uid = self.request.user.id
        # get keywords
        search_data = request.data
        title_search = search_data["title"].split()
        ingredients_search = search_data["ingredients"].split()
        methods_search = search_data["method"].split()
        meal_types_search = search_data["mealType"].split()
        # Build query set. note the query set is lazy
        qset = Recipe_info_model.objects \
                .select_related('created_by_user_id__nick_name')\
                .annotate(author_name=F('created_by_user_id__nick_name')) \
                .annotate(like_count = Count('like')) \
                .annotate(is_liked_num = Count('like', filter = Q(like__user_id = uid))) \
                .annotate(is_liked = Case(When(is_liked_num=0, then=Value('False')), default=Value('True')))

        all_local = list(qset.all().values('recipe_id','recipe_title','ingredients','cooking_method','meal_type','photo','created_by_user_id','author_name', 'updated','like_count','is_liked'))
        result_items ={}
        t_max, t_min, i_max, i_min, m_max, m_min, type_max, type_min = (0,0,0,0,0,0,0,0)

        for each_recipe in all_local:

            # Matching title
            title_words = each_recipe["recipe_title"].split()
            title_similarity = self.rank_scores(title_words, title_search)
            t_max = max(t_max,title_similarity)
            t_min = min(t_min,title_similarity)

            # Matching ingredients
            ingredients_word = [value["name"] for value in each_recipe["ingredients"].values()]
            ingredients_similarity = self.rank_scores(ingredients_word, ingredients_search)
            i_max = max(i_max,ingredients_similarity)
            i_min = min(i_min,ingredients_similarity)
            del each_recipe["ingredients"]

            # Matching methods
            methods_word = each_recipe["cooking_method"].split()
            method_similarity = self.rank_scores(methods_word, methods_search)
            m_max = max(m_max,method_similarity)
            m_min = min(m_min,method_similarity)
            del each_recipe["cooking_method"]
            
            # Matching meal_type
            meal_type_word = each_recipe["meal_type"].split()
            type_similarity = self.rank_scores(meal_type_word, meal_types_search)
            type_max = max(type_max,type_similarity)
            type_min = min(type_min,type_similarity)
            del each_recipe["meal_type"]

            # add to dict with recipe object as key, similarity score as value ; VALUE(A+B+C+D)
            if title_similarity+ingredients_similarity+method_similarity+type_similarity > 0:
                result_items[json.dumps(each_recipe, cls=DjangoJSONEncoder)] = {
                    'title': title_similarity,
                    'ingredients': ingredients_similarity,
                    'method' : method_similarity,
                    'type_similarity': type_similarity
                } 
        # SCALE : (X - MIN / MAX - MIN) to make sure each part has same weight
        for key in result_items:
            score = 0
            if t_max - t_min > 0:
                score += (result_items[key]['title'] - t_min) / t_max - t_min
            if i_max - i_min > 0:
                score += (result_items[key]['ingredients'] - i_min) / i_max - i_min
            if m_max - m_min > 0:
                score += (result_items[key]['method'] - m_min) / m_max - m_min
            if type_max - type_min > 0:
                score += (result_items[key]['type_similarity'] - type_min) / type_max - type_min
            result_items[key] = score
        # sort and get a list
        sorted_results = sorted(result_items.keys(), key=result_items.get, reverse = True)
        # convert back to dict
        values = {i:json.loads(v) for i, v in enumerate(sorted_results)}
        # end = time.time()
        # print(end - start)
        # print(connection.queries)
        return JsonResponse(status=200, data=values)


##### Subscription ######

class SubscribeAPI(APIView):
    def get(self, request):
        try:
            subscription = Subscription.objects.filter(subscriber_id = self.request.user.id)
        except:
            return Response(status=404, data={"message": "The user cannot find"})
        values = list(subscription.values())
        return JsonResponse(status=200, data=values, safe=False)
            

    def post(self, request):
        contributor_id = request.data["contributorId"]
        uid = self.request.user.id
        if int(contributor_id) == uid:
            return Response(status=400, data={"message": "You can't subscribe yourself"})
        #  check if this user already subscribed
        is_subscribed = Subscription.objects.filter(subscriber_id=uid).filter(contributor_id = contributor_id).exists()
        if not is_subscribed:
            subscription = Subscription(contributor_id = contributor_id, subscriber_id = uid)  
            subscription.save()
            return Response(status=200, data={"message": "Successfully subscribed"})
        else:
            return Response(status=404, data={"message": "Could't find the contributor or already subscribed"})

    def delete(self, request):
        contributor_id = request.data["contributorId"]
        uid = self.request.user.id
        try:
            #  check if this user already subscribed
            subscription = Subscription.objects.filter(subscriber_id=uid).get(contributor_id = contributor_id)
        except:
            return Response(status=404, data={"message": "The contributor cannot find"})

        subscription.delete()
        return Response(status=200, data={"message": "subscription deleted."})


##### RecipeList ######


class RecipeListBySelfId(APIView):
    def get(self, request):
        uid = self.request.user.id
        recipe_list_items = Recipe_info_model.objects.filter(created_by_user_id = uid) \
                        .select_related('created_by_user_id__nick_name')\
                        .annotate(author_name=F('created_by_user_id__nick_name')) \
                        .annotate(like_count = Count('like')) \
                        .annotate(is_liked_num = Count('like', filter = Q(like__user_id = uid))) \
                        .annotate(is_liked = Case(When(is_liked_num=0, then=Value('False')), default=Value('True')))

        values = list(recipe_list_items.values('recipe_id','recipe_title','photo','created_by_user_id','author_name', 'updated','like_count','is_liked'))
        return JsonResponse(status=200, data=values, safe=False)

class RecipeListByUserId (generics.GenericAPIView):
    def get(self, request, pk):
        uid = self.request.user.id
        recipe_list_items = Recipe_info_model.objects.filter(created_by_user_id = pk) \
                        .select_related('created_by_user_id__nick_name')\
                        .annotate(author_name=F('created_by_user_id__nick_name')) \
                        .annotate(like_count = Count('like')) \
                        .annotate(is_liked_num = Count('like', filter = Q(like__user_id = uid))) \
                        .annotate(is_liked = Case(When(is_liked_num=0, then=Value('False')), default=Value('True')))

        values = list(recipe_list_items.values('recipe_id','recipe_title','photo','created_by_user_id','author_name', 'updated','like_count','is_liked'))
        return JsonResponse(status=200, data=values, safe=False)
        
class GetRecipeByUserId (generics.GenericAPIView): # return DETAILED recipe infos created by this user
    def get(self, request, pk):
        QuerySet = Recipe_info_model.objects.all().filter(created_by_user=pk)  # query
        data = list(QuerySet.values())
        if data is not None:
            return JsonResponse(data, status = 200, safe=False)
        else:
            return JsonResponse(data, status = 404, safe=False)

class TopRecipes(APIView):
    def get(self, request):
        uid = self.request.user.id
        recipe_list_items = Recipe_info_model.objects.all() \
                        .select_related('created_by_user_id__nick_name')\
                        .annotate(author_name=F('created_by_user_id__nick_name')) \
                        .annotate(like_count = Count('like')) \
                        .annotate(is_liked_num = Count('like', filter = Q(like__user_id = uid))) \
                        .annotate(is_liked = Case(When(is_liked_num=0, then=Value('False')), default=Value('True'))) \
                        .order_by('-like_count')[:10]
                        
        values = list(recipe_list_items.values('recipe_id','recipe_title','photo','created_by_user_id','author_name', 'updated','like_count','is_liked'))
        return JsonResponse(status=200, data=values, safe=False)

class Profile(APIView):
    def get(self, request, pk):
        try:
            uid = self.request.user.id
            user_info = list(User.objects.filter(id = pk).values('id','email','nick_name'))
            is_subscribed = Subscription.objects.filter(contributor_id = pk).filter(subscriber_id = uid).exists()
            followed_count = Subscription.objects.filter(contributor_id = pk).count()
            following_count = Subscription.objects.filter(subscriber_id = uid).count()
            user_info[0]["is_subscribed"] = is_subscribed
            user_info[0]["followed_count"] = followed_count
            user_info[0]["following_count"] = following_count
            return JsonResponse(status=200, data=user_info, safe=False)
        except:
            return Response(status=400, data={"message": "Something wrong with this subscription"})
