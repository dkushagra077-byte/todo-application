import React, { useState } from 'react';

/**
 * TodoItem component represents a single todo row with inline editing and completion toggle
 * @param {object} props - { todo, onToggleComplete, onUpdate, onDelete }
 */
const TodoItem = ({ todo, onToggleComplete, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      setIsSaving(true);
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null
      });
      setIsEditing(false);
    } catch {
      // Error handled by parent hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      try {
        setIsDeleting(true);
        await onDelete(todo.id);
      } catch {
        setIsDeleting(false);
      }
    }
  };

  const formattedDate = todo.created_at
    ? new Date(todo.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  if (isEditing) {
    return (
      <div className="todo-item editing" id={`todo-item-${todo.id}`}>
        <form onSubmit={handleSave} className="inline-edit-form">
          <input
            type="text"
            className="form-control mb-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isSaving}
            required
            autoFocus
          />
          <textarea
            className="form-control textarea mb-2"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            disabled={isSaving}
            rows={2}
            placeholder="Description..."
          />
          <div className="item-edit-actions">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSaving || !editTitle.trim()}
              id={`save-todo-${todo.id}`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCancel}
              disabled={isSaving}
              id={`cancel-todo-${todo.id}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      id={`todo-item-${todo.id}`}
    >
      <div className="todo-item-main">
        <label className="checkbox-container" id={`checkbox-label-${todo.id}`}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
            id={`toggle-checkbox-${todo.id}`}
          />
          <span className="checkmark"></span>
        </label>

        <div className="todo-content">
          <h4 className="todo-title">{todo.title}</h4>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          {formattedDate && (
            <span className="todo-date">Created {formattedDate}</span>
          )}
        </div>
      </div>

      <div className="todo-item-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => setIsEditing(true)}
          title="Edit Todo"
          id={`edit-btn-${todo.id}`}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className="btn btn-danger-ghost btn-sm btn-icon"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete Todo"
          id={`delete-btn-${todo.id}`}
        >
          🗑️ {isDeleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
