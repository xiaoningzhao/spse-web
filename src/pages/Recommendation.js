import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Title from "../components/Title";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import axios from "axios";
import {BASE_URL} from "../url";
import qs from "qs";
import {Cell, Pie, PieChart, ResponsiveContainer, Sector} from "recharts";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 350,
    },
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#d02bc0','#FF8042', '#5946d5'];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.ticker}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.ticker}: ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function Recommendation() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [strategies, setStrategies] = useState([]);
    const [selectedStrategies, setSelectedStrategies] = useState([]);
    const [message, setMessage] = useState('');
    const [portfolio, setPortfolio] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [leftover, setLeftover] = useState(0)
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(()=>{getStrategy();},[])

    const getStrategy = () => {
        axios({
            method: 'get',
            url: BASE_URL+'/strategy/all',
        })
            .then(function (response) {
                console.log(response);
                if(response.data.message === undefined){
                    console.log(response.data);
                    setStrategies(response.data);
                }else{
                    console.log(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(selectedStrategies);
        // console.log(event.target.amount.value);
        // console.log(event.target.date.value);
        setMessage('');
        if(selectedStrategies.length===0){
            setMessage('Please select strategy.');
            return;
        }
        if(event.target.amount.value === ''){
            setMessage('Please input amount.');
            return;
        }
        if(event.target.amount.value <=0 ){
            setMessage('Amount should be greater than 0');
            return;
        }
        if(event.target.date.value === ''){
            setMessage('Please select purchase date.');
            return;
        }
        if(new Date(event.target.date.value) > new Date()){
            setMessage('Please select a previous date');
            return;
        }

        let s = [];
        selectedStrategies.forEach((data,index)=>{
            s[index]=data.strategy;
        })

        console.log(s);

        axios({
            method: 'get',
            url: BASE_URL+'/suggest',
            params: {
                strategies: s,
                amount: event.target.amount.value,
                date: event.target.date.value
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            },
        })
            .then(function (response) {
                console.log(response);
                if(response.data.message === undefined){
                    console.log(response.data);
                    setPortfolio(response.data.portfolio);
                    setLeftover(response.data.leftover);
                }else{
                    console.log(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error.message);
            });

    }

    const saveMyPortfolio = (event) =>{
        event.preventDefault();
        setMessage('')
        if(localStorage.getItem('userId') === null){
            setMessage('Please sign in or sign up to save your portfolio')
            return;
        }
        if(portfolio.length === 0){
            setMessage('Please "Give Me Suggestion" first, then save your portfolio')
            return;
        }
        axios({
            method: 'post',
            url: BASE_URL+'/saveportfolio',
            data: {
                userId: localStorage.getItem('userId'),
                portfolio: portfolio,
            },
        })
            .then(function (response) {
                console.log(response);
                if(response.data.message === 'success'){
                    setMsg("Save Portfolio Successful");
                    setOpen(true);
                }else{
                    console.log(response.data.message);
                    setMessage(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error.message);
                setMessage(error.message);
            });

    }

    const onPieEnter = (data, index) => {
        setActiveIndex(index);
    };

    return (
        <Grid container spacing={3}>
            {/* Input */}
            <Grid item xs={6} >
                <Paper className={fixedHeightPaper}>
                    <React.Fragment>
                        <Title>Preference</Title>
                        <form className={classes.form} noValidate onSubmit={handleSubmit}>
                            <p style={{color: 'red'}}>{message}</p>
                            <Grid container spacing={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            multiple
                                            id="strategy"
                                            options={strategies}
                                            onChange={(event, newValue) => {
                                                setSelectedStrategies([
                                                    ...newValue,
                                                ]);
                                            }}
                                            disableCloseOnSelect
                                            getOptionLabel={(option) => option.strategy}
                                            renderOption={(option, { selected }) => (
                                                <React.Fragment>
                                                    <Checkbox
                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.strategy}
                                                </React.Fragment>
                                            )}
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" label="Strategy*" placeholder="Strategies" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            type = "number"
                                            defaultValue = {5000}
                                            id="amount"
                                            label="Amount($)"
                                            name="amount"
                                            autoComplete="amount"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="date"
                                            label="Purchase Date"
                                            type="date"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            required
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                </Grid>
                                <Grid item xs={5}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Give Me Suggestion
                                    </Button>
                                </Grid>
                                <Grid item xs={5}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={saveMyPortfolio}
                                    >
                                        Save My Portfolio
                                    </Button>
                                    <Snackbar
                                        anchorOrigin={{ vertical: 'top',
                                            horizontal: 'center', }}
                                        open={open}
                                        onClose={()=>{setOpen(false)}}
                                        message={msg}
                                    >
                                        <Alert onClose={()=>{setOpen(false)}} severity="success">
                                            {msg}
                                        </Alert>
                                    </Snackbar>
                                </Grid>
                            </Grid>
                        </form>
                    </React.Fragment>
                </Paper>
            </Grid>
            {/* Pie Chart */}
            <Grid item xs={6}>
                <Paper className={fixedHeightPaper}>
                    <React.Fragment>
                        <Title>Portfolio</Title>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={portfolio}
                                    // cx={200}
                                    // cy={200}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    nameKey="ticker"
                                    dataKey="amount"
                                    onMouseEnter={onPieEnter}
                                >
                                    {portfolio.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </React.Fragment>
                </Paper>
            </Grid>
            {/* Suggested Portfolio */}
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <React.Fragment>
                        <Title>Suggested Portfolio</Title>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ticker</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Share</TableCell>
                                    <TableCell>Purchase Price</TableCell>
                                    <TableCell>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {portfolio.map((row) => (
                                    <TableRow key={row.ticker}>
                                        <TableCell>{row.ticker}</TableCell>
                                        <TableCell>{row.ticker_name}</TableCell>
                                        <TableCell>{row.share}</TableCell>
                                        <TableCell>${row.purchase_price}</TableCell>
                                        <TableCell>${row.amount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell>Leftover :$ {leftover}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </React.Fragment>
                </Paper>
            </Grid>
        </Grid>
    );
}