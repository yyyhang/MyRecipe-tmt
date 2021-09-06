import React, { useEffect } from 'react';
import MenuBar from "./components/menu";
import Picker from "./components/customizedPicker";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useState } from "react";
import { primaryColor } from './components/styles';
import Button from '@material-ui/core/Button';
import ImageSelect from "./components/imagePicker";
import { editRecipe, getRecipeDetails } from './components/api';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import StepDescription from "./components/stepDescription";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    divider: {
        height: 3,
        color: 'black',
        margin: 5,
    },
    save: {
        marginBottom: theme.spacing(10),
        color: 'white',
        backgroundColor: primaryColor,
        marginTop: 70,
        margin: 30,
        width: 300,

    },
    textArea: {
        marginTop: 10,
        width: 600,
        height: 150,
    },
    steps: {
        margin: 30,
    },
    view: {
        display: "flex",
        flexDirection: 'row',
        width: '90%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',

    },
    cookingType: {
        flex: 1,
        padding: theme.spacing(1),
        width: 400,
        borderRadius: '5px',
        height: 200,
        alignItems: 'center',
        borderColor: 'black',
        marginBottom: 30,
    },
    box: {
        alignContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: 20,
        borderColor: 'grey',
        borderWidth: 3,
    },
    toggleButtonGroup: {
        marginTop: 20,
        marginBottom: 40,
    },
    stepIntro: {
        height: '40%',
        width: '30%',
    },
    inputName: {
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        width: 400,
        justifyContent: 'center',
        marginTop: 20,
    },
    title: {
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 'bold',
        fontSize: 16,
        margin: '20px 0px 5px',
        textAlign: 'center'
    },
    formControlLabels: {
        fontSize: 15,
        fontStyle: 'normal',
        fontFamily: 'Raleway',
    },
    container: {

        display: 'flex',
        flexDirection: 'column',
        border: '5px solid #FF4500',
        backgroundColor: '#FFDAB9',
        margin: '70px 10% 75px',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioBox: {
        flexDirection: 'row',
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    imgInput: {
        height: 200,
        borderColor: 'black',
        backgroundColor: 'grey',
    },
    basicInfo: {
        display: 'flex',
        flexDirection: 'row',
        margin: '20px 7% 30px 8%',
        justifyContent: 'space-around',
    },
    detail: {
        flexDirection: 'column',
        flex: 1,
        textAlign: 'center',
        marginTop: 30,

    },
    uploadImage: {
        flex: 1
    },
    gridStyle: {
        marginTop: 15,
        marginLeft: 20,
    }


}));



