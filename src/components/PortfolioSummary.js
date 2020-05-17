import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import axios from "axios";
import {BASE_URL} from "../url";


const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

const GetDate = () => {
    const now = new Date();
    return now.getMonth()+1+"/"+now.getDate()+"/"+now.getFullYear();
}

export default function PortfolioSummary() {
    const classes = useStyles();

    useEffect(()=>{getAmount()},[])

    const [amount, setAmount] = useState(0);

    const getAmount = () =>{
        axios({
            method: 'get',
            url: BASE_URL+'/myportfoliovalue?userId='+localStorage.getItem('userId'),
        })
            .then(function (response) {
                console.log(response);
                if(response.data.message === undefined){
                    console.log(response.data);
                    setAmount(response.data.total);
                }else{
                    console.log(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    return (
        <React.Fragment>
            <Title>Portfolio Summary</Title>
            <Typography component="p" variant="h4">
                ${amount}
            </Typography>
            <Typography color="textSecondary" className={classes.depositContext}>
                on {GetDate()}
            </Typography>
        </React.Fragment>
    );
}