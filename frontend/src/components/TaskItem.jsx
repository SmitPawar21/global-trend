import { useState } from 'react';

const TaskItem = ({ task, onToggle, onDelete, onEdit, isDeleting }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const formatDateForInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';
    const [editDeadline, setEditDeadline] = useState(formatDateForInput(task.deadline));

    const handleSave = () => {
        if (editTitle.trim()) {
            onEdit(task._id, editTitle, editDeadline || null);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setEditDeadline(formatDateForInput(task.deadline));
        setIsEditing(false);
    };

    // Format display date
    const displayDate = task.deadline ? new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : null;

    if (isEditing) {
        return (
            <div className={`p-4 mb-3 rounded-lg border border-blue-300 bg-blue-50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3`}>
                <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                    autoFocus
                />
                <input 
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                />
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button onClick={handleSave} className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Save</button>
                    <button onClick={handleCancel} className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-4 mb-3 rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md flex flex-wrap items-center justify-between group ${task.completed ? 'opacity-70 bg-gray-50' : ''}`}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => onToggle(task._id, !task.completed)}
                    className="w-5 h-5 cursor-pointer accent-blue-600 rounded flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                    <span className={`text-lg font-medium text-gray-800 transition-all truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                    </span>
                    {displayDate && (
                        <span className={`text-xs mt-1 font-medium ${task.completed ? 'text-gray-400' : 'text-orange-500'}`}>
                            📅 Due: {displayDate}
                        </span>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                <button 
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 focus:outline-none"
                    aria-label="Edit Task"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>

                <button 
                    onClick={() => onDelete(task._id)}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 focus:outline-none"
                    aria-label="Delete Task"
                >
                    {isDeleting ? (
                        <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
