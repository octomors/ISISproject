import { useParams, Link } from "react-router";
import { Download, Send, TrendingUp, Users, Calendar, Award } from "lucide-react";

export function TaskDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      {/* Breadcrumbs */}
      <div className="text-xs font-mono text-gray-500 mb-6">
        <Link to="/" className="hover:underline">[Каталог]</Link> / [Задача #{id}]
      </div>

      {/* Task Header */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="text-xs font-mono text-gray-500 mb-2">[Категория: Machine Learning]</div>
            <h1 className="text-2xl font-mono mb-4">Улучшение модели ML для классификации</h1>
          </div>
          <div className="border-2 border-gray-800 px-6 py-2 font-mono">
            10000 баллов
          </div>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-4 gap-4 p-4 border-2 border-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <div>
              <div className="text-xs font-mono text-gray-600">[Дедлайн]</div>
              <div className="text-sm font-mono">25.03.2026</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <div>
              <div className="text-xs font-mono text-gray-600">[Участников]</div>
              <div className="text-sm font-mono">23</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <div>
              <div className="text-xs font-mono text-gray-600">[Решений]</div>
              <div className="text-sm font-mono">47</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <div>
              <div className="text-xs font-mono text-gray-600">[Статус]</div>
              <div className="text-sm font-mono">[Активна]</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h2 className="font-mono text-lg mb-4">[ОПИСАНИЕ ЗАДАЧИ]</h2>
        <div className="space-y-4 text-sm font-mono text-gray-700">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Необходимо улучшить
            существующую модель машинного обучения для классификации изображений.
          </p>
          <p>
            Baseline модель показывает точность 85.2%. Ваша задача - превзойти этот
            результат используя предоставленный датасет и ограничения.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h2 className="font-mono text-lg mb-4">[МЕТРИКИ И ОГРАНИЧЕНИЯ]</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-mono text-sm mb-3 text-gray-600">[Метрики оценки]</h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between p-2 border border-gray-400">
                <span>Accuracy:</span>
                <span className="text-gray-600">[Primary]</span>
              </div>
              <div className="flex justify-between p-2 border border-gray-400">
                <span>F1-Score:</span>
                <span className="text-gray-600">[Secondary]</span>
              </div>
              <div className="flex justify-between p-2 border border-gray-400">
                <span>Inference Time:</span>
                <span className="text-gray-600">{"[< 100ms]"}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-sm mb-3 text-gray-600">[Ограничения]</h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="p-2 border border-gray-400">
                Model size: &lt; 50MB
              </div>
              <div className="p-2 border border-gray-400">
                Memory usage: &lt; 2GB RAM
              </div>
              <div className="p-2 border border-gray-400">
                Python 3.9+, PyTorch or TensorFlow
              </div>
              <div className="p-2 border border-gray-400">
                No external data allowed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Info */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h2 className="font-mono text-lg mb-4">[ДАННЫЕ]</h2>
        <div className="space-y-3 text-sm font-mono">
          <div className="flex justify-between p-3 border border-gray-400">
            <span>Training set:</span>
            <span className="text-gray-600">[10,000 images]</span>
          </div>
          <div className="flex justify-between p-3 border border-gray-400">
            <span>Validation set:</span>
            <span className="text-gray-600">[2,000 images]</span>
          </div>
          <div className="flex justify-between p-3 border border-gray-400">
            <span>Test set:</span>
            <span className="text-gray-600">[3,000 images - hidden]</span>
          </div>
          <div className="flex justify-between p-3 border border-gray-400">
            <span>Format:</span>
            <span className="text-gray-600">[JPG, 224x224]</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 border-2 border-gray-800 px-8 py-4 font-mono flex items-center justify-center gap-3 hover:bg-gray-800 hover:text-white transition-colors">
          <Download className="w-5 h-5" />
          [СКАЧАТЬ ДАННЫЕ]
        </button>
        <Link
          to={`/submit/${id}`}
          className="flex-1 border-2 border-gray-800 px-8 py-4 font-mono flex items-center justify-center gap-3 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          <Send className="w-5 h-5" />
          [ОТПРАВИТЬ РЕШЕНИЕ]
        </Link>
        <Link
          to={`/leaderboard/${id}`}
          className="flex-1 border-2 border-gray-800 px-8 py-4 font-mono flex items-center justify-center gap-3 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <TrendingUp className="w-5 h-5" />
          [ЛИДЕРБОРД]
        </Link>
      </div>
    </div>
  );
}