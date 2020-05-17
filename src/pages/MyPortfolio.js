import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from '../components/Chart';
import PortfolioSummary from "../components/PortfolioSummary";
import PortfolioDetails from "../components/PortfolioDetails";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 300,
    },
}));

export default function MyPortfolio() {
    const classes = useStyles();

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                    <Chart />
                </Paper>
            </Grid>
            {/* PortfolioSummary Summary */}
            <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                    <PortfolioSummary />
                </Paper>
            </Grid>
            {/* PortfolioSummary Details */}
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <PortfolioDetails />
                </Paper>
            </Grid>
        </Grid>
    );
}