import React, { useEffect, useState } from 'react';
import { listUsers, addUser } from '../../api/tenant';
import { getMe } from '../../api/auth';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [tenantId, setTenantId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', fullName: '', password: '', role: 'user' });

    const fetchUsers = async () => {
        if (!tenantId) return;
        try {
            const { data } = await listUsers(tenantId);
            if (data.success) setUsers(data.data.users);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const init = async () => {
            const { data } = await getMe();
            if (data.success) {
                const tId = data.data.TenantId || data.data.tenant_id; // Check naming
                setTenantId(tId);
            }
            setLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (tenantId) fetchUsers();
    }, [tenantId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await addUser(tenantId, newUser);
            setShowModal(false);
            setNewUser({ email: '', fullName: '', password: '', role: 'user' });
            fetchUsers();
        } catch (err) {
            alert('Failed to add user (limit reached or email exists)');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Team Members</h2>
                <button onClick={() => setShowModal(true)}>+ Add User</button>
            </div>

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{u.fullName}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.is_active ? 'Active' : 'Inactive'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '20px' }}>
                        <h3>Add User</h3>
                        <form onSubmit={handleCreate}>
                            <input placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} required style={{ display: 'block', margin: '10px 0' }} />
                            <input placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required style={{ display: 'block', margin: '10px 0' }} />
                            <input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required style={{ display: 'block', margin: '10px 0' }} />
                            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={{ display: 'block', margin: '10px 0' }}>
                                <option value="user">User</option>
                                <option value="tenant_admin">Admin</option>
                            </select>
                            <button type="submit">Add</button>
                            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersList;
