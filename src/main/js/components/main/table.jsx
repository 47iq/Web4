import React, {Component} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

class Table extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"table-wrapper"}>
                <DataTable id="resultTable" value={this.props.checks}>
                    <Column header="X" field="coordinateX"/>
                    <Column header="Y" field="coordinateY"/>
                    <Column header="R" field="radius"/>
                    <Column header="Hit or miss?" field="hit"/>
                </DataTable>
            </div>)
    }
}

export default Table