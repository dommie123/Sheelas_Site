import React from 'react';

import DataTable from '../../../common/data-table/data-table';

export default function AllUsersTable() {
    return (
        <DataTable 
            className='sheebay-users-table'
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
            title="All Users"
            maxHeight="150px"
            width="100%"
        />
    )
}