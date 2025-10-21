/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import TodoList from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import classNames from 'classnames';

type StatusTodos = 'completed' | 'active' | 'all';

const filtredTodos = (status: StatusTodos, todos: Todo[]): Todo[] => {
  return todos.filter(todo => {
    switch (status) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusTodos>('all');

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearInterval(timerId);
  }, [errorMessage]);

  const filterTodos = filtredTodos(filterStatus, todos);

  function handleFiltringTodos(status: StatusTodos) {
    setFilterStatus(status);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList todos={filterTodos} />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterStatus === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => handleFiltringTodos('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterStatus === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleFiltringTodos('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterStatus === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFiltringTodos('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage.length,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
