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
            newBudgetName: "",
            budgets: [], // All available budget ids
        }
    }

    changeActiveBudgetId(event) {
        this.setActiveBudgetId(event.target.value);
    }

    setActiveBudgetId(budgetId) {
        this.setState({activeBudgetId: budgetId});
    }

    componentDidMount() {
        this.reloadAllBudgets()
    }

    reloadAllBudgets() {
        return fetchBudgetIds()
            .then(budgets => {
                this.setState({budgets})
            })
    }

    changeNewBudgetName(event) {
        this.setState({newBudgetName: event.target.value});
    }

    createBudget(event) {
        const setActiveBudgetId = this.setActiveBudgetId.bind(this)
        const reloadAllBudgets = this.reloadAllBudgets.bind(this)
        const newBudgetName = this.state.newBudgetName

        request.post(
            `${apiHost}/budget/`,
            {
                form: {
                    name: newBudgetName,
                }
            },
            (err, httpResponse, body) => {
                reloadAllBudgets()
                    .then(() => {
                        debugger
                        setActiveBudgetId(JSON.parse(body)["id"])
                    })
            }
        );
    }

    deleteBudget = () => {
        const budgetId = parseInt(this.state.activeBudgetId)

        const budgetWithDeletedBudgetRemoved =
            this.state.budgets
                .filter(budget => budget.id !== budgetId)

        this.setState({
            budgets: budgetWithDeletedBudgetRemoved,
            activeBudgetId: "",
        })

        request.delete(
            {url: `${apiHost}/budgets/${budgetId}`},
            (error, httpResponse, body) => {}
        )
    }

    render() {
        const {budgets, activeBudgetId} = this.state

        const budgetOptions = this.state.budgets.map(budget => (
            <option key={budget.id} value={budget.id}>{ budget.name }</option>
        ))

        return (

            <div className="App">
                <header>
                    My Money Manager - Budget
                </header>

                <div className="container">
                    <div className="nav">
                        Select A Budget:<br/>
                        <select value={this.state.activeBudgetId} onChange={this.changeActiveBudgetId.bind(this)}>
                            <option>Select a budget</option>
                            {budgetOptions}
                        </select>
                        <button onClick={this.deleteBudget.bind(this)}>Delete Budget</button>

                        <br />
                        <br />
                        Create New Budget:
                        <input type="text" value={this.state.newBudgetName}
                               onChange={this.changeNewBudgetName.bind(this)}
                               placeholder="New budget name" />
                        <button onClick={this.createBudget.bind(this)}>Create</button>
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
