import React, { useState, useEffect } from 'react';
import '../../css/dashboard/Table.css';

const fetchUsers = async (setUsers) => {
    try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();

        console.log('Fetched data:', data);

        if (data.status === "success" && Array.isArray(data.users)) {
            setUsers(data.users); 
        } else {
            console.error('Fetched data is not an array:', data);
        }
    } catch (error) {
        console.error('Error fetching users:', error); 
    }
};

const deleteUser = async (userId, setUsers, users) => {
    try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (data.status === "success") {
            console.log('User deleted:', userId);
            setUsers(users.filter(user => user.user_id !== userId));
        } else {
            console.error('Error deleting user:', data);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers(setUsers);
    }, []);

    return (
        <div>
            <div className="table-container">

                <div className='userAccountsTitle'>
                    <h3>User Accounts</h3>
                    <button className='addAccount-btn'>Add Account</button>
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Institution</th>
                            <th>Action</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.user_id}>
                                    <td>{user.user_id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.institution}</td>
                                    <td>
                                        {/* Delete button */}
                                        <button 
                                            onClick={() => deleteUser(user.user_id, setUsers, users)}
                                            className="delete-btn">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
