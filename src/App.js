import React, { Component } from 'react';
import './App.css';
import Budget from './Budget.js'

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

class App extends Component {
  render() {
    return (

      <div className="App">
          <header>
              My Money Manager - Budget
          </header>
        <Budget {...budget} />
      </div>
    );
  }
}

export default App;
