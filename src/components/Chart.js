import React, {useEffect, useState} from 'react';
import { useTheme } from '@material-ui/core/styles';
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip} from 'recharts';
import Title from './Title';
import axios from "axios";
import {BASE_URL} from "../url";

export default function Chart() {
    const theme = useTheme();

    const [data, setData] = useState([])

    useEffect(()=>{getData()},[])

    const getData = () => {
        axios({
            method: 'get',
            url: BASE_URL+'/myportfoliovaluetime?userId='+localStorage.getItem('userId'),
        })
            .then(function (response) {
                console.log(response);
                if(response.data.message === undefined){
                    console.log(response.data);
                    setData(response.data);
                }else{
                    console.log(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    console.log(data);

    return (
        <React.Fragment>
            <Title>Portfolio Value (5 Days)</Title>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary}>
                        <Label
                            angle={270}
                            position="left"
                            style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                        >
                            Value ($)
                        </Label>
                    </YAxis>
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} activeDot={{ r: 8 }}/>
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}