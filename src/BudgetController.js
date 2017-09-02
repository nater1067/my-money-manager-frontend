import React, {Component} from 'react';
import './App.scss';
import Budget from './Budget.js'
import request from 'request'
import {apiHost} from './config'
import { Link } from 'react-router-dom'

const fetchBudgetIds = () => {
    return new Promise((resolve, reject) => {
        request(`${apiHost}/budgets`, function (error, response, body) {
            resolve(JSON.parse(body)["budget_ids"]);
        });
    });
}

export default class BudgetController extends Component {
    constructor(props) {
        super(props)
        const maybeBudgetId = props.match.params.budgetId
        this.state = {
            activeBudgetId: maybeBudgetId !== undefined ? parseInt(maybeBudgetId) : "",
            newBudgetName: "",
            budgets: [], // All available budget ids
        }
    }

    setActiveBudgetId(budgetId) {
        this.setState({activeBudgetId: budgetId});
    }

    componentDidMount() {
        this.reloadAllBudgets()
    }

    componentDidUpdate(prevProps, prevState) {
        const maybeNewBudgetId = this.props.match.params.budgetId

        if (maybeNewBudgetId !== undefined
            && parseInt(maybeNewBudgetId) !== prevState.activeBudgetId) {
            this.setActiveBudgetId(parseInt(maybeNewBudgetId))
        }
    }

    reloadAllBudgets() {
        return fetchBudgetIds()
            .then(budgets => {
                this.setState({budgets})
                if (this.state.activeBudgetId === "" && budgets[0] !== undefined) {
                    this.setActiveBudgetId(budgets[0]["id"])
                }
            })
    }

    changeNewBudgetName(event) {
        this.setState({newBudgetName: event.target.value});
    }

    createBudget(event) {
        const setActiveBudgetId = this.setActiveBudgetId.bind(this)
        const reloadAllBudgets = this.reloadAllBudgets.bind(this)
        const newBudgetName = this.state.newBudgetName
        const pushHistory = this.props.history.push

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
                        const newlyCreatedBudgetID = JSON.parse(body)["id"]
                        pushHistory(`/budget/${newlyCreatedBudgetID}`)
                    })
            }
        );
    }

    deleteBudget = () => {
        const budgetId = parseInt(this.state.activeBudgetId)

        const pushHistory = this.props.history.push

        request.delete(
            {url: `${apiHost}/budgets/${budgetId}`},
            (error, httpResponse, body) => {
                pushHistory("/budgets")
            }
        )
    }

    render() {
        const {budgets, activeBudgetId} = this.state

        const activeBudget = budgets.find(x => x.id == activeBudgetId)

        const budgetLinks = budgets.map(budget => (
            <div key={budget.id}><Link to={`/budget/${budget.id}`} className={(activeBudgetId === budget.id ? 'activeButton' : 'inactiveButton')}>{ budget.name }</Link></div>
        ))

        return (
            <div className="container">
                <div className="nav">
                    Budgets<br/>
                    {budgetLinks}
                    {activeBudget !== undefined && <button className="deleteButton" onClick={this.deleteBudget.bind(this)}>Delete { activeBudget.name }</button>}

                    <br />
                    <br />
                    <input type="text" value={this.state.newBudgetName}
                           onChange={this.changeNewBudgetName.bind(this)}
                           placeholder="New budget name" />
                    <button className="primaryButton" onClick={this.createBudget.bind(this)}>Create</button>
                </div>
                <div className="main">
                    {activeBudgetId && <Budget budgetId={activeBudgetId}/>}
                </div>
            </div>
        )
    }
}
