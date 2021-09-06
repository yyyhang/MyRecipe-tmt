import React, { useEffect, useState } from 'react';
import MenuBar from "./components/menu";
import BasketRecipe from "./components/basketRecipe";
import { getBasketRecipes, getBasketSummary, clearBasket } from './components/api';

import PropTypes from 'prop-types';
import {
    makeStyles,
    Grid,
    Typography,
    Tab,
    Tabs,
    Paper,
    Button,
    Box,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableRow,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
    },
    table: {
        width: '80%',
        margin: 'auto',
      },
      nameCell: {
        borderBottom: "none",
        // marginBottom:'20',
        width:"50%",
    },
      qttCell: {
        borderBottom: "none",
        width:"20%",
      },
      unitCell: {
        borderBottom: "none",
        width:"30%",
      },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


export default function Checkout() {
    // const token = localStorage.getItem('token');
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [basketRecipe, setBasketRecipe] = useState([]);
    const [basketSummary, setBasketSummary] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        getBasketRecipes(localStorage.getItem('token')).then((info) => {
            setBasketRecipe(info);
        }).catch((err) => {
            alert("error getting recipe details", err.error)
        });

        getBasketSummary(localStorage.getItem('token')).then((info) => {
            setBasketSummary(info)
        }).catch((err) => {
            alert('output teh error', err.error)
        });
    }, []);

    const handleClearBusket = () => {
        clearBasket(localStorage.getItem('token')).then((info) => {
            if (info['basketclear'] === 'all basket items deleted') {
                window.history.go(0)
            }

        }).catch((err) => {
            alert("error clear", err.error)
        });

    }

    const SummaryCard = (props) => {
        const { item, value } = props;
        return (
            <TableContainer >
                <Table className={classes.table} size="small" aria-label="simple table">
                    <TableBody>
                        {Object.values(value).map((details, index) => (
                            <TableRow key={index}>
                                <TableCell className={classes.nameCell}>{item}</TableCell>
                                <TableCell className={classes.qttCell}>{details.amount}</TableCell>
                                <TableCell className={classes.unitCell}>{details.unit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        )
    }

    return (
        <div>
            <MenuBar />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Grid container className={classes.header}>
                        <Grid item xs>
                            <Typography component="h1" variant="h4">
                                My food basket
                            </Typography>
                        </Grid>

                    </Grid>
                    <Grid container className={classes.tabs} alignItems="center">
                        <Grid item xs>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab label="View by recipe" />
                                <Tab label="View Summary" />
                            </Tabs>
                        </Grid>

                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClearBusket}
                            >
                                Clear all
                            </Button>
                        </Grid>
                    </Grid>
                    
                    <TabPanel value={value} index={0}>
                        {basketRecipe && Object.values(basketRecipe).map((item, index) => (
                            <BasketRecipe
                                key={index}
                                recipeName={item.recipe_title}
                                ingredients={item.ingredients}
                                recipeId={item.recipe_id}
                            />
                        ))}
                    </TabPanel>

                    <TabPanel value={value} index={1}>
                        {basketSummary && Object.keys(basketSummary).map((item, index) => (
                            <SummaryCard item={item} value={basketSummary[item]} />
                        ))}
                    </TabPanel>

                </Paper>
            </main>
        </div>
    );
}
