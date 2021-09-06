import React, { useEffect, useState } from 'react';
import { Button } from "@material-ui/core";
import {
    getIfBasket,
    postBasket,
    deleteBasket,
} from './api';

// const token = localStorage.getItem('token');

export default function addToBasket({ recipe: recipeId }) {

    const [buttonText, setButtonText] = useState("ifinbasket");
    useEffect(() => {
        getIfBasket(localStorage.getItem('token'), recipeId).then((info) => {
            // console.log('===backend data ifinbasket', info);
            if (info.ifBasket) {
                setButtonText("remove from basket");
            } else {
                setButtonText("add to basket");
            }        }).catch((err) => {
            console.log("error", err.error)
            // alert(err.error);
        })
    }, []);

    function toggleBasket(event) {
        event.preventDefault();
        if (buttonText === 'add to basket') {
            postBasket(localStorage.getItem('token'), recipeId)
                .then(
                    response => response.text()
                ).catch((err) => {
                    // alert("post basket error: ", err);
                })
        } else { // remove from basket
            deleteBasket(localStorage.getItem('token'), recipeId)
                .then(
                    response => response.text()
                ).catch((err) => {
                    // alert("delete basket error: ", err);
                })
        };
        setButtonText(
            buttonText === "add to basket" ? "remove from basket" : "add to basket"
        );
    }

    return (
        <Button
            variant="contained"
            color='primary'
            onClick={toggleBasket}>
            {buttonText}
        </Button>
    );
}
