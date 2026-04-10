import { useState } from 'react';

const TaskForm = ({ onTaskAdd, isLoading }) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onTaskAdd(title, deadline || null);
            setTitle('');
            setDeadline('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col sm:flex-row gap-3">
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm text-gray-800"
                disabled={isLoading}
            />
            <input 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm text-gray-600"
                disabled={isLoading}
            />
            <button 
                type="submit" 
                disabled={!title.trim() || isLoading}
                className={`btn flex items-center justify-center min-w-[100px] ${(!title.trim() || isLoading) ? 'btn-disabled' : ''}`}
            >
                {isLoading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    'Add Task'
                )}
            </button>
        </form>
    );
};

export default TaskForm;
