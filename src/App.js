import React, {Component} from 'react';
import './App.scss';
import BudgetController from './BudgetController.js'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import {createBrowserHistory} from 'history'

const Home = () => <div>Home</div>

class App extends Component {
    render() {
        return (
            <Router history={createBrowserHistory()}>
                <div className="App">
                    <header>
                        <Link to="/home" id="homeLink">My Money Manager</Link>
                        <Link to="/budgets">Budgets</Link>
                        <Link to="/budgets">Savings</Link>
                        <Link to="/budgets">Retirement</Link>
                    </header>

                    <Route exact path="/" component={BudgetController}/>
                    <Route exact path="/home" component={Home}/>
                    <Route path="/budgets" component={BudgetController}/>
                    <Route path="/budget/:budgetId" component={BudgetController}/>
                </div>
            </Router>
        );
    }
}

export default App;
