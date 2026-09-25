import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import ErrorMessage from '../components/ErrorMessage';

const TodosPage = () => {
  const { user } = useAuth();
  const {
    todos,
    allTodosCount,
    activeCount,
    completedCount,
    loading,
    actionLoading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    addTodo,
    toggleComplete,
    updateTodo,
    deleteTodo,
    clearError
  } = useTodos();

  const completionPercentage = allTodosCount > 0
    ? Math.round((completedCount / allTodosCount) * 100)
    : 0;

  return (
    <div className="todos-page-container" id="todos-dashboard">
      {/* Top Banner / User Welcome */}
      <div className="dashboard-header">
        <div className="welcome-info">
          <h1 className="dashboard-title">
            Hello, <span className="highlight-text">{user?.name || 'Friend'}</span> 👋
          </h1>
          <p className="dashboard-subtitle">
            Keep track of your tasks and boost your everyday focus.
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="stats-container" id="todo-stats-overview">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">{allTodosCount}</span>
          </div>
          <div className="stat-card stat-active">
            <span className="stat-label">Active</span>
            <span className="stat-value">{activeCount}</span>
          </div>
          <div className="stat-card stat-completed">
            <span className="stat-label">Done</span>
            <span className="stat-value">{completedCount}</span>
          </div>
          <div className="stat-card stat-progress">
            <span className="stat-label">Progress</span>
            <span className="stat-value">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {allTodosCount > 0 && (
        <div className="progress-bar-container" title={`${completionPercentage}% Completed`}>
          <div
            className="progress-bar-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      )}

      {/* Error Message banner */}
      <ErrorMessage message={error} onDismiss={clearError} />

      {/* Main Grid: Form on left/top, List on right/bottom */}
      <div className="todos-layout-grid">
        <aside className="todo-sidebar">
          <TodoForm onAddTodo={addTodo} disabled={actionLoading} />
        </aside>

        <main className="todo-main-content">
          <TodoList
            todos={todos}
            loading={loading}
            filter={filter}
            setFilter={setFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allCount={allTodosCount}
            activeCount={activeCount}
            completedCount={completedCount}
            onToggleComplete={toggleComplete}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        </main>
      </div>
    </div>
  );
};

export default TodosPage;
