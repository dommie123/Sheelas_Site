import React from 'react';

import DataTable from '../../../common/data-table/data-table';

export default function GuestTicketsTable() {
    return (
        <DataTable 
            className='sheebay-guest-support-tickets-table'
            columns={[
                "firstName",
                "lastName",
                "email",
                "phone"
            ]}
            data={[
                {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
            ]}
            title="Guest Support Tickets"
            maxHeight="150px"
            width="100%"
        />
    )
}