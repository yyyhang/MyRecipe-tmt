import React from 'react';
import { useState, useRef } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import Add from '../../images/addIcon.png';
import Delete from '../../images/delete.png';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { FormHelperText } from '@material-ui/core';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
    // borderColor:'grey',
  },
  input: {
    borderRadius: 4,
    width:100,
    border: '0.5px solid gray',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      backgroundColor:'transparent',
      boxShadow: '0 0 0 0.05rem blue',
    },

  },

}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    alignItems:'center',
  },
  textInput:{
    margin: theme.spacing(1),
    height:10,
  },
  amountInput:{
    width:150,
    height:42,
    marginTop:theme.spacing(0.9),
    marginRight:theme.spacing(1),
  },
  ingredientInput:{
    width:180,
    height:40,
    margin: theme.spacing(1),
  },
  root:{
    margin: theme.spacing(1),
    marginBottom:60,
  },
  input1:{
    marginTop:25,
   
  },
  input2:{
    marginTop:24,
  },
  label:{
    margin:theme.spacing(1.4),
  },
  table: {
    display:'flex',
    justifyContent:'center',
    textAlign:'center',
    marginTop:20,
  },
}));


export default function CustomizedSelects(props) {
  const {resultList,setResultList}=props;
  
  const classes = useStyles();
  const [unit, setUnit] = useState('');
  const ingredient = useRef('');
  const [amountNum,setAmountNum] = useState('')

  const handleUnit = (event) => {
    setUnit(event.target.value);
  };

  const handleChangeAmount=(event)=>{
    const subValue = event.target.value.replace(/[^1-9]{0,1}(\d*(?:\.\d{0,2})?).*$/g, '$1')
    setAmountNum(subValue)
  }

  const finalList = {};
  const handleBtnClick=()=>{
    if (ingredient.current.value==='' ||amountNum==='' ){
      alert('Please enter the valid ingredient value')
    }else{
    const tempNum = resultList.length;
    finalList[tempNum]={"name":ingredient.current.value,"amount":amountNum,"units":unit}
    setResultList([...resultList,finalList])
    }
  }
  const helperTextProps = {
    style: { marginTop:8}
  };

  const handleDelete=()=>{
    const tempNum = resultList.length;
    const tempList = resultList.filter((item)=>parseInt(Object.keys(item)[0],10)!==(tempNum-1)) 
    setResultList(tempList);

  }
  return (
    <div className={classes.root} >
      <TextField variant="outlined"
          label="Amount " margin="normal" name="recipeName" 
          InputProps={{className:classes.amountInput}}
          className = {classes.input1}
          value={amountNum}
          onChange={handleChangeAmount}
          helperText="Digits Only"
          FormHelperTextProps={helperTextProps} 
          autoComplete="amount" />

      <FormControl className={classes.margin}>
        <InputLabel  className = {classes.label} htmlFor="demo-customized-select-native">Unit</InputLabel>
        <NativeSelect
          id="demo-customized-select-native"
          value={unit}
          onChange={handleUnit}
          input={<BootstrapInput />}
        >
          <option aria-label="None" value="" />
          <option value={"cup"}>cup</option>
          <option value={"g"}>g</option>
          <option value={"ml"}>ml</option>
          <option value={"oz"}>oz</option>
          <option value={"spoons"}>spoons</option>
        </NativeSelect>
        <FormHelperText style={{marginTop:10}}>Select the best unit</FormHelperText>
      </FormControl>


      <TextField variant="outlined"
          label="Ingredient  "
          margin="normal"
          inputRef={ingredient}
          autoComplete="ingredient"
          InputProps={{className:classes.ingredientInput}}
          className = {classes.input2}
          helperText="Please be Concise"
           />
   
      <img src={Add} onClick ={handleBtnClick} alt={""} style={{height:40,width:40,marginTop:30,marginLeft:10}}/>
      <img src={Delete} onClick ={handleDelete} alt={""} style={{height:38,width:35,marginLeft:10}} />


     <TableContainer >
       <Table className={classes.table} >
       <TableBody >
      
      {
          resultList.length>0  && resultList.map((item,index)=>{
            const temp=Object.values(item)[0];
            const {name,amount,units}=temp;
            return (
              <div >
              <TableRow key={index}>
                  <TableCell>Amount: {amount}  </TableCell>
                  <TableCell>Units: {units}</TableCell>
                  <TableCell>Ingredient:  {name} </TableCell>
              </TableRow>
              </div>
            )
          })
        }
     
        </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}
