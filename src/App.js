import React, {Component} from 'react';
import './App.scss';
import BudgetController from './BudgetController.js'
import SavingsController from './SavingsController.js'
import StocksController from './StocksController.js'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {createBrowserHistory} from 'history'

const Home = () => <div>Home</div>

class App extends Component {
    render() {
        return (
        <MuiThemeProvider>
            <Router history={createBrowserHistory()}>
                <div className="App">
                    <header>
                        <Link to="/home" id="homeLink">My Money Manager</Link>
                        <Link to="/budgets">Budgets</Link>
                        <Link to="/savings">Savings</Link>
                        <Link to="/stocks">Stocks</Link>
                    </header>

                    <Route exact path="/" component={BudgetController}/>
                    <Route exact path="/home" component={Home}/>
                    <Route path="/budgets" component={BudgetController}/>
                    <Route path="/budget/:budgetId" component={BudgetController}/>
                    <Route path="/stocks" component={StocksController}/>
                </div>
            </Router>
        </MuiThemeProvider>
        );
    }
}

export default App;
