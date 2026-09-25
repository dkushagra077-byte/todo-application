import React from 'react';
import TodoItem from './TodoItem';
import Loading from './Loading';

/**
 * TodoList component renders the collection of TodoItem components or empty states
 * @param {object} props - { todos, loading, filter, setFilter, searchQuery, setSearchQuery, allCount, activeCount, completedCount, onToggleComplete, onUpdate, onDelete }
 */
const TodoList = ({
  todos,
  loading,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  allCount,
  activeCount,
  completedCount,
  onToggleComplete,
  onUpdate,
  onDelete
}) => {
  return (
    <div className="todo-list-section" id="todo-list-container">
      {/* Controls: Search and Filter Tabs */}
      <div className="todo-controls">
        <div className="search-bar-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="todo-search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              id="clear-search-btn"
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="filter-tabs" id="todo-filter-tabs">
          <button
            type="button"
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            id="filter-tab-all"
          >
            All <span className="tab-badge">{allCount}</span>
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
            id="filter-tab-active"
          >
            Active <span className="tab-badge">{activeCount}</span>
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            id="filter-tab-completed"
          >
            Completed <span className="tab-badge">{completedCount}</span>
          </button>
        </div>
      </div>

      {/* Todo items or loading / empty state */}
      {loading ? (
        <div className="list-loading-wrap">
          <Loading message="Fetching your tasks..." />
        </div>
      ) : todos.length === 0 ? (
        <div className="empty-state" id="empty-todo-state">
          <div className="empty-icon">📝</div>
          <h4 className="empty-title">
            {searchQuery
              ? 'No matching tasks found'
              : filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
              ? 'No active tasks! You are all caught up 🎉'
              : 'No tasks added yet'}
          </h4>
          <p className="empty-description">
            {searchQuery
              ? 'Try adjusting your search keywords'
              : 'Create your first todo using the form on the left to stay productive!'}
          </p>
        </div>
      ) : (
        <div className="todo-items-grid" id="todo-items-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
