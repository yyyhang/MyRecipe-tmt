import React, { useEffect, useState } from 'react';
import { Button } from "@material-ui/core";
import {
    getIfSub,
    postSub,
    deleteSub,
} from './api';


// const token = localStorage.getItem('token');

export default function subscribeButton({ contributor }) {

    const [buttonText, setButtonText] = useState("Unsubscribe");
    useEffect(() => {

        getIfSub(localStorage.getItem('token'), contributor).then((info) => {

            if (info.ifSub) {
                setButtonText("Unsubscribe");
            } else {
                setButtonText("Subscribe");
            }
        }).catch((err) => {

            // alert(err.error);
        })
    }, [contributor]);

    function toggleSubscribe(event) {
        event.preventDefault();

        if (buttonText === 'Subscribe') { // subscribe

            postSub(localStorage.getItem('token'), contributor)
                .then(
                    response => response.text()
                ).catch((err) => {
                    // alert("post sub error: ", err);
                })
        } else { // unsubscribe

            deleteSub(localStorage.getItem('token'), contributor)
                .then(
                    response => response.text()
                ).catch((err) => {
                    // alert("delete sub error: ", err);
                })
        };
        setButtonText(
            buttonText === "Subscribe" ? "Unsubscribe" : "Subscribe"
        );
    }

    return (
        <Button
            variant="contained"
            color='primary'
            onClick={toggleSubscribe}>
            {buttonText}
        </Button>
    );
}