export default function EditRecipe(props) {
    const recipeId = props.location.state.recipeId;
    const [photo, setPhoto] = useState("")
    const [image, setImage] = useState("");
    const [ingredients, setIngredients] = useState([])
    const [stepDetailList, setStepsList] = useState([]);
    const [cookingMethod, setCookingMethod] = useState("")
    const [mealType, setMealType] = useState("")
    const [recipeTitle, setRecipeTitle] =useState("")
    const classes = useStyles();

    var stepResult = {}
    var arr = []
    var temp = []
    var ingredientResult = {};

    const history = useHistory();

    useEffect(() => {
        if (recipeTitle === "") {
            getRecipeDetails(localStorage.getItem('token'), recipeId).then((info) => {
                console.log(info)
                setRecipeTitle(info["recipe_title"])
                setPhoto(info["photo"])
                setCookingMethod(info["cooking_method"])
                setMealType(info["meal_type"])


                Object.keys(info["steps"]).map((key, index) => (
                    stepResult[index] = Object.values(info["steps"][key])[0]
                ))

                for (let i in stepResult) {
                    let o = {};
                    o[i] = stepResult[i];
                    arr.push(o)
                }
                setStepsList(arr)

                const ingredientInitiate = info["ingredients"]
                for (let i in ingredientInitiate) {
                    let o = {};
                    o[i-1] = Object.values(ingredientInitiate)[i-1];
                    temp.push(o)
                }
                setIngredients(temp)


            }).catch((err) => {
                console.log('get recipe details err' + err)
            })
        }
    }, [])

    const handleMealType = (event, tempInfo) => {
        setMealType(tempInfo);
    };

    const handleChange = (event) => {
        setCookingMethod(event.target.value);

    };
    const handleTitleChange=(event)=>{
        setRecipeTitle(event.target.value)
      }


    
    Object.keys(ingredients).forEach(key => {
        Object.keys(ingredients[key])
        ingredientResult[parseInt(key,10) + 1] = Object.values(ingredients[key])[0]
    })

    function handleSave(event) {

        //clean the data type 
        var finalStepList = {};
        Object.keys(stepDetailList).forEach(key => {
            Object.keys(stepDetailList[key])
            var tempResult = {}
            tempResult["data"] = Object.values(stepDetailList[key])[0]
            finalStepList[parseInt(key, 10) + 1] = tempResult
        })


        editRecipe(localStorage.getItem('token'), recipeId, recipeTitle, ingredientResult, finalStepList, cookingMethod, mealType, image ? image[0] : photo)
            .then((info) => {
                history.push('/profile', { authorId: localStorage.getItem('userId') })
                window.location.reload(); 

            }).catch((err) => {
                alert("wrong", err);
            })
    }

    return (
        <div>
            <MenuBar />
            <div class="box" className={classes.container}>
                <div className={classes.detail}>
                    <Box component="div" className={classes.title}>Please Name Your Recipe </Box>
                    <TextField variant="outlined" className={classes.inputName}
                        label="Required * " value={recipeTitle} onChange={handleTitleChange}
                        backgroundColor={primaryColor} />

                </div>
                <div className={classes.basicInfo}>
                    <div className={classes.uploadImage}>
                        <ImageSelect img={(image) => setImage(image)} image={photo} />
                    </div>

                </div>

                <Box component="div" className={classes.title}>Please Select Meal-Type </Box>

                <ToggleButtonGroup
                    value={mealType}
                    exclusive
                    onChange={handleMealType}
                    className={classes.toggleButtonGroup}
                >
                    <ToggleButton value="Main" >
                        Main
                    </ToggleButton>
                    <ToggleButton value="BreakFast" >
                        BreakFast
                    </ToggleButton>
                    <ToggleButton value="Dessert" >
                        Dessert
                    </ToggleButton>
                    <ToggleButton value="Starter" >
                        Starter
                    </ToggleButton>
                    <ToggleButton value="Snack" >
                        Snack
                    </ToggleButton>
                    <ToggleButton value="Beverage" >
                        Beverage
                    </ToggleButton>
                </ToggleButtonGroup>



                <RadioGroup aria-label="cookingType" name="cookingType" className={classes.cookingType} value={cookingMethod} onChange={handleChange}>
                    <div className={classes.title}> Please select your cooking method</div>
                    <Grid container spacing={1} className={classes.gridStyle}>

                        <Grid item xs={12} sm={4} >
                            <FormControlLabel value="Steaming" control={<Radio size={"small"} />} label={<Typography className={classes.formControlLabels}>Steaming</Typography>} /></Grid>
                        <Grid item xs={12} sm={4} >
                            <FormControlLabel value="Frying" control={<Radio size={"small"} />} label={<Typography className={classes.formControlLabels}>Frying</Typography>} /></Grid>
                        <Grid item xs={12} sm={4} >
                            <FormControlLabel value="Roasting" control={<Radio size={"small"} />} label={<Typography className={classes.formControlLabels}>Roasting</Typography>} /></Grid>

                        <Grid item xs={12} sm={4} >
                            <FormControlLabel value="Boiling" control={<Radio size={"small"} />} label={<Typography className={classes.formControlLabels}>Boiling</Typography>} />
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <FormControlLabel value="Smoking" control={<Radio size={"small"} />} label={<Typography className={classes.formControlLabels}>Smoking</Typography>} />
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <FormControlLabel value="Baking" control={<Radio size={"small"} />} label={<Typography className={classes.formControlLabels}>Baking</Typography>} />
                        </Grid>
                    </Grid>
                </RadioGroup>


                <Box component="div" className={classes.title}>Choose the main ingredients with the portion </Box>

                {/* {ingredients && checkValidIngredients()} */}
                <Picker resultList={ingredients} setResultList={setIngredients} />


                <Box component="div" className={classes.title}>Step Description </Box>
                <StepDescription stepList={stepDetailList} setStepList={setStepsList} />

                <div >
                    <Button type="save" variant="contained" onClick={handleSave}
                        color="inherit" className={classes.save}>
                        Save
                    </Button>
                </div>

            </div>
        </div>
    )
}
