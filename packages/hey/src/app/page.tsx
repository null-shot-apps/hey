'use client';

import { useState, useEffect } from 'react';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: 'today' | 'upcoming';
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowInput(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTask = () => {
    if (!inputValue.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
      createdAt: Date.now(),
      dueDate: 'today',
    };
    setTasks([newTask, ...tasks]);
    setInputValue('');
    setShowInput(false);
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditValue(task.text);
  };

  const saveEdit = () => {
    if (!editValue.trim()) return;
    setTasks(tasks.map(task =>
      task.id === editingId ? { ...task, text: editValue } : task
    ));
    setEditingId(null);
    setEditValue('');
  };

  const todayTasks = tasks.filter(t => !t.completed && t.dueDate === 'today');
  const upcomingTasks = tasks.filter(t => !t.completed && t.dueDate === 'upcoming');
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-[#0A0A0A] tracking-tight">Tasks</h1>
        </header>

        {/* Today Section */}
        {todayTasks.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wide mb-6">Today</h2>
            <div className="space-y-0">
              {todayTasks.map((task, idx) => (
                <div key={task.id}>
                  {idx > 0 && <div className="h-px bg-[#EAEAEA]" />}
                  <TaskRow
                    task={task}
                    isEditing={editingId === task.id}
                    editValue={editValue}
                    onToggle={() => toggleComplete(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => startEdit(task)}
                    onSaveEdit={saveEdit}
                    onEditChange={setEditValue}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Section */}
        {upcomingTasks.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wide mb-6">Upcoming</h2>
            <div className="space-y-0">
              {upcomingTasks.map((task, idx) => (
                <div key={task.id}>
                  {idx > 0 && <div className="h-px bg-[#EAEAEA]" />}
                  <TaskRow
                    task={task}
                    isEditing={editingId === task.id}
                    editValue={editValue}
                    onToggle={() => toggleComplete(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => startEdit(task)}
                    onSaveEdit={saveEdit}
                    onEditChange={setEditValue}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wide mb-6">Completed</h2>
            <div className="space-y-0">
              {completedTasks.map((task, idx) => (
                <div key={task.id}>
                  {idx > 0 && <div className="h-px bg-[#EAEAEA]" />}
                  <TaskRow
                    task={task}
                    isEditing={editingId === task.id}
                    editValue={editValue}
                    onToggle={() => toggleComplete(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => startEdit(task)}
                    onSaveEdit={saveEdit}
                    onEditChange={setEditValue}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#999999] text-lg">No tasks yet</p>
            <p className="text-[#CCCCCC] text-sm mt-2">Press ⌘K to add your first task</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowInput(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#0A0A0A] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-150"
        aria-label="Add task"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Add Task Modal */}
      {showInput && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setShowInput(false)}>
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addTask();
                if (e.key === 'Escape') setShowInput(false);
              }}
              placeholder="What needs to be done?"
              className="w-full text-lg border-none outline-none text-[#0A0A0A] placeholder:text-[#CCCCCC]"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addTask}
                className="px-4 py-2 bg-[#0A0A0A] text-white text-sm rounded hover:bg-[#2A2A2A] transition-colors duration-150"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="px-4 py-2 text-[#666666] text-sm hover:text-[#0A0A0A] transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  isEditing,
  editValue,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onEditChange,
}: {
  task: Task;
  isEditing: boolean;
  editValue: string;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onEditChange: (value: string) => void;
}) {
  return (
    <div className="group flex items-center gap-4 py-4 hover:bg-[#FAFAFA] transition-colors duration-150">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-5 h-5 rounded border border-[#EAEAEA] flex items-center justify-center hover:border-[#0A0A0A] transition-colors duration-150"
      >
        {task.completed && (
          <svg className="w-4 h-4 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Task text */}
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSaveEdit();
            if (e.key === 'Escape') onSaveEdit();
          }}
          onBlur={onSaveEdit}
          className="flex-1 text-[#0A0A0A] border-none outline-none bg-transparent"
          autoFocus
        />
      ) : (
        <span
          onClick={onEdit}
          className={`flex-1 cursor-pointer ${
            task.completed ? 'text-[#999999] line-through' : 'text-[#0A0A0A]'
          }`}
        >
          {task.text}
        </span>
      )}

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-[#CCCCCC] hover:text-[#0A0A0A] transition-all duration-150"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

