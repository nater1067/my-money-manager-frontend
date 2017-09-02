import React, {Component} from 'react';
import './App.scss';
import request from 'request'
import {apiHost} from './config'
import {Bar} from 'react-chartjs-2';

const BarChart = (props) => {

    const nextSixMonths = ['October', 'November', 'December', 'January', 'February', 'March']

    const startingSavingsAmount = 0

    const combinedMonthlySavings = props.savingsExpenses.reduce((acc, x) => acc + x.amount, 0)

    const monthNumbers = [1, 2, 3, 4, 5, 6]

    const monthsSavingsTotal = monthNumbers.map(monthNumber => monthNumber * combinedMonthlySavings)

    const data = {
        labels: nextSixMonths,
        datasets: [
            {
                label: 'My Savings',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: monthsSavingsTotal
            }
        ]
    }

    return (
        <div>
            <Bar data={data} />
        </div>
    )
}

const fetchSavingsExpenses = () => {
    return new Promise((resolve, reject) => {
        request(`${apiHost}/expenses?tags=savings`, function (error, response, body) {
            resolve(JSON.parse(body)["expenses"]);
        });
    });
}

export default class SavingsController extends Component {
    constructor(props) {
        super(props)
        // const maybeBudgetId = props.match.params.budgetId TODO - URL QUERY PARAM EXAMPLE
        this.state = {savingsExpenses: []}
    }

    componentDidMount() {
        fetchSavingsExpenses()
            .then(savingsExpenses => {
                this.setState({savingsExpenses})
            })
    }

    render() {
        const {savingsExpenses} = this.state

        const savingsExpenseComponents = savingsExpenses.map(se => {
            return (
                <div key={se.id}>{ se.name } - {se.amount}</div>
            )
        })
        return (
            <div className="container">
                <div className="nav">
                    { savingsExpenseComponents }
                </div>
                <div className="main">
                    {savingsExpenses.length > 0 && <BarChart savingsExpenses={savingsExpenses} />}
                </div>
            </div>
        )
    }
}