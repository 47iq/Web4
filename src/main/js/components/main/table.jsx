import React, {Component} from "react";

import '../../css/table.css';
import store from "../../app/store";

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        this.mounted = true;
        store.subscribe(() => {
            if (this.mounted)
                this.setState({reduxState: store.getState()});
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onSort(event, sortKey) {
        const data = this.state.data;
        data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        this.setState({data})
        /* onClick={e => this.onSort(e, 'hit')}*/
    }


    render() {
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
                    {(store.getState().checks) ? store.getState().checks.map(function (check) {
                            return (
                                <tr key={check.pointId}>
                                    <td>{Math.round((check.coordinateX + Number.EPSILON) * 100) / 100}</td>
                                    <td>{Math.round((check.coordinateY + Number.EPSILON) * 100) / 100}</td>
                                    <td>{Math.round((check.radius + Number.EPSILON) * 100) / 100}</td>
                                    <td style={{color: check.hit ? 'lime' : 'red'}}>{check.hit.toString()}</td>
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