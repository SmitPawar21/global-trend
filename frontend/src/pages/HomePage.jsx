import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const API_URL = 'http://localhost:5000/api/tasks';

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // UI state
    const [isAdding, setIsAdding] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTask = async (title) => {
        try {
            setIsAdding(true);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            
            if (!response.ok) throw new Error('Failed to add task');
            const newTask = await response.json();
            setTasks([newTask, ...tasks]); // Add to beginning (newest first)
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggleTask = async (id, completed) => {
        // Optimistic update
        const originalTasks = [...tasks];
        setTasks(tasks.map(t => t._id === id ? { ...t, completed } : t));

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed }),
            });
            
            if (!response.ok) throw new Error('Failed to update task');
        } catch (err) {
            // Revert on failure
            setTasks(originalTasks);
            setError(err.message);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            setDeletingId(id);
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) throw new Error('Failed to delete task');
            setTasks(tasks.filter(t => t._id !== id));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">TaskManager</h1>
                        <p className="text-blue-100 text-lg font-medium">Stay organized, focused, and get things done.</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <TaskForm onTaskAdd={handleAddTask} isLoading={isAdding} />

                        <div className="mt-8">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <TaskList 
                                    tasks={tasks} 
                                    onToggle={handleToggleTask} 
                                    onDelete={handleDeleteTask}
                                    deletingId={deletingId}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-center mt-6 text-sm text-gray-500">
                    Keep your goals in view
                </div>
            </div>
        </div>
    );
};

export default HomePage;