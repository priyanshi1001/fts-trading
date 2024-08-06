import React, { useEffect } from "react";
import { callTickleApi } from "./api/ApiCall";

export default function Index() {

    useEffect(() => {
        setInterval(() => {
            callTickleApi().then((response) => {
            }).catch((err) => {
                console.log("Tickle Error:", err.message);
            });
        }, 1000 * 50);

        callTickleApi().then((response) => {
        }).catch((err) => {
            console.log("Tickle Error:", err.message);
        });
    }, []);

    return (
        <></>
    )
}