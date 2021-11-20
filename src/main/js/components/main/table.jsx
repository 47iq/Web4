import React, {Component} from "react";
import {getAll} from "../../api/request";

import '../../css/table.css';

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        getAll()
            .then(function (response) {
                return response.json();
            })
            .then(items => this.setState({data: items}));
        console.log(this.state.data)
    }

    onSort(event, sortKey) {
        const data = this.state.data;
        data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        this.setState({data})
    }


    render() {
        let newdata = this.state.data;
        let {coordinateX, coordinateY, radius, hit} = this.props;
        return (
            <div className={"table-wrapper"}>
                <table className="table is-bordered is-hoverable is-fullwidth has-text-centered">
                    <thead>
                    <tr>
                        <th onClick={e => this.onSort(e, 'coordinateX')}>
                            {coordinateX}
                            <i className="fas fa-sort"/>
                        </th>
                        <th onClick={e => this.onSort(e, 'coordinateY')}>
                            {coordinateY}
                            <i className="fas fa-sort"/>
                        </th>
                        <th onClick={e => this.onSort(e, 'radius')}>
                            {radius}
                            <i className="fas fa-sort"/>
                        </th>
                        <th onClick={e => this.onSort(e, 'hit')}>
                            {hit}
                            <i className="fas fa-sort"/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {(newdata) ? newdata.map(function (check) {
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