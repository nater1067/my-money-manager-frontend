import React, {Component} from 'react';
import './Budget.scss';
import numeral from 'numeral'
import request from 'request'
import {apiHost} from './config'

const formatCurrency = (amount) => numeral(amount).format('$0,0.00')

class BudgetIncomeStream extends Component {
    render() {
        const {deleteButtonPress} = this.props
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{formatCurrency(this.props.amount)}</td>
                <td>{this.props.frequency}</td>
                <td>
                    <button onClick={deleteButtonPress} className="deleteButton">Delete</button>
                </td>
            </tr>
        )
    }
}

class BudgetExpense extends Component {
    render() {
        const {deleteButtonPress, savingsButtonPress} = this.props
        const hasSavingsTag = this.props.tags.includes("savings");
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{formatCurrency(this.props.amount)}</td>
                <td/>
                <td>
                    <button onClick={deleteButtonPress} className="deleteButton">Delete</button>
                    <button onClick={savingsButtonPress} className={(hasSavingsTag ? 'activeButton primaryButton' : 'inactiveButton primaryButton')}>Savings</button>
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
            totalLeftOver: 0,
            totalExpenses: 0,
            totalIncome: 0,
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

    deleteIncomeStream = (incomeStreamId) => (event) => {
        const incomeStreamWithDeletedIncomeStreamRemoved =
            this.state.incomeStreams
                .filter(incomeStream => incomeStream.id !== incomeStreamId)

        this.setState({incomeStreams: incomeStreamWithDeletedIncomeStreamRemoved})

        request.delete(
            {url: `${apiHost}/incomeStream/${incomeStreamId}`},
            (error, httpResponse, body) => {}
        )
    }

    deleteExpense = (expenseId) => (event) => {
        const expenseWithDeletedExpenseRemoved =
            this.state.expenses
                .filter(expense => expense.id !== expenseId)

        this.setState({expenses: expenseWithDeletedExpenseRemoved})

        request.delete(
            {url: `${apiHost}/expense/${expenseId}`},
            (error, httpResponse, body) => {}
        )
    }

    addTagToExpense = (expenseId, tagToAdd) => (event) => {
        const expensesWithNewlyTaggedExpense =
            this.state.expenses
                .map(expense => {
                    if (expense.id == expenseId) {
                        expense.tags.push(tagToAdd)
                    }

                    return expense;
                })

        this.setState({expenses: expensesWithNewlyTaggedExpense})

        request.post(
            {url: `${apiHost}/expense/${expenseId}/tags/${tagToAdd}`},
            (error, httpResponse, body) => {}
        )
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
        const budgetIncomeStreams = this.state.incomeStreams.map(incomeStream => (
            <BudgetIncomeStream {...incomeStream} deleteButtonPress={this.deleteIncomeStream(incomeStream.id)}/>
        ))
        const budgetExpenses = this.state.expenses.map(expense => {
            return (
                <BudgetExpense {...expense} savingsButtonPress={this.addTagToExpense(expense.id, 'savings')} deleteButtonPress={this.deleteExpense(expense.id)}/>
            )
        })

        return (
            <div>
                <div className="BudgetSection">
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
                        <tr>
                            <td><input type="text" value={this.state.newIncomeStreamName}
                                       onChange={this.changeNewIncomeStreamName.bind(this)}
                                       placeholder="New income stream name"/></td>
                            <td><input type="text" value={this.state.newIncomeStreamAmount}
                                       onChange={this.changeNewIncomeStreamAmount.bind(this)} placeholder="1000"/></td>
                            <td><input type="text" value={this.state.newIncomeStreamFrequency}
                                       onChange={this.changeNewIncomeStreamFrequency.bind(this)} placeholder="2"/></td>
                            <td>
                                <button className="primaryButton" onClick={this.createNewIncomeStream.bind(this)}>Create</button>
                            </td>
                        </tr>
                        {this.state.incomeStreams.length % 2 !== 0 && <tr>
                            <td>&nbsp;</td>
                            <td/>
                            <td/>
                            <td/>
                        </tr>}
                        <tr>
                            <td>Total Income</td>
                            <td>{formatCurrency(this.state.totalIncome)}</td>
                            <td/>
                            <td/>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="BudgetSection">
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
                        <tr>
                            <td><input type="text" value={this.state.newExpenseName}
                                       onChange={this.changeNewExpenseName.bind(this)}
                                       placeholder="New income stream name"/></td>
                            <td><input type="text" value={this.state.newExpenseAmount}
                                       onChange={this.changeNewExpenseAmount.bind(this)} placeholder="1000"/></td>
                            <td/>
                            <td>
                                <button className="primaryButton" onClick={this.createNewExpense.bind(this)}>Create</button>
                            </td>
                        </tr>
                        {this.state.expenses.length % 2 !== 0 && <tr>
                            <td>&nbsp;</td>
                            <td/>
                            <td/>
                            <td/>
                        </tr>}
                        <tr>
                            <td>Total Expenses</td>
                            <td>{formatCurrency(this.state.totalExpenses)}</td>
                            <td/>
                            <td/>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="BudgetSection">
                    <h2>Totals</h2>
                    <table>
                        <thead>
                            <tr className="displayNone">
                                <td />
                                <td />
                                <td />
                                <td />
                            </tr>
                            <tr>
                                <td>Income</td>
                                <td>{formatCurrency(this.state.totalIncome)}</td>
                                <td />
                                <td />
                            </tr>
                            <tr>
                                <td>Expenses</td>
                                <td>{formatCurrency(this.state.totalExpenses)}</td>
                                <td />
                                <td />
                            </tr>
                            <tr>
                                <td>Left Over</td>
                                <td>{formatCurrency(this.state.totalLeftOver)}</td>
                                <td />
                                <td />
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        );
    }
}

export default Budget;
