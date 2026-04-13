import { Link } from "react-router";
import { Search, Filter } from "lucide-react";

const mockTasks = [
  { id: 1, title: "Оптимизация алгоритма сортировки", category: "Алгоритмы", reward: "5000", deadline: "20.03.2026" },
  { id: 2, title: "Улучшение модели ML для классификации", category: "Machine Learning", reward: "10000", deadline: "25.03.2026" },
  { id: 3, title: "Оптимизация SQL запросов", category: "База данных", reward: "3000", deadline: "18.03.2026" },
  { id: 4, title: "Рефакторинг legacy кода", category: "Разработка", reward: "7000", deadline: "30.03.2026" },
  { id: 5, title: "Оптимизация производительности API", category: "Backend", reward: "8000", deadline: "22.03.2026" },
  { id: 6, title: "Улучшение точности предсказаний", category: "Data Science", reward: "12000", deadline: "28.03.2026" },
];

export function TaskCatalog() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Hero Section with CTA */}
      <div className="border-2 border-gray-800 p-12 mb-12 bg-white">
        <h1 className="text-3xl font-mono mb-4">[ЗАГОЛОВОК СТРАНИЦЫ]</h1>
        <p className="text-sm font-mono text-gray-600 mb-6">
          [Описание платформы и призыв к действию]
        </p>
        <Link
          to="/create/upload"
          className="inline-block border-2 border-gray-800 px-8 py-3 font-mono text-sm hover:bg-gray-800 hover:text-white transition-colors"
        >
          [СОЗДАТЬ ЗАДАЧУ]
        </Link>
      </div>

      {/* Filters Section */}
      <div className="border-2 border-gray-800 p-6 mb-8 bg-white">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5" />
          <span className="font-mono text-sm">[ФИЛЬТРЫ]</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-mono mb-2 text-gray-600">Категория</label>
            <div className="border-2 border-gray-400 p-2 font-mono text-sm">
              [Все категории ▼]
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono mb-2 text-gray-600">Награда</label>
            <div className="border-2 border-gray-400 p-2 font-mono text-sm">
              [Любая ▼]
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono mb-2 text-gray-600">Дедлайн</label>
            <div className="border-2 border-gray-400 p-2 font-mono text-sm">
              [Любой ▼]
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono mb-2 text-gray-600">Поиск</label>
            <div className="border-2 border-gray-400 p-2 font-mono text-sm flex items-center gap-2">
              <Search className="w-4 h-4" />
              [Поиск...]
            </div>
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {mockTasks.map((task) => (
          <Link key={task.id} to={`/task/${task.id}`}>
            <div className="border-2 border-gray-800 p-6 bg-white hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="text-xs font-mono text-gray-500 mb-2">[{task.category}]</div>
                  <h3 className="font-mono text-base mb-2">{task.title}</h3>
                </div>
                <div className="border-2 border-gray-800 px-3 py-1 font-mono text-xs">
                  {task.reward} баллов
                </div>
              </div>
              
              <div className="border-t-2 border-gray-400 pt-4 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-600">[Метрика]:</span>
                  <span>[Accuracy / F1-Score]</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-600">[Baseline]:</span>
                  <span>[85.2%]</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-600">[Дедлайн]:</span>
                  <span>{task.deadline}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-600">[Участников]:</span>
                  <span>[12]</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <div className="border-2 border-gray-400 w-10 h-10 flex items-center justify-center font-mono text-sm">
          ←
        </div>
        <div className="border-2 border-gray-800 w-10 h-10 flex items-center justify-center font-mono text-sm bg-gray-800 text-white">
          1
        </div>
        <div className="border-2 border-gray-400 w-10 h-10 flex items-center justify-center font-mono text-sm">
          2
        </div>
        <div className="border-2 border-gray-400 w-10 h-10 flex items-center justify-center font-mono text-sm">
          3
        </div>
        <div className="border-2 border-gray-400 w-10 h-10 flex items-center justify-center font-mono text-sm">
          →
        </div>
      </div>
    </div>
  );
}