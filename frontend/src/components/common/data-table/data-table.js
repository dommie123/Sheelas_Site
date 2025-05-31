import React, { useState, useRef, useEffect } from 'react';

import { IconButton, Menu, MenuItem } from '@mui/material';

import { fromSnakeCase } from '../../../utils/strings';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import './data-table.css';

const DataTable = (props) => {
    const { columns, data, title, className, maxHeight, width, actions=[] } = props; // actions = [{ label: string, onClick: () => {} }]
    const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [moreOptionsAnchorEl, setMoreOptionsAnchorRef] = useState(null);

    const toggleMoreOptions = (event, dataEntry) => {
        setMoreOptionsAnchorRef(event.target);
        setMoreOptionsOpen((previousState) => !previousState);
        setSelectedRow(dataEntry);
    }

    const handleCloseMoreOptions = (event) => {
        if (moreOptionsAnchorEl.current && moreOptionsAnchorEl.current.contains(event.target)) {
            return;
        }

        setMoreOptionsAnchorRef(null);
        setMoreOptionsOpen(false);
    }

    useEffect(() => {
        if (!selectedRow) {
            return;
        }

        if (!moreOptionsOpen) {
            setSelectedRow(null);
        }
    }, [moreOptionsOpen, selectedRow])

    useEffect(() => {
        return () => {
            setSelectedRow(null);
            setMoreOptionsOpen(false);
        }
    }, []);
    
    return (
        <>
            <table className={`${className} data-table-container`} style={{ maxHeight, width }}>
                <caption className='data-table-title-header'>
                    <b className='data-table-title'>{title}</b>
                </caption>
                <thead className='data-table-head'>
                    <tr className='data-table-header-row'>
                        {(columns.length > 0 && actions.length > 0)
                            ? <th className='data-table-column-header'>Actions</th>
                            : <></>
                        }
                        {columns.length > 0 
                            ? columns.map(col => <th className='data-table-column-header'>{fromSnakeCase(col)}</th>) 
                            : <th className='data-table-column-header data-table-column-header-empty' />
                        }
                    </tr>
                </thead>
                <tbody className='data-table-body'>
                    {data.length > 0 ? data.map(dataEntry => 
                        <tr className='data-table-row'>
                            { actions.length > 0 && <td className='data-table-cell'>                    
                                    <IconButton className='data-table-actions-btn' onClick={(event) => toggleMoreOptions(event, dataEntry)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </td>
                            }
                            { Object.values(dataEntry).map(value => <td className='data-table-cell'>{value}</td>) }
                        </tr>
                    ) : <p className='data-table-no-data-message'>No data to show!</p>}
                </tbody>
            </table>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={moreOptionsAnchorEl}
                open={moreOptionsOpen}
                onClose={handleCloseMoreOptions}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {actions.map(action => 
                    <MenuItem 
                        onClick={(event) => { 
                            action.onClick(event, selectedRow); 
                            handleCloseMoreOptions(event); 
                        }}
                    >
                        {action.label}
                    </MenuItem>)
                }
            </Menu>

        </>
    );
};

export default DataTable;