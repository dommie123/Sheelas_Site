import React from 'react';

import DataTable from '../../../common/data-table/data-table';

export default function SupportTicketsTable() {
    return (
        <DataTable 
            className='sheebay-support-tickets-table'
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
            title="Support Tickets"
            maxHeight="150px"
            width="100%"
        />
    )
}