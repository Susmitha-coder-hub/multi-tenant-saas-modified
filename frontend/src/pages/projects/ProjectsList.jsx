import React, { useEffect, useState } from 'react';
import { listProjects, createProject } from '../../api/projects';
import { Link } from 'react-router-dom';

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });

    const fetchProjects = async () => {
        try {
            const { data } = await listProjects();
            if (data.success) setProjects(data.data.projects);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createProject(newProject);
            setShowModal(false);
            setNewProject({ name: '', description: '' });
            fetchProjects();
        } catch (err) {
            alert('Failed to create project');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="projects-container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Projects</h2>
                <button onClick={() => setShowModal(true)}>+ New Project</button>
            </div>

            <div className="project-grid" style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                {projects.map(p => (
                    <div key={p.id} className="card" style={{ border: '1px solid #ddd', padding: '15px' }}>
                        <h3><Link to={`/projects/${p.id}`}>{p.name}</Link></h3>
                        <p>{p.description}</p>
                        <p>Status: {p.status}</p>
                        <small>Tasks: {p.taskCount}</small>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '20px' }}>
                        <h3>Create Project</h3>
                        <form onSubmit={handleCreate}>
                            <input placeholder="Name" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} required style={{ display: 'block', margin: '10px 0' }} />
                            <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} style={{ display: 'block', margin: '10px 0' }} />
                            <button type="submit">Create</button>
                            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsList;
