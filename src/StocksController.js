import React, {Component} from 'react';
import './Stocks.scss';
import request from 'request'
import {apiHost} from './config'
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600, green600, red600} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';

const StocksList = ({ownedStocks}) => {

    const ownedStocksComponents = ownedStocks.map(stock => (
        <ListItem
            leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={stock.periodDelta < 0 ? red600 : green600} />}
            rightIcon={<ActionInfo />}
            primaryText={stock.ticker + " " + stock.periodDelta}
            secondaryText={stock.description}
        />
    ))

    return (
        <div>
            <List>
                <Subheader inset={true}>Stocks You Own</Subheader>
                {ownedStocksComponents}
            </List>
            <Divider inset={true} />
            <List>
                <Subheader inset={true}>Stocks of Interest</Subheader>
                {ownedStocksComponents}
            </List>
        </div>
    );
}

const ownedStocks = [
    {
        "ticker": "KR",
        "description": "Kroger Grocery Stores",
        "periodDelta": .06
    },
    {
        "ticker": "WYNN",
        "description": "Wynn Resorts",
        "periodDelta": -.03
    },
    {
        "ticker": "TSLA",
        "description": "Tesla, Inc.",
        "periodDelta": .11
    },
    {
        "ticker": "SNAP",
        "description": "Snap Inc.",
        "periodDelta": -.02
    },
]

export default class StocksController extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="container material">
                <div className="nav">
                    <RaisedButton label="Buy More Stock" primary={true} fullWidth={true} /><br />
                    <RaisedButton label="Sell Stock" fullWidth={true} /><br />
                    <RaisedButton label="Panic!" secondary={true} fullWidth={true} />
                </div>
                <div className="main">
                    <StocksList ownedStocks={ownedStocks} />
                </div>
            </div>
        )
    }
}