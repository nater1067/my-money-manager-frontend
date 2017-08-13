import React, {Component} from 'react';
import './Budget.css';
import numeral from 'numeral'
import request from 'request'
import {apiHost} from './config'

const formatCurrency = (amount) => numeral(amount).format('$0,0.00')

class BudgetIncomeStream extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{formatCurrency(this.props.amount)}</td>
                <td>{this.props.frequency}</td>
                <td>
                    <button>Delete</button>
                </td>
            </tr>
        )
    }
}

class BudgetExpense extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{formatCurrency(this.props.amount)}</td>
                <td/>
                <td>
                    <button>Delete</button>
                </td>
            </tr>
        )
    }
}

const fetchBudget = (budgetId) => {
    return new Promise((resolve, reject) => {
        request(`${apiHost}/budget/${budgetId}/`, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.

            resolve(JSON.parse(body));
        });
    });
}

class Budget extends Component {

    loadBudget() {
        const {budgetId} = this.state
        fetchBudget(budgetId)
            .then(budget => {
                this.setState({...budget})
            })
    }

    constructor(props) {
        super(props)
        this.state = {
            incomeStreams: [],
            expenses: [],
            budgetId: props.budgetId,
            newExpenseName: "",
            newExpenseAmount: "",
            newIncomeStreamName: "",
            newIncomeStreamAmount: "",
            newIncomeStreamFrequency: "",
        }
        this.loadBudget()
    }

    componentWillReceiveProps(nextProps) {
        // debugger

        const loadBudget = this.loadBudget.bind(this)

        if (nextProps.budgetId !== this.props.budgetId) {
            this.setState({budgetId: nextProps.budgetId}, () => {
                console.log(this.state)
                loadBudget()
            })
        }
    }

    componentDidMount() {
    }

    changeNewExpenseName(event) {
        this.setState({newExpenseName: event.target.value});
    }

    changeNewExpenseAmount(event) {
        this.setState({newExpenseAmount: event.target.value});
    }

    changeNewIncomeStreamName(event) {
        this.setState({newIncomeStreamName: event.target.value});
    }

    changeNewIncomeStreamAmount(event) {
        this.setState({newIncomeStreamAmount: event.target.value});
    }

    changeNewIncomeStreamFrequency(event) {
        this.setState({newIncomeStreamFrequency: event.target.value});
    }

    createNewExpense(event) {
        event.preventDefault()

        const loadBudget = this.loadBudget.bind(this)
        const clearNewExpenseForm = this.clearNewExpenseForm.bind(this)
        const {newExpenseName, newExpenseAmount, budgetId} = this.state

        request.post(
            `${apiHost}/budget/${budgetId}/expense/`,
            {
                form: {
                    name: newExpenseName,
                    amount: parseFloat(newExpenseAmount),
                }
            },
            () => {
                loadBudget()
                clearNewExpenseForm()
            }
        );
    }

    createNewIncomeStream(event) {
        event.preventDefault()

        const loadBudget = this.loadBudget.bind(this)
        const clearNewIncomeStreamForm = this.clearNewIncomeStreamForm.bind(this)
        const {newIncomeStreamName, newIncomeStreamAmount, newIncomeStreamFrequency, budgetId} = this.state

        request.post(
            `${apiHost}/budget/${budgetId}/incomeStream/`,
            {
                form: {
                    name: newIncomeStreamName,
                    amount: parseFloat(newIncomeStreamAmount),
                    frequency: newIncomeStreamFrequency,
                }
            },
            () => {
                loadBudget()
                clearNewIncomeStreamForm()
            }
        );
    }

    clearNewExpenseForm() {
        this.setState({
            newExpenseAmount: "",
            newExpenseName: "",
        });
    }

    clearNewIncomeStreamForm() {
        this.setState({
            newIncomeStreamAmount: "",
            newIncomeStreamName: "",
            newIncomeStreamFrequency: "",
        });
    }

    render() {
        const budgetIncomeStreams = this.state.incomeStreams.map(x => <BudgetIncomeStream {...x}/>)
        const budgetExpenses = this.state.expenses.map(x => <BudgetExpense {...x}/>)

        return (
            <div>
                <div className="BudgetIncome">
                    <h2>Income</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Frequency</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {budgetIncomeStreams}
                        {this.state.incomeStreams.length % 2 === 0 && <tr>
                            <td>&nbsp;</td>
                            <td/>
                            <td/>
                            <td/>
                        </tr>}
                        <tr>
                            <td><input type="text" value={this.state.newIncomeStreamName}
                                       onChange={this.changeNewIncomeStreamName.bind(this)}
                                       placeholder="New income stream name"/></td>
                            <td><input type="text" value={this.state.newIncomeStreamAmount}
                                       onChange={this.changeNewIncomeStreamAmount.bind(this)} placeholder="1000"/></td>
                            <td><input type="text" value={this.state.newIncomeStreamFrequency}
                                       onChange={this.changeNewIncomeStreamFrequency.bind(this)} placeholder="2"/></td>
                            <td>
                                <button onClick={this.createNewIncomeStream.bind(this)}>Create</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="BudgetExpense">
                    <h2>Expenses</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th/>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {budgetExpenses}
                        {this.state.expenses.length % 2 === 0 && <tr>
                            <td>&nbsp;</td>
                            <td/>
                            <td/>
                            <td/>
                        </tr>}
                        <tr>
                            <td><input type="text" value={this.state.newExpenseName}
                                       onChange={this.changeNewExpenseName.bind(this)}
                                       placeholder="New income stream name"/></td>
                            <td><input type="text" value={this.state.newExpenseAmount}
                                       onChange={this.changeNewExpenseAmount.bind(this)} placeholder="1000"/></td>
                            <td/>
                            <td>
                                <button onClick={this.createNewExpense.bind(this)}>Create</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="BudgetLeftOver">
                    <h2>Left Over</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Total</th>
                            <th>$1200.00</th>
                            <th/>
                            <th/>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        );
    }
}

export default Budget;
