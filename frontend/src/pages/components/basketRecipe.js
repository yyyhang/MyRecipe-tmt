import React from "react";
import {
    makeStyles,
    Grid,
    Typography,
    IconButton,
    Divider,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableRow,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    deleteBasket,
} from './api';

const useStyles = makeStyles({
    table: {
        width: '80%',
        margin: 'auto',
    },
    nameCell: {
        borderBottom: "none",
        // marginBottom:'20',
        width: "50%",
    },
    qttCell: {
        borderBottom: "none",
        width: "20%",
    },
    unitCell: {
        borderBottom: "none",
        width: "30%",
    },
    title: {
        marginTop: 20
    }

});

export default function basketRecipe(props) {
    //display the recipe on food basket page and view summary
    const classes = useStyles();
    const { ingredients, recipeName, recipeId } = props;
    // const token = localStorage.getItem('token');

    // function handleDeleteBasket() {
    //     deleteBasket(localStorage.getItem('token'), recipeId);
    // }

    const handleDeleteBasket = () => {
        deleteBasket(localStorage.getItem('token'), recipeId)
            .then((info) => {
                if (info['deletefrombasket'] === 'deleted from basket') {
                    window.history.go(0)
                }
            }).catch((err) => {
                alert("error deleting recipe from basket", err.error)
            });

    }

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs className={classes.title}>
                    <Typography variant="h6" gutterBottom>
                        {recipeName}
                    </Typography>
                </Grid>

                {recipeName === 'All ingredients' ? null :
                    <Grid item xs={2}>
                        <IconButton
                            aria-label="delete"
                            // onClick={ confirm("Are you sure to delete these ingreditnes?")}
                            onClick={handleDeleteBasket}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                }
            </Grid>

            <Divider variant="middle" />
            <TableContainer >
                <Table className={classes.table} size="small" aria-label="simple table">
                    <TableBody>
                        {Object.values(ingredients).map((row) => (
                            <TableRow key={row.name}>
                                <TableCell className={classes.nameCell} >{row.name}</TableCell>
                                <TableCell className={classes.qttCell}>{row.amount}</TableCell>
                                <TableCell className={classes.unitCell} >{row.units}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}
