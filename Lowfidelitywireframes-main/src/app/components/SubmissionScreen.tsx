import { useState } from "react";
import { useParams, Link } from "react-router";
import { Upload, FileCode, CheckCircle, XCircle, Clock } from "lucide-react";

export function SubmissionScreen() {
  const { id } = useParams();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'checking' | 'success' | 'error'>('idle');

  const handleSubmit = () => {
    setStatus('uploading');
    setTimeout(() => setStatus('checking'), 1500);
    setTimeout(() => setStatus('success'), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Breadcrumbs */}
      <div className="text-xs font-mono text-gray-500 mb-6">
        <Link to="/" className="hover:underline">[Каталог]</Link> / 
        <Link to={`/task/${id}`} className="hover:underline"> [Задача #{id}]</Link> / 
        [Отправка решения]
      </div>

      {/* Task Info */}
      <div className="border-2 border-gray-800 p-6 mb-8 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-gray-500 mb-1">[ЗАДАЧА]</div>
            <div className="font-mono">Улучшение модели ML для классификации</div>
          </div>
          <div className="text-xs font-mono text-gray-600">
            [Дедлайн: 25.03.2026]
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h1 className="font-mono text-xl mb-6">[ЗАГРУЗКА РЕШЕНИЯ]</h1>

        {/* File Upload Area */}
        <div className="mb-6">
          <label className="block font-mono text-sm mb-3">[Патч / Архив с моделью]</label>
          <div className="border-2 border-dashed border-gray-400 p-12 text-center hover:border-gray-800 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="font-mono text-sm text-gray-600 mb-2">
              [Перетащите файл сюда или нажмите для выбора]
            </div>
            <div className="font-mono text-xs text-gray-400">
              [Поддерживаемые форматы: .zip, .tar.gz, .patch (макс. 100MB)]
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-mono text-sm mb-3">[Описание решения (опционально)]</label>
          <div className="border-2 border-gray-400 p-4 min-h-32 font-mono text-sm">
            [Введите описание вашего подхода...]
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="border-2 border-gray-400 p-6 mb-6">
          <div className="font-mono text-sm mb-4">[ПРОВЕРКА ТРЕБОВАНИЙ]</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-800"></div>
              <span>Размер модели &lt; 50MB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-800"></div>
              <span>Использование памяти &lt; 2GB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-800"></div>
              <span>Время inference &lt; 100ms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-800"></div>
              <span>Валидный формат файла</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={status !== 'idle'}
          className="w-full border-2 border-gray-800 px-8 py-4 font-mono bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'idle' && '[ОТПРАВИТЬ РЕШЕНИЕ]'}
          {status === 'uploading' && '[ЗАГРУЗКА...]'}
          {status === 'checking' && '[ПРОВЕРКА...]'}
          {status === 'success' && '[ОТПРАВЛЕНО]'}
          {status === 'error' && '[ОШИБКА - ПОВТОРИТЬ]'}
        </button>
      </div>

      {/* Status Section */}
      {status !== 'idle' && (
        <div className="border-2 border-gray-800 p-8 bg-white">
          <h2 className="font-mono text-lg mb-6">[СТАТУС ПРОВЕРКИ]</h2>
          
          <div className="space-y-4">
            {/* Upload Status */}
            <div className="flex items-center gap-4 p-4 border-2 border-gray-400">
              {status === 'uploading' ? (
                <Clock className="w-6 h-6 text-gray-500 animate-pulse" />
              ) : (
                <CheckCircle className="w-6 h-6" />
              )}
              <div className="flex-1">
                <div className="font-mono text-sm">Загрузка файла</div>
                {status === 'uploading' && (
                  <div className="mt-2 h-2 border border-gray-400">
                    <div className="h-full bg-gray-800 w-2/3 transition-all"></div>
                  </div>
                )}
              </div>
              <div className="font-mono text-xs text-gray-600">
                {status === 'uploading' ? '[В процессе...]' : '[Завершено]'}
              </div>
            </div>

            {/* Validation Status */}
            <div className="flex items-center gap-4 p-4 border-2 border-gray-400">
              {status === 'checking' || status === 'uploading' ? (
                <Clock className="w-6 h-6 text-gray-500 animate-pulse" />
              ) : status === 'success' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
              )}
              <div className="flex-1">
                <div className="font-mono text-sm">Проверка требований</div>
              </div>
              <div className="font-mono text-xs text-gray-600">
                {status === 'checking' ? '[Проверка...]' : status === 'success' ? '[Пройдено]' : '[Ожидание]'}
              </div>
            </div>

            {/* Testing Status */}
            <div className="flex items-center gap-4 p-4 border-2 border-gray-400">
              {status === 'success' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
              )}
              <div className="flex-1">
                <div className="font-mono text-sm">Тестирование на валидационном наборе</div>
              </div>
              <div className="font-mono text-xs text-gray-600">
                {status === 'success' ? '[Завершено]' : '[Ожидание]'}
              </div>
            </div>
          </div>

          {/* Results */}
          {status === 'success' && (
            <div className="mt-6 p-6 border-2 border-gray-800 bg-gray-50">
              <div className="font-mono text-sm mb-4">[РЕЗУЛЬТАТЫ]</div>
              <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Accuracy:</div>
                  <div className="text-lg">87.6%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">F1-Score:</div>
                  <div className="text-lg">0.854</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Inference Time:</div>
                  <div className="text-lg">78ms</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-400">
                <div className="flex items-center gap-2 text-sm font-mono">
                  <CheckCircle className="w-5 h-5" />
                  <span>Решение принято! Позиция в лидерборде: #4</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Previous Submissions */}
      <div className="border-2 border-gray-800 p-8 mt-8 bg-white">
        <h2 className="font-mono text-lg mb-6">[ИСТОРИЯ ОТПРАВОК]</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border-2 border-gray-400">
              <div className="flex items-center gap-4">
                <FileCode className="w-5 h-5" />
                <div className="font-mono text-sm">
                  <div>submission_{i}.zip</div>
                  <div className="text-xs text-gray-600">14.03.2026 15:3{i}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm font-mono">Accuracy: 8{i + 3}.{i}%</div>
                <div className="text-xs font-mono text-gray-600">[Позиция: #{5 + i}]</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
