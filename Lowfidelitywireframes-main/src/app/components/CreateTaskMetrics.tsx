import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, X, CheckCircle } from "lucide-react";

export function CreateTaskMetrics() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-gray-800 bg-white flex items-center justify-center font-mono text-sm">
              ✓
            </div>
            <span className="font-mono text-sm">[Загрузка]</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-800"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-gray-800 bg-gray-800 text-white flex items-center justify-center font-mono text-sm">
              2
            </div>
            <span className="font-mono text-sm">[Метрики]</span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h1 className="font-mono text-xl mb-8">[СОЗДАНИЕ ЗАДАЧИ - МЕТРИКИ И ПУБЛИКАЦИЯ]</h1>

        {/* Task Info */}
        <div className="mb-8">
          <label className="block font-mono text-sm mb-3">[Название задачи]</label>
          <div className="border-2 border-gray-400 p-3 font-mono text-sm">
            [Введите название задачи...]
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-mono text-sm mb-3">[Описание]</label>
          <div className="border-2 border-gray-400 p-4 min-h-32 font-mono text-sm">
            [Подробное описание задачи, целей и контекста...]
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-mono text-sm mb-3">[Категория]</label>
          <div className="border-2 border-gray-400 p-3 font-mono text-sm">
            [Выберите категорию ▼]
          </div>
        </div>
      </div>

      {/* Metrics Configuration */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h2 className="font-mono text-lg mb-6">[МЕТРИКИ ОЦЕНКИ]</h2>

        <div className="space-y-4 mb-6">
          {/* Primary Metric */}
          <div className="border-2 border-gray-400 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-sm">[Основная метрика]</div>
              <div className="px-3 py-1 border border-gray-800 font-mono text-xs">PRIMARY</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-gray-600 mb-2">Тип метрики</div>
                <div className="border-2 border-gray-400 p-2 font-mono text-sm">
                  [Accuracy ▼]
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600 mb-2">Целевое значение</div>
                <div className="border-2 border-gray-400 p-2 font-mono text-sm">
                  [Maximize ▼]
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="border-2 border-gray-400 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-sm">[Дополнительная метрика]</div>
              <button className="text-gray-400 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-gray-600 mb-2">Тип метрики</div>
                <div className="border-2 border-gray-400 p-2 font-mono text-sm">
                  [F1-Score ▼]
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600 mb-2">Вес</div>
                <div className="border-2 border-gray-400 p-2 font-mono text-sm">
                  [0.5]
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full border-2 border-dashed border-gray-400 p-4 font-mono text-sm hover:border-gray-800 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          [ДОБАВИТЬ МЕТРИКУ]
        </button>
      </div>

      {/* Constraints */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h2 className="font-mono text-lg mb-6">[ОГРАНИЧЕНИЯ]</h2>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono text-gray-600 mb-2">Максимальный размер модели (MB)</div>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [50]
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-gray-600 mb-2">Максимальное использование памяти (GB)</div>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [2]
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono text-gray-600 mb-2">Максимальное время inference (ms)</div>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [100]
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-gray-600 mb-2">Максимальное время обучения (часов)</div>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [24]
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-gray-600 mb-2">Дополнительные ограничения</div>
            <div className="border-2 border-gray-400 p-4 min-h-24 font-mono text-sm">
              [Например: только PyTorch/TensorFlow, без внешних данных...]
            </div>
          </div>
        </div>
      </div>

      {/* Competition Settings */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h2 className="font-mono text-lg mb-6">[НАСТРОЙКИ СОРЕВНОВАНИЯ]</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm mb-3">[Дедлайн]</label>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [25.03.2026 23:59]
              </div>
            </div>
            <div>
              <label className="block font-mono text-sm mb-3">[Награда]</label>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [10000] баллов
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-sm mb-3">[Максимум участников]</label>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [Без ограничений ▼]
              </div>
            </div>
            <div>
              <label className="block font-mono text-sm mb-3">[Максимум отправок на участника]</label>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [10]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Link
          to="/create/upload"
          className="border-2 border-gray-800 px-8 py-4 font-mono hover:bg-gray-100 transition-colors"
        >
          [НАЗАД]
        </Link>
        <button
          onClick={handlePublish}
          className="flex-1 border-2 border-gray-800 px-8 py-4 font-mono bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          [ОПУБЛИКОВАТЬ ЗАДАЧУ]
        </button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="border-4 border-gray-800 bg-white p-12 max-w-md">
            <CheckCircle className="w-16 h-16 mx-auto mb-6" />
            <h2 className="font-mono text-xl text-center mb-4">[ЗАДАЧА СОЗДАНА]</h2>
            <p className="font-mono text-sm text-center text-gray-600">
              Перенаправление в каталог...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}