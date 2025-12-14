'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = inputValue.trim();
    if (!text) return;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          TODOアプリ
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-zinc-800 dark:text-white transition-colors"
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            追加
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'active'
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            未完了
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'completed'
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            完了済み
          </button>
        </div>

        <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              タスクがありません
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-4 rounded-lg transition-all hover:shadow-md ${
                  todo.completed
                    ? 'bg-zinc-50 dark:bg-zinc-800 opacity-60'
                    : 'bg-zinc-50 dark:bg-zinc-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? 'line-through text-zinc-400'
                      : 'text-zinc-900 dark:text-white'
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t-2 border-zinc-200 dark:border-zinc-700">
          <span className="text-zinc-600 dark:text-zinc-400 text-sm">
            {activeCount} 件のタスク
          </span>
          <button
            onClick={clearCompleted}
            className="px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
          >
            完了済みを削除
          </button>
        </div>
      </div>
    </div>
  );
}
