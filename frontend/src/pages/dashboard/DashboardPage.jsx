import React, { useEffect, useState } from 'react';
import { getMe, logout } from '../../api/auth';
import { getTenant } from '../../api/tenant';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: meData } = await getMe();
                if (meData.success) {
                    setUser(meData.data);

                    if (meData.data.TenantId || meData.data.tenant_id) { // Handle case naming
                        const tId = meData.data.TenantId || meData.data.tenant_id;
                        const { data: tenantData } = await getTenant(tId);
                        if (tenantData.success) {
                            setTenant(tenantData.data);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                // If auth fails, ProtectedRoute handles redirect usually, but safety check
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container" style={{ padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Dashboard</h1>
                <div>
                    <span>Welcome, {user?.fullName} ({user?.role}) </span>
                    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
                </div>
            </header>

            <nav style={{ marginBottom: '20px' }}>
                <Link to="/projects" style={{ marginRight: '15px' }}>Projects</Link>
                {user?.role === 'tenant_admin' && <Link to="/users" style={{ marginRight: '15px' }}>Users</Link>}
            </nav>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>Tenant</h3>
                    <p>{tenant?.name}</p>
                    <small>{tenant?.subdomain}.saas.com</small>
                </div>

                <div className="card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>Users</h3>
                    <p>{tenant?.stats?.totalUsers || 0} / {tenant?.maxUsers || tenant?.max_users}</p>
                </div>

                <div className="card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>Projects</h3>
                    <p>{tenant?.stats?.totalProjects || 0} / {tenant?.maxProjects || tenant?.max_projects}</p>
                </div>

                <div className="card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>Plan</h3>
                    <p>{tenant?.subscriptionPlan || tenant?.subscription_plan}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
