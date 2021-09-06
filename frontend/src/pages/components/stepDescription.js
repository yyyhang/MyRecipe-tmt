import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useRef } from "react";
import { primaryColor } from './styles';
import Add from '../../images/addIcon.png';
import Delete from '../../images/delete.png';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
    view: {
        display: "flex",
        flexDirection: 'column',
        width: 600,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: 'transparent',
    },
    textArea: {
        width: 490,
        height: 150,
    },

    inputName: {
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        marginTop: 30,
        width: 600,
        height: 50,
    },
    table: {
        width: "100%",
        display:'flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent:'center'
    },
    button: {
        height: 30,
        width: 30,
        margin: "5px 0px 5px 10px"
    },
    stepBox: {
        flexDirection: 'row',
        display: 'flex',
        margin: "50px 5px 30px 5px",
        alignItems: 'center',
        //   marginLeft:30,
    },

}));


export default function StepDescription(props) {
    //setting all teh steps and get the parramters from the parent components
    const { stepList, setStepList } = props;
    const classes = useStyles();
    const stepDetail = useRef('');

    const finalStepList = {};

    const handleBtnClick = () => {
        if (stepDetail.current.value === ''){
            alert('please enter the valid step detail')
        }
        else{
            const tempIndex = stepList.length;
            finalStepList[tempIndex] = stepDetail.current.value
            setStepList([...stepList, finalStepList])
        }
    }
    const handleDelete = () => {
        const tempIndex = stepList.length;
        const tempList = stepList.filter((item) => parseInt(Object.keys(item)[0],10) !== (tempIndex - 1))
        setStepList(tempList);
    }

    return (
        <div>
            <div className={classes.view}>
                <div className={classes.stepBox}>
                    <TextField variant="outlined"
                        multiline
                        label="Input your detailed Steps here"
                        maxRows={4}
                        inputRef={stepDetail}
                        backgroundColor={primaryColor}
                        InputProps={{ className: classes.textArea }}
                        helperText="Please press the plus button to preview your steps"
                    />
                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                        <img src={Add} alt={""} onClick={handleBtnClick} className={classes.button} />
                        <img src={Delete} alt={""}  onClick={handleDelete} className={classes.button} />
                    </div>


                </div>
                <TableContainer >
                    <Table className={classes.table} >
                        <TableBody >
                            {
                                stepList.length > 0 && Object.values(stepList).map((item, index) => {
                                    return (
                                        <div >
                                            <TableRow key={index}>
                                                <TableCell> Step {index + 1}  :  {Object.values(item)}</TableCell>
                                            </TableRow>
                                        </div>
                                    )
                                })
                            }

                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        </div>
    )
}
