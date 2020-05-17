import React, {useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import axios from "axios";
import {BASE_URL} from "../url";

const CurrentPrice = (ticker) => {
    console.log(ticker);

    const [price, setPrice] = useState(0);

    useEffect(()=>{getCurrentPrice()},[]);

    const getCurrentPrice = () =>{
        axios({
            method: 'get',
            url: BASE_URL+'/currentprice?ticker='+ticker.ticker,
        })
            .then(function (response) {
                console.log(response);
                if(response.data.message === undefined){
                    setPrice(response.data.price)
                }else{
                    console.log(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    return (
        <TableCell align="right">{price}</TableCell>
    );
}

export default function PortfolioDetails() {
    const [rows, setRows] = useState([]);
    useEffect(()=>{getMyPortfolio()},[])

    const getMyPortfolio = () =>{
        axios({
            method: 'get',
            url: BASE_URL+'/myportfolio?userId='+localStorage.getItem('userId'),
        })
            .then(function (response) {
                console.log(response);
                if(response.data.message === undefined){
                    setRows(response.data);
                    console.log(rows);
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
            <Title>Portfolio Details</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Ticker</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Share</TableCell>
                        <TableCell>Purchase Price</TableCell>
                        <TableCell align="right">Current Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.ticker}>
                            <TableCell>{row.ticker}</TableCell>
                            <TableCell>{row.ticker_name}</TableCell>
                            <TableCell>{row.share}</TableCell>
                            <TableCell>{row.purchase_price}</TableCell>
                            <CurrentPrice ticker={row.ticker} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}