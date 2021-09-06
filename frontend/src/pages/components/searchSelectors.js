import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { lightColor } from './styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { getSearchResult } from './api';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'baseline'
    },
    inoputText: {
        minWidth: 200,
        display: 'flex',
        alignItems: 'center',
        marginTop: '0'
    },
    formControl: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.spacing(1),
        minWidth: 200,
        alignContent: 'center'
        // marginRight: '50px',
    },
    selector: {
        fontFamily: 'Cinzel',
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex',
        height: '20px',
    },
    checkbox: {
        fontFamily: 'Roboto_Slab',
        color: lightColor,
        fontWeight: 'bold',
    }
}));

var saveMethodOptionChecked = {}

function ExpandMethodSelector({ classes, OptionList, setOptionList }) {

    if (Object.keys(saveMethodOptionChecked).length === 0) {
        console.log('enter')
        const init = async () => {
            await OptionList.map((name, _) => (
                saveMethodOptionChecked = { ...saveMethodOptionChecked, [name]: false }
            ))
        }
        init();
    }

    const [isOptionsCheck, setIsOptionsCheck] = useState(saveMethodOptionChecked);

    function handleChange(e) {
        const flag = isOptionsCheck[e.target.name]
        saveMethodOptionChecked = { ...saveMethodOptionChecked, [e.target.name]: !flag }
        var optionStr = "";
        Object.keys(saveMethodOptionChecked).forEach(opt=>{
            console.log("jehsikudfgh"+saveMethodOptionChecked[opt])
            if(saveMethodOptionChecked[opt] === true){
                optionStr = optionStr + " " + opt
            }
        })
        console.log(optionStr+"***");
        setOptionList(optionStr)
        setIsOptionsCheck({ ...isOptionsCheck, [e.target.name]: !flag });
    }

    return (
        <div className={classes.selectorBox}>
            <Card className={classes.root} style={{ position: 'fixed', zIndex: 10 }}>
                <CardContent>
                    <FormGroup >
                        {
                            OptionList.map((name, index) => {
                                return (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                inputProps={{ 'aria-label': 'prima checkbox' }}
                                                className={classes.checkbox}
                                                checked={isOptionsCheck[name]}
                                                onChange={handleChange}
                                                name={name} />
                                        }
                                        label={name}
                                    />

                                );
                            })
                        }
                    </FormGroup>
                </CardContent>
            </Card>
        </div>
    )
}

var saveTypeOptionChecked = {}

function ExpandTypeSelector({ classes, OptionList, setOptionList }) {

    if (Object.keys(saveTypeOptionChecked).length === 0) {
        console.log('enter')
        const init = async () => {
            await OptionList.forEach(name => {
                saveTypeOptionChecked = { ...saveTypeOptionChecked, [name]: false }
            })
        }
        init();
    }

    const [isOptionsCheck, setIsOptionsCheck] = useState(saveTypeOptionChecked);

    function handleChange(e) {
        const flag = isOptionsCheck[e.target.name]
        saveTypeOptionChecked = { ...saveTypeOptionChecked, [e.target.name]: !flag }
        var optionStr = "";
        Object.keys(saveTypeOptionChecked).forEach(opt=>{
            if(saveTypeOptionChecked[opt] === true){
                optionStr = optionStr + " " + opt
            }
        })
        setOptionList(optionStr)
        setIsOptionsCheck({ ...isOptionsCheck, [e.target.name]: !flag });
    }

    return (
        <div className={classes.selectorBox}>
            <Card className={classes.root} style={{ position: 'fixed', zIndex: 10 }}>
                <CardContent>
                    <FormGroup >
                        {
                            OptionList.map((name, index) => {
                                return (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                inputProps={{ 'aria-label': 'prima checkbox' }}
                                                className={classes.checkbox}
                                                checked={isOptionsCheck[name]}
                                                onChange={handleChange}
                                                name={name} />
                                        }
                                        label={name}
                                    />
                                );
                            })
                        }
                    </FormGroup>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ControlledOpenSelect({ _title, setRecipeList }) {

    const classes = useStyles();
    const [isMethodHovering, setIsMethodHovering] = useState(false);
    const [isTypeHovering, setIsTypeHovering] = useState(false);
    const TypeOfMealOptiondsList = ['Main', 'Breakfast', 'Dessert', 'Starter', 'Snack', 'Beverage']
    const MethodOptiondsList = ['Roasting', 'Baking', 'Boiling', 'Frying', 'Steaming', 'Smoking']
    const [title,setTitle] = useState(_title)
    const [ingredients,setIngredients] = useState("")
    const [method,setMethod] = useState("")
    const [mealType,setMealType] = useState("")

    const handleMouseOver_Method = () => {
        setIsMethodHovering(true);
    };

    const handleMouseOut_Method = () => {
        setIsMethodHovering(false);
    };

    const handleMouseOver_Type = () => {
        setIsTypeHovering(true);
    };

    const handleMouseOut_Type = () => {
        setIsTypeHovering(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("submit search")
        console.log(title)
        console.log(ingredients)
        console.log(method)
        console.log(mealType)
        
        getSearchResult(
            title, ingredients, method, mealType
        ).then((info) => {
            setRecipeList(info)
        }).catch((err) => {
            console.log("getSearchResult err: " + err);
        })
    }

    const getTitle = (e) => {
        setTitle(e.target.value)
    }

    const getIngredients= (e) => {
        setIngredients(e.target.value)
    }

    useEffect(()=>{
        getSearchResult(
            title, ingredients, method, mealType
        ).then((info) => {
            setRecipeList(info)
        }).catch((err) => {
            console.log("getSearchResult err: " + err);
        })
    },[])

    return (
        <form className={classes.root} onSubmit={handleSearch}>
            <div className={classes.inoputText}>
                <TextField InputLabelProps={{ style: { fontFamily: 'Cinzel', fontWeight: 'bold', } }} label="title" onChange={getTitle} defaultValue={_title}/>
            </div>
            <div className={classes.inoputText}>
                <TextField InputLabelProps={{ style: { fontFamily: 'Cinzel', fontWeight: 'bold', } }} label="main ingredients" onChange={getIngredients}/>
            </div>
            <div className={classes.formControl}
                onMouseEnter={handleMouseOver_Method}
                onMouseLeave={handleMouseOut_Method}>
                <InputLabel id="demo-controlled-open-select-label" className={classes.selector} >
                    <Typography style={{ fontSize: '1rem' }}> methods </Typography>
                    <ExpandMoreIcon style={{ fontSize: '1rem', marginLeft: '10px' }} />
                </InputLabel>
                {isMethodHovering ? <ExpandMethodSelector classes={classes} OptionList={MethodOptiondsList} setOptionList={setMethod}/> : null}
            </div>
            <div className={classes.formControl}
                onMouseEnter={handleMouseOver_Type}
                onMouseLeave={handleMouseOut_Type}>
                <InputLabel id="demo-controlled-open-select-label" className={classes.selector} >
                    <Typography style={{ fontSize: '1rem' }}> meal of type </Typography>
                    <ExpandMoreIcon style={{ fontSize: '1rem', marginLeft: '10px' }} />
                </InputLabel>
                {isTypeHovering ? <ExpandTypeSelector classes={classes} OptionList={TypeOfMealOptiondsList} setOptionList={setMealType}/> : null}
            </div>
            <IconButton type="submit">
                <SearchIcon />
            </IconButton>
        </form>
    );
}
