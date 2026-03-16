import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch(`${API}/api/tasks`)
      .then(r => r.json())
      .then(setTasks);
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input })
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setInput('');
  };

  const toggleTask = async (id, completed) => {
    await fetch(`${API}/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: '40px auto',
      fontFamily: 'sans-serif',
      padding: '0 16px'
    }}>
      <h1 style={{ textAlign: 'center' }}>📝 My Tasks</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Nueva tarea..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ddd',
            fontSize: 16
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: '#6366f1',
            color: 'white',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Agregar
        </button>
      </div>

      {tasks.length === 0 && (
        <p style={{ textAlign: 'center', color: '#aaa' }}>
          No hay tareas todavía
        </p>
      )}

      {tasks.map(task => (
        <div
          key={task.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            marginBottom: 8,
            borderRadius: 8,
            border: '1px solid #eee',
            background: task.completed ? '#f9fafb' : 'white'
          }}
        >
          <span
            onClick={() => toggleTask(task.id, task.completed)}
            style={{
              flex: 1,
              cursor: 'pointer',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#aaa' : '#222',
              fontSize: 16
            }}
          >
            {task.completed ? '✅' : '⬜'} {task.title}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            style={{
              marginLeft: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              color: '#f87171'
            }}
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}

