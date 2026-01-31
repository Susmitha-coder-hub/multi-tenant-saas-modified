import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerTenant } from '../../api/auth';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tenantName: '',
        subdomain: '',
        adminEmail: '',
        adminFullName: '',
        adminPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.adminPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { data } = await registerTenant(formData);
            if (data.success) {
                alert('Registration successful! Please login.');
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register Organization</h2>
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name="tenantName" placeholder="Organization Name" onChange={handleChange} required />
                <input name="subdomain" placeholder="Subdomain (e.g. acme)" onChange={handleChange} required />
                <input name="adminFullName" placeholder="Admin Name" onChange={handleChange} required />
                <input name="adminEmail" placeholder="Admin Email" type="email" onChange={handleChange} required />
                <input name="adminPassword" placeholder="Password" type="password" onChange={handleChange} required />
                <input name="confirmPassword" placeholder="Confirm Password" type="password" onChange={handleChange} required />

                <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
