import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../TodoList';

describe('TodoList', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('初期表示', () => {
    it('タイトルが表示されること', () => {
      render(<TodoList />);
      expect(screen.getByText('TODOアプリ')).toBeInTheDocument();
    });

    it('入力欄と追加ボタンが表示されること', () => {
      render(<TodoList />);
      expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
    });

    it('フィルターボタンが3つ表示されること', () => {
      render(<TodoList />);
      expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '完了済み' })).toBeInTheDocument();
    });

    it('タスクが0件の時は「タスクがありません」と表示されること', () => {
      render(<TodoList />);
      expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    });

    it('タスク数が「0 件のタスク」と表示されること', () => {
      render(<TodoList />);
      expect(screen.getByText('0 件のタスク')).toBeInTheDocument();
    });
  });

  describe('タスクの追加', () => {
    it('入力欄にテキストを入力して追加ボタンをクリックするとタスクが追加されること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      const addButton = screen.getByRole('button', { name: '追加' });

      await user.type(input, '買い物に行く');
      await user.click(addButton);

      expect(screen.getByText('買い物に行く')).toBeInTheDocument();
      expect(screen.getByText('1 件のタスク')).toBeInTheDocument();
    });

    it('Enterキーを押してもタスクが追加されること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');

      await user.type(input, '掃除する{Enter}');

      expect(screen.getByText('掃除する')).toBeInTheDocument();
    });

    it('複数のタスクを追加できること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      const addButton = screen.getByRole('button', { name: '追加' });

      await user.type(input, '買い物');
      await user.click(addButton);

      await user.type(input, '料理');
      await user.click(addButton);

      await user.type(input, '洗濯');
      await user.click(addButton);

      expect(screen.getByText('買い物')).toBeInTheDocument();
      expect(screen.getByText('料理')).toBeInTheDocument();
      expect(screen.getByText('洗濯')).toBeInTheDocument();
      expect(screen.getByText('3 件のタスク')).toBeInTheDocument();
    });

    it('空文字列のタスクは追加されないこと', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const addButton = screen.getByRole('button', { name: '追加' });

      await user.click(addButton);

      expect(screen.getByText('タスクがありません')).toBeInTheDocument();
      expect(screen.getByText('0 件のタスク')).toBeInTheDocument();
    });

    it('空白のみのタスクは追加されないこと', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      const addButton = screen.getByRole('button', { name: '追加' });

      await user.type(input, '   ');
      await user.click(addButton);

      expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    });

    it('タスク追加後に入力欄がクリアされること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: '追加' });

      await user.type(input, 'テスト');
      await user.click(addButton);

      expect(input.value).toBe('');
    });
  });

  describe('タスクの完了切り替え', () => {
    it('チェックボックスをクリックするとタスクが完了状態になること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'テストタスク{Enter}');

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      await user.click(checkbox);

      expect(checkbox.checked).toBe(true);
      expect(screen.getByText('0 件のタスク')).toBeInTheDocument();
    });

    it('完了状態のタスクを再度クリックすると未完了に戻ること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'テストタスク{Enter}');

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      await user.click(checkbox);
      expect(checkbox.checked).toBe(true);

      await user.click(checkbox);
      expect(checkbox.checked).toBe(false);
      expect(screen.getByText('1 件のタスク')).toBeInTheDocument();
    });
  });

  describe('タスクの削除', () => {
    it('削除ボタンをクリックするとタスクが削除されること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, '削除されるタスク{Enter}');

      expect(screen.getByText('削除されるタスク')).toBeInTheDocument();

      const deleteButton = screen.getByRole('button', { name: '削除' });
      await user.click(deleteButton);

      expect(screen.queryByText('削除されるタスク')).not.toBeInTheDocument();
      expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    });

    it('複数のタスクから特定のタスクだけ削除できること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'タスク1{Enter}');
      await user.type(input, 'タスク2{Enter}');
      await user.type(input, 'タスク3{Enter}');

      const deleteButtons = screen.getAllByRole('button', { name: '削除' });
      await user.click(deleteButtons[1]);

      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.queryByText('タスク2')).not.toBeInTheDocument();
      expect(screen.getByText('タスク3')).toBeInTheDocument();
    });
  });

  describe('フィルター機能', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');

      await user.type(input, '未完了タスク1{Enter}');
      await user.type(input, '未完了タスク2{Enter}');
      await user.type(input, '完了予定タスク{Enter}');

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[2]);
    });

    it('「すべて」フィルターで全てのタスクが表示されること', () => {
      expect(screen.getByText('未完了タスク1')).toBeInTheDocument();
      expect(screen.getByText('未完了タスク2')).toBeInTheDocument();
      expect(screen.getByText('完了予定タスク')).toBeInTheDocument();
    });

    it('「未完了」フィルターで未完了タスクのみ表示されること', async () => {
      const user = userEvent.setup();
      const activeButton = screen.getByRole('button', { name: '未完了' });

      await user.click(activeButton);

      expect(screen.getByText('未完了タスク1')).toBeInTheDocument();
      expect(screen.getByText('未完了タスク2')).toBeInTheDocument();
      expect(screen.queryByText('完了予定タスク')).not.toBeInTheDocument();
    });

    it('「完了済み」フィルターで完了タスクのみ表示されること', async () => {
      const user = userEvent.setup();
      const completedButton = screen.getByRole('button', { name: '完了済み' });

      await user.click(completedButton);

      expect(screen.queryByText('未完了タスク1')).not.toBeInTheDocument();
      expect(screen.queryByText('未完了タスク2')).not.toBeInTheDocument();
      expect(screen.getByText('完了予定タスク')).toBeInTheDocument();
    });

    it('アクティブなタスク数が正しく表示されること', () => {
      expect(screen.getByText('2 件のタスク')).toBeInTheDocument();
    });
  });

  describe('完了済みタスクの一括削除', () => {
    it('「完了済みを削除」ボタンで完了済みタスクが全て削除されること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');

      await user.type(input, 'タスク1{Enter}');
      await user.type(input, 'タスク2{Enter}');
      await user.type(input, 'タスク3{Enter}');

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      await user.click(checkboxes[2]);

      const clearButton = screen.getByRole('button', { name: '完了済みを削除' });
      await user.click(clearButton);

      expect(screen.queryByText('タスク1')).not.toBeInTheDocument();
      expect(screen.getByText('タスク2')).toBeInTheDocument();
      expect(screen.queryByText('タスク3')).not.toBeInTheDocument();
      expect(screen.getByText('1 件のタスク')).toBeInTheDocument();
    });

    it('未完了タスクのみの場合、完了済み削除を実行しても変化がないこと', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'タスク1{Enter}');

      const clearButton = screen.getByRole('button', { name: '完了済みを削除' });
      await user.click(clearButton);

      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.getByText('1 件のタスク')).toBeInTheDocument();
    });
  });

  describe('localStorage連携', () => {
    it('タスクを追加するとlocalStorageに保存されること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, '保存テスト{Enter}');

      const stored = localStorage.getItem('todos');
      expect(stored).not.toBeNull();

      const todos = JSON.parse(stored!);
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('保存テスト');
      expect(todos[0].completed).toBe(false);
    });

    it('localStorageに保存されているタスクが初期表示で読み込まれること', () => {
      const initialTodos = [
        { id: 1, text: '既存タスク1', completed: false, createdAt: new Date().toISOString() },
        { id: 2, text: '既存タスク2', completed: true, createdAt: new Date().toISOString() },
      ];
      localStorage.setItem('todos', JSON.stringify(initialTodos));

      render(<TodoList />);

      expect(screen.getByText('既存タスク1')).toBeInTheDocument();
      expect(screen.getByText('既存タスク2')).toBeInTheDocument();
      expect(screen.getByText('1 件のタスク')).toBeInTheDocument();
    });

    it('タスクを削除するとlocalStorageも更新されること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'テスト1{Enter}');
      await user.type(input, 'テスト2{Enter}');

      const deleteButtons = screen.getAllByRole('button', { name: '削除' });
      await user.click(deleteButtons[0]);

      const stored = localStorage.getItem('todos');
      const todos = JSON.parse(stored!);

      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('テスト2');
    });

    it('タスクの完了状態を変更するとlocalStorageも更新されること', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'テスト{Enter}');

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const stored = localStorage.getItem('todos');
      const todos = JSON.parse(stored!);

      expect(todos[0].completed).toBe(true);
    });
  });
});
