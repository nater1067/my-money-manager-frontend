import React, {Component} from 'react';
import './App.css';
import Budget from './Budget.js'
import request from 'request'
import {apiHost} from './config'

const budget = {
    "expenses": [
        {
            "amount": -1300,
            "key": 1,
            "name": "Mortgage"
        },
        {
            "amount": -400,
            "key": 2,
            "name": "HOA"
        },
        {
            "amount": -120,
            "key": 3,
            "name": "Phone"
        },
        {
            "amount": -60,
            "key": 4,
            "name": "Internet"
        }
    ],
    "incomeStreams": [
        {
            "amount": 2000,
            "frequency": 2,
            "key": 1,
            "name": "Paycheck"
        },
        {
            "amount": 200,
            "frequency": 1,
            "key": 2,
            "name": "Investment Income"
        }
    ]
}


const fetchBudgetIds = () => {
    return new Promise((resolve, reject) => {
        request(`${apiHost}/budgets`, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.

            resolve(JSON.parse(body)["budget_ids"]);
        });
    });
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeBudgetId: "",
            budgetIds: [], // All available budget ids
        }
    }

    changeActiveBudgetId(event) {
        this.setState({activeBudgetId: event.target.value});
    }

    componentDidMount() {
        fetchBudgetIds()
            .then(budgetIds => {
                this.setState({budgetIds})
            })
    }

    submitLoadBudget(event) {
        event.preventDefault()
        this.loadBudget()
    }


    render() {
        const {budgetIds, activeBudgetId} = this.state

        const budgetOptions = this.state.budgetIds.map(x => (
            <option key={x} value={x}>Budget { x }</option>
        ))

        return (

            <div className="App">
                <header>
                    My Money Manager - Budget
                </header>

                <div className="container">
                    <div className="nav">
                        Select A Budget:<br/>
                        {/*<form onSubmit={this.submitLoadBudget.bind(this)}>*/}
                        <select value={this.state.budgetId} onChange={this.changeActiveBudgetId.bind(this)}>
                            <option>Select a budget</option>
                            {budgetOptions}
                        </select>
                        <input type="submit" value="Go"/>
                        {/*</form>*/}
                    </div>
                    <div className="main">
                        {activeBudgetId && <Budget budgetId={activeBudgetId}/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
