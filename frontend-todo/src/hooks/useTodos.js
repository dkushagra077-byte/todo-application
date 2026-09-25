import { useState, useEffect, useCallback, useMemo } from 'react';
import { todoService } from '../services/todoService';

/**
 * Custom hook to manage Todo CRUD state and operations
 */
export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all todos from backend
  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load todos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Create a new todo
  const addTodo = async (title, description) => {
    setActionLoading(true);
    setError(null);
    try {
      const newTodo = await todoService.createTodo({ title, description });
      setTodos((prev) => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError(err.message || 'Failed to create todo.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle completion status
  const toggleComplete = async (id) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const newCompleted = !target.completed;
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    try {
      const updated = await todoService.updateTodo(id, { completed: newCompleted });
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      // Revert optimistic update on failure
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: target.completed } : t))
      );
      setError(err.message || 'Failed to update todo status.');
    }
  };

  // Update todo details
  const updateTodo = async (id, updates) => {
    setActionLoading(true);
    setError(null);
    try {
      const updated = await todoService.updateTodo(id, updates);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update todo.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    setError(null);
    const original = [...todos];
    // Optimistic removal
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoService.deleteTodo(id);
    } catch (err) {
      // Revert on error
      setTodos(original);
      setError(err.message || 'Failed to delete todo.');
      throw err;
    }
  };

  // Filtered and searched todos
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Match filter
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;

      // Match search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(query);
        const matchesDesc = todo.description ? todo.description.toLowerCase().includes(query) : false;
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [todos, filter, searchQuery]);

  const clearError = () => setError(null);

  return {
    todos: filteredTodos,
    allTodosCount: todos.length,
    activeCount: todos.filter((t) => !t.completed).length,
    completedCount: todos.filter((t) => t.completed).length,
    loading,
    actionLoading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    loadTodos,
    addTodo,
    toggleComplete,
    updateTodo,
    deleteTodo,
    clearError
  };
};

export default useTodos;
