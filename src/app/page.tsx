import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <TodoList />
    </div>
  );
}
