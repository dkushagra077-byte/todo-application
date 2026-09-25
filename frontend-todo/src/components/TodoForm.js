import React, { useState } from 'react';

/**
 * TodoForm component for creating new todos
 * @param {object} props - { onAddTodo, disabled }
 */
const TodoForm = ({ onAddTodo, disabled }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Please enter a todo title');
      return;
    }

    try {
      setSubmitting(true);
      await onAddTodo(title, description);
      setTitle('');
      setDescription('');
    } catch {
      // Error handled by parent hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="todo-form-card" id="todo-create-card">
      <h3 className="form-title">Add New Task</h3>
      <form onSubmit={handleSubmit} className="todo-form" id="create-todo-form">
        {validationError && (
          <div className="field-error" id="todo-form-validation-error">
            {validationError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="todo-title-input" className="form-label">
            Title <span className="required-star">*</span>
          </label>
          <input
            id="todo-title-input"
            type="text"
            className="form-control"
            placeholder="e.g., Study Express MVC Architecture"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={disabled || submitting}
            maxLength={255}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="todo-desc-input" className="form-label">
            Description <span className="optional-tag">(optional)</span>
          </label>
          <textarea
            id="todo-desc-input"
            className="form-control textarea"
            placeholder="Add relevant notes, links, or instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled || submitting}
            rows={2}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          id="add-todo-submit-btn"
          disabled={disabled || submitting || !title.trim()}
        >
          {submitting ? (
            <span className="btn-loading-inline">
              <span className="spinner-sm"></span> Adding Task...
            </span>
          ) : (
            '＋ Add Todo'
          )}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
