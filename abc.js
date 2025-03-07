import React, { useState } from 'react';
import { Table, Form, Dropdown, Button } from 'react-bootstrap';
import { FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';

const usersData = [
  { id: 1, name: "Adam Trantow", company: "Mohr, Langworth and Hills", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Angel Rolfson-Kulas", company: "Koch and Sons", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Betty Hammes", company: "Waelchi – VonRueden", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, name: "Billy Braun", company: "White, Cassin and Goldner", role: "UI Designer", verified: false, status: "Banned", avatar: "https://i.pravatar.cc/40?img=4" },
  { id: 5, name: "Billy Stoltenberg", company: "Medhurst, Moore and Franey", role: "Leader", verified: false, status: "Banned", avatar: "https://i.pravatar.cc/40?img=5" }
];

const UserTable = () => {
  const [search, setSearch] = useState('');
  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Users</h4>
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Search user..."
          className="w-25"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary">+ New User</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th><Form.Check type="checkbox" /></th>
            <th>Name</th>
            <th>Company</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td><Form.Check type="checkbox" /></td>
              <td>
                <img src={user.avatar} alt="avatar" className="rounded-circle me-2" width="30" />
                {user.name}
              </td>
              <td>{user.company}</td>
              <td>{user.role}</td>
              <td className="text-center">
                {user.verified ? <FaCheckCircle className="text-success" /> : "-"}
              </td>
              <td>
                <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                  {user.status}
                </span>
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="light" size="sm">
                    •••
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#"><FaEdit className="me-2" /> Edit</Dropdown.Item>
                    <Dropdown.Item href="#" className="text-danger">
                      <FaTrash className="me-2" /> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;