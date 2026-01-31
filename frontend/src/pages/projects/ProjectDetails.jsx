import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, listTasks, createTask } from '../../api/projects';
import { updateTaskStatus, deleteTask } from '../../api/tasks';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ title: '', priority: 'medium' });

    const fetchData = async () => {
        try {
            const [pRes, tRes] = await Promise.all([
                getProject(id),
                listTasks(id)
            ]);
            if (pRes.data.success) setProject(pRes.data.data);
            if (tRes.data.success) setTasks(tRes.data.data.tasks);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await createTask(id, newTask);
            setNewTask({ title: '', priority: 'medium' });
            fetchData();
        } catch (err) {
            alert('Error creating task');
        }
    };

    const handleStatusChange = async (taskId, status) => {
        try {
            await updateTaskStatus(taskId, status);
            fetchData();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Delete task?")) return;
        try {
            await deleteTask(taskId);
            fetchData();
        } catch (err) {
            alert('Error deleting task');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate('/projects')}>Back</button>
            <h2>{project.name}</h2>
            <p>{project.description}</p>

            <div style={{ marginTop: '30px' }}>
                <h3>Tasks</h3>
                <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
                    <input placeholder="New Task Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
                    <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button type="submit">Add Task</button>
                </form>

                <ul>
                    {tasks.map(t => (
                        <li key={t.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                                <strong>{t.title}</strong> ({t.priority}) - {t.status}
                            </span>
                            <div>
                                <select value={t.status} onChange={e => handleStatusChange(t.id, e.target.value)}>
                                    <option value="todo">Todo</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button onClick={() => handleDeleteTask(t.id)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProjectDetails;
