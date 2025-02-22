import React, { useState, useEffect } from 'react';
import '../../css/dashboard components/Table.css';
import Modal from '../partials/Modal';

const fetchUsers = async (setUsers) => {
  try {
    const response = await fetch('http://localhost:5000/api/users');
    const data = await response.json();

    if (data.status === 'success' && Array.isArray(data.users)) {
      setUsers(data.users);
    } else {
      console.error('Fetched data is not an array:', data);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const addUser = async (newUser, setUsers) => {
  try {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success') {
      console.log('User added successfully:', data.user);
      setUsers((prevUsers) => [...prevUsers, data.user]);
    } else {
      console.error('Error adding user:', data);
    }
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

const deleteUser = async (userId, setUsers, users) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'DELETE',
    });

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Unexpected non-JSON response:', textResponse);
      return;
    }

    const data = await response.json();

    if (data.status === 'success') {
      console.log('User deleted:', userId);
      setUsers(users.filter((user) => user.user_id !== userId));
    } else {
      console.error('Error deleting user:', data);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const modalForm = (newUser, setNewUser) => (
  <form onSubmit={(e) => e.preventDefault()} className="add-account-form">
    <input
      type="text"
      placeholder="Name"
      value={newUser.name}
      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      required
    />
    <input
      type="email"
      placeholder="Email"
      value={newUser.email}
      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      required
    />
    {/* Role Dropdown */}
    <select
      value={newUser.role}
      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
      required
    >
      <option value="">Select Role</option>
      <option value="Client">Client</option>
      <option value="TECD Staff">TECD</option>
      <option value="University">University Researcher</option>
      <option value="Director">Director</option>
    </select>

    <input
      type="password"
      placeholder="Password"
      value={newUser.password}
      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      required
    />
    <input
      type="text"
      placeholder="Institution"
      value={newUser.institution}
      onChange={(e) => setNewUser({ ...newUser, institution: e.target.value })}
    />
    <input
      type="text"
      placeholder="Contact Number"
      value={newUser.contact_number}
      onChange={(e) => setNewUser({ ...newUser, contact_number: e.target.value })}
    />
  </form>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    institution: '',
    contact_number: '',
  });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers(setUsers);
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    addUser(newUser, setUsers);
    setNewUser({
      name: '',
      email: '',
      role: '',
      password: '',
      institution: '',
      contact_number: '',
    });
    setIsAddUserModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete.user_id, setUsers, users);
      setUserToDelete(null);
      setIsDeleteUserModalOpen(false);
    }
  };

  const formFooter = (
    <>
      <button className="btn btn-secondary" onClick={() => setIsAddUserModalOpen(false)}>
        Cancel
      </button>
      <button className="btn btn-primary" onClick={handleAddUser}>
        Add
      </button>
    </>
  );

  const deleteModalFooter = (
    <>
      <button className="btn btn-secondary" onClick={() => setIsDeleteUserModalOpen(false)}>
        Cancel
      </button>
      <button className="btn btn-danger" onClick={handleDeleteUser}>
        Yes
      </button>
    </>
  );

  return (
    <div>
      <div className="table-container">
        <div className="tableTitle">
          <h3>User Accounts</h3>
          <button onClick={() => setIsAddUserModalOpen(true)} className="add-btn">
            Add Account
          </button>
        </div>

        {/* Modal for adding user */}
        <Modal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onConfirm={handleAddUser}
          title="Add Account"
          content={modalForm(newUser, setNewUser)}
          footer={formFooter}
        />

        {/* Modal for deleting user */}
        <Modal
          isOpen={isDeleteUserModalOpen}
          onClose={() => setIsDeleteUserModalOpen(false)}
          onConfirm={handleDeleteUser}
          title="Delete Account"
          content="Are you sure you want to delete this account?"
          footer={deleteModalFooter}
        />

        {/* User table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Institution</th>
              <th>Contact Number</th>
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
                  <td>{user.contact_number}</td>
                  <td>
                    <button
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteUserModalOpen(true);
                      }}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
