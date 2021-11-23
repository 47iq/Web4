import React, {Component} from "react";

import './table.css';

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    render() {
        if (!this.props.checks || this.props.checks.length === 0)
            return (
                <div className={"table-wrapper"}/>
            )
        return (
            <div className={"table-wrapper"}>
                <table className="table is-bordered is-hoverable is-fullwidth has-text-centered">
                    <thead>
                    <tr>
                        <th>
                            {this.props.coordinateX}
                        </th>
                        <th>
                            {this.props.coordinateY}
                        </th>
                        <th>
                            {this.props.radius}
                        </th>
                        <th>
                            {this.props.hit}
                        </th>
                        <th>
                            {this.props.ldt}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {(this.props.checks) ? this.props.checks.map(function (check) {
                            return (
                                <tr key={check.pointId}>
                                    <td>{Math.floor(check.coordinateX * 100) / 100}</td>
                                    <td>{Math.floor(check.coordinateY * 100) / 100}</td>
                                    <td>{Math.floor(check.radius * 100) / 100}</td>
                                    <td style={{color: check.hit ? '#00a404' : '#cb0101'}}>{check.hit.toString()}</td>
                                    <td>{check.time.toString()}</td>
                                </tr>
                            );
                        }) :
                        <tr>
                            <td colSpan={5}>Loading...</td>
                        </tr>}
                    </tbody>
                </table>
            </div>)
    }
}

export default Table