# MyRecipe · 
***The following instructions will introduce how to operate the MyRecipe platform on the Vlab. The Github link for the MyRecipe system has been listed in reference.*** 

Requirements: Python version 3.7 and above
___

## Backend Setup
###### *Please make sure you are under the folder 'capstoneproject-comp9900-t18a-tomcat' with your terminal, i.e. if you run ```pwd``` you should see something like this:* 
###### *```/your_path_to_this_folder/capstoneproject-comp9900-t18a-tomcat```*

#### 1. Run follwing command in your terminal to enter folder ```backend```

    cd backend

#### 2. For creating isolated virtual python environments, install virtual environment
    
    pip3 install virtualenv
    

#### 3. Run command the following command to set up virtual python environments. 
    
    python3 -m virtualenv .
    
###### Then if you run ```ls```, the output in the terminal should be: 

```api  backend  bin  lib  manage.py  myrecipe.json  pyvenv.cfg  requirements.txt```
    

#### 4. Run command to start the virtual environment: 
    
    source bin/activate
    
###### (you can use 'deactivate' to exit virtual environment)

#### 5. Install required packages

###### While the virtual environment is active, install required packages into your virtual environment. It may take several minutes to install:
    
    pip3 install -r requirements.txt
    
#### 6. Start service

###### Now, you can run the backend server by using the following command. This will start development server at http://127.0.0.1:5005/:
    
    python3 manage.py runserver 5005
    
###### Press 'CTRL' + 'C' to Exit
    
___
    

######
### Frontend Setup 
#### Open another terminal and please make sure you are under the folder 'capstoneproject-comp9900-t18a-tomcat'

#### 7. Move to the frontend folder

    cd frontend

#### 8. Install the Environment

    yarn install

#### 9. Start the Environment

    yarn start


##### (http://localhost:3000) will be runned in the browser.

##### Press 'CTRL' + 'C' to Exit

___

### Optional Setup 

#### 10. (Optional) Use your own cloud mysql database

###### We’ve set up an online AWS database for you. You can connect to and use the online database directly without changing anything. However, if you want to use your own cloud mysql database, you can open file ```capstoneproject-comp9900-t18a-tomcat/backend/backend/settings.py``` and change the following part:

    # Overwrite 
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'final',
        'USER': 'admin',
        'PASSWORD': 'tomcat123',
        'HOST': 'myrecipedbaws.cmcm75qxdqvo.ap-southeast-2.rds.amazonaws.com',
        'PORT': '3306',
        'OPTIONS' :{'sql_mode': 'traditional'}
        }
    }
    # to 
    DATABASES = {
      'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_cloud_databasse_schema_name',
        'USER': 'your_user_name',
        'PASSWORD': 'your_password',
        'HOST': 'your_host',
        'PORT': 'your_port_default_is_3306',
       }
    }

###### Please make sure the schema should be empty.

###### With terminal open at directory ```capstoneproject-comp9900-t18a-tomcat/backend/```, you can run the following command to migrate the database, It may take several minutes.
    python3 manage.py makemigrations api; python3 manage.py migrate api; python3 manage.py makemigrations; python3 manage.py migrate
    
###### You can run the backend server by using `python3 manage.py runserver 5005` then.

#### 11. (Optional) Use your local mysql database

###### You can also use your local mysql database, just open file ```capstoneproject-comp9900-t18a-tomcat/backend/backend/settings.py``` and change the following part:

    # Overwrite 
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'final',
        'USER': 'admin',
        'PASSWORD': 'tomcat123',
        'HOST': 'myrecipedbaws.cmcm75qxdqvo.ap-southeast-2.rds.amazonaws.com',
        'PORT': '3306',
        'OPTIONS' :{'sql_mode': 'traditional'}
        }
    }
    # to 
    DATABASES = {
      'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_local_databasse_schema_name',
        'USER': 'your_user_name',
        'PASSWORD': 'your_password',
        'HOST': localhost’,
        'PORT': 'your_port_default_is_3306',
       }
    }

###### Also, please make sure the schema is empty. 

