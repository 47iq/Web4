import React, {Component} from "react";
import {getAll} from "../../api/request";

import '../../css/table.css';
import store from "../../app/store";

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        store.subscribe(() => {
            this.setState({reduxState: store.getState()});
        })
    }

    onSort(event, sortKey) {
        const data = this.state.data;
        data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        this.setState({data})
    }


    render() {
        return (
            <div className={"table-wrapper"}>
                <table className="table is-bordered is-hoverable is-fullwidth has-text-centered">
                    <thead>
                    <tr>
                        <th onClick={e => this.onSort(e, 'coordinateX')}>
                            {this.props.coordinateX}
                            <i className="fas fa-sort"/>
                        </th>
                        <th onClick={e => this.onSort(e, 'coordinateY')}>
                            {this.props.coordinateY}
                            <i className="fas fa-sort"/>
                        </th>
                        <th onClick={e => this.onSort(e, 'radius')}>
                            {this.props.radius}
                            <i className="fas fa-sort"/>
                        </th>
                        <th onClick={e => this.onSort(e, 'hit')}>
                            {this.props.hit}
                            <i className="fas fa-sort"/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {(store.getState().checks) ? store.getState().checks.map(function (check) {
                        return (
                            <tr>
                                <td>{check.coordinateX}</td>
                                <td>{check.coordinateY}</td>
                                <td>{check.radius}</td>
                                <td>{check.hit.toString()}</td>
                            </tr>
                        );
                    }) : ''}
                    </tbody>
                </table>
            </div>)
    }
}

export default Table