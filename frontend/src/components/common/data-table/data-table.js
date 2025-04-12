import React from 'react';

import { fromCamelCase } from '../../../utils/strings';

import './data-table.css';

const DataTable = (props) => {
    const { columns, data, title, className, maxHeight, width } = props;

    return (
        <table className={`${className} data-table-container`} style={{ maxHeight, width }}>
            <caption className='data-table-title-header'>
                <b className='data-table-title'>{title}</b>
            </caption>
            <thead className='data-table-head'>
                <tr className='data-table-header-row'>{columns.map(col => <th className='data-table-column-header'>{fromCamelCase(col)}</th>)}</tr>
            </thead>
            <tbody className='data-table-body'>
                {data.map(dataEntry => 
                    <tr className='data-table-row'>
                        { Object.values(dataEntry).map(value => <td className='data-table-cell'>{value}</td>
                    )}
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DataTable;