###### With terminal open at directory ```capstoneproject-comp9900-t18a-tomcat/backend/```, you can run the following command to migrate the database, It may take several minutes.
    python3 manage.py makemigrations api; python3 manage.py migrate api; python3 manage.py makemigrations; python3 manage.py migrate
    
###### You can run the backend server by using `python3 manage.py runserver 5005` then.

#### 12. (Optional) Use your local sqlite database

###### Instead of using a mysql database, you can use sqlite database as well. First you need to at the directory ```capstoneproject-comp9900-t18a-tomcat/backend/``` with your terminal. Then run `touch sqlite3.db` to create a file called `sqlite3.db` under this folder.
 
###### After that just need to change the following part in file ```capstoneproject-comp9900-t18a-tomcat/backend/backend/settings.py``` :

    # Overwrite 
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'final',
        'USER': 'admin',
        'PASSWORD': 'tomcat123',
        'HOST': 'myrecipedbaws.cmcm75qxdqvo.ap-southeast-2.rds.amazonaws.com',
        'PORT': '3306',
        'OPTIONS' :{'sql_mode': 'traditional'}
        }
    }
    # to 
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'sqlite3.db',
        }
    }


###### You can name the xxx.db by yourself, just make sure to change the ‘NAME’ in setting.py corresponsively. Sqlite is the default database for Django. However, It should not be used in production since it is usually slow. 

###### With terminal open at directory ```capstoneproject-comp9900-t18a-tomcat/backend/```, you can run the following command to migrate the database.
    python3 manage.py makemigrations api; python3 manage.py migrate api; python3 manage.py makemigrations; python3 manage.py migrate
    
###### Now you can run the backend server by using `python3 manage.py runserver 5005`. 

#### 13. (Optional) Use your own firebase

###### You can also use your own firebase, just open file ```capstoneproject-comp9900-t18a-tomcat/backend/api/views.py``` and change the following part:

```
# overwrite
config = {
    "apiKey": "AIzaSyA9tzk_OfN9XjM4KvWbc3WMUtDdjQ4WdDk",
    "authDomain": "myrecipe-images.firebaseapp.com",
    "projectId": "myrecipe-images",
    "storageBucket": "myrecipe-images.appspot.com",
    "messagingSenderId": "337105018715",
    "serviceAccount": "myrecipe.json",
    "appId": "1:337105018715:web:377a7175b0cf07fe37c47e",
    "measurementId": "G-633MZSPXD8",
    "databaseURL": ""
}
to
config = {
    "apiKey": "your_api_key",
    "authDomain": "your_auth_Domain",
    "projectId": "your_project_Id",
    "storageBucket": "your_storage_Bucket",
    "messagingSenderId": "your_api_key",
    "serviceAccount": "myrecipe.json",
    "appId": "your_api_id",
    "measurementId": "your_measurement_Id",
    "databaseURL": ""
}
```
###### You can find these information at your Online Firebase -> Project settings -> General ->  Your apps

###### Then open file ```capstoneproject-comp9900-t18a-tomcat/backend/myrecipe.json``` and replace it with your generated JSON key to like this:

```
  {
      "type": "service_account",
      "project_id": "PROJECT_ID",
      "private_key_id": "SOME_NUMBER",
      "private_key": "-----BEGIN PRIVATE KEY-----\nPRIVATE_KEY\n-----END PRIVATE KEY-----\n",
      "client_email": "SERVICE_ACCOUNT_EMAIL",
      "client_id": "...",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/SERVICE_ACCOUNT_EMAIL"
    }
```
###### You can read more [here](https://firebase.google.com/docs/web/setup) for generating JSON key.

#### 14. (Optional) npm start

###### You can also try to use ```npm``` if the yarn doesn't work
    
    npm install 

###### If you use ```npm install```, then do the following to start.

    npm start
    
___

The project is equipped with a comprehensive REST API. If you desire to access it, please refer to the [API Reference](https://github.com/COMP3900-9900-Capstone-Project/capstoneproject-comp9900-t18a-tomcat/blob/main/api_reference.md).
