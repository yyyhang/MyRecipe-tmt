import React from 'react';
import MenuBar from "./components/menu";
import Picker from "./components/customizedPicker";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useState, useRef } from "react";
import { useHistory } from 'react-router-dom';
import { primaryColor } from './components/styles';
import Button from '@material-ui/core/Button';
import ImageSelect from "./components/imagePicker";
import { createRecipe } from './components/api';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import StepDescription from "./components/stepDescription";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles((theme) => ({
    divider: {
        height: 3,
        color: 'black',
        margin: 5,
    },
    textArea: {
        marginTop: 10,
        width: 600,
        height: 150,
    },
    steps: {
        margin: 30,
    },
    save: {
        marginBottom: theme.spacing(10),
        color: 'white',
        backgroundColor: primaryColor,
        marginTop: 70,
        margin: 30,
        width: 300,
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
        textAlign:'center',

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


//create recipe
export default function CreateRecipeFunction(props) {
    const history = useHistory();
    const classes = useStyles();
    const [ingredientList, setIngredientList] = useState([]);
    const [stepList, setStepList] = useState([]);
    const titleRef = useRef('');

    const [image, setImage] = useState("");
    const [cookingMethod, setCookingMethod] = useState('');
    const handleChange = (event) => {
        setCookingMethod(event.target.value);
    };

    var ingredients = {};
    Object.keys(ingredientList).forEach(key => {
        Object.keys(ingredientList[key])
        ingredients[parseInt(key,10) + 1] = Object.values(ingredientList[key])[0]
    })

    //edit on steps
    var finalStepList = {};
    Object.keys(stepList).forEach(key => {
        Object.keys(stepList[key])
        var tempResult = {}
        tempResult["data"] = Object.values(stepList[key])[0]
        finalStepList[parseInt(key,10) + 1] = tempResult
    })


    //meal type
    const [mealTypeInfo, selectMealType] = useState('Main');
    const handleMealType = (event, tempInfo) => {
        selectMealType(tempInfo);
    };

    const ToogleGroup = () => (
        <div>
            <Box component="div" className={classes.title}>Please Select Meal-Type </Box>

            <ToggleButtonGroup
                value={mealTypeInfo}
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
        </div>

    );

    const RadioGroupPicker = () => (
        <div>
            <RadioGroup aria-label="cookingType" name="cookingType" className={classes.cookingType} value={cookingMethod} onChange={handleChange}>
                <div className={classes.title}> Please select your cooking method</div>
                <Grid container spacing={1} className={classes.gridStyle}>

                    <Grid item xs={12} sm={4} >
                        <FormControlLabel value="Steaming" control={<Radio size={"small"} />} label={<Typography className={classes.formControlLabels}>Steaming</Typography>} />
                    </Grid>

                    <Grid item xs={12} sm={4} >
                        <FormControlLabel value="Frying" control={<Radio size={"small"} />} label={<Typography className={classes.formControlLabels}>Frying</Typography>} />
                    </Grid>

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
        </div>

    )

    function handleSave(event) {
        event.preventDefault();
        const recipeTitle = titleRef.current.value;
        

        if(recipeTitle===''){
            alert('Recipe Title can not be null');
        }else if (image===null){
            alert('Please upload the recipe photo')
        }else if(cookingMethod === ''){
            alert('Please select your meal type')
        }else if(JSON.stringify(ingredients) === '{}'){
            alert('Please input the ingredients')
        }else if(JSON.stringify(finalStepList) === '{}'){
            alert('Please input the steps')
        }
        else{
        const photos = image[0];
        createRecipe(localStorage.getItem('token'), recipeTitle, ingredients, finalStepList, cookingMethod, mealTypeInfo, photos)
            .then((info) => {
                // location.assign('./profile')

                history.push({
                    pathname: '/profile',
                    state: { authorId: localStorage.getItem('userId') }
                });

            }).catch((err) => {
                alert("wrong", err);
            })
    }}

    return (
        <div>
            <MenuBar />

            <div class="box" className={classes.container}>
                <div className={classes.detail}>
                    <Box component="div" className={classes.title}>Please Name Your Recipe </Box>
                    <TextField variant="outlined" className={classes.inputName}
                        label="Required * " inputRef={titleRef}
                        backgroundColor={primaryColor} />

                </div>
                <div className={classes.basicInfo}>
                    <div className={classes.uploadImage}>
                    <Box component="div" className={classes.title}>Uplode Your Dishes' Image </Box>
                   
                        <ImageSelect img={(image) => setImage(image)} />
                    </div>

                </div>
                <ToogleGroup />
                <RadioGroupPicker />

                <Box component="div" className={classes.title}>Choose the main ingredients with the portion </Box>

                <Picker resultList={ingredientList} setResultList={setIngredientList} />

                <Box component="div" className={classes.title}>Step Description </Box>
                <StepDescription stepList={stepList} setStepList={setStepList} />

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
