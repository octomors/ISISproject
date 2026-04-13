import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Upload, FolderGit2, Database, ArrowRight } from "lucide-react";

export function CreateTaskUpload() {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState<'repository' | 'dataset'>('repository');

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-gray-800 bg-gray-800 text-white flex items-center justify-center font-mono text-sm">
              1
            </div>
            <span className="font-mono text-sm">[Загрузка]</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-400"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-gray-400 flex items-center justify-center font-mono text-sm text-gray-400">
              2
            </div>
            <span className="font-mono text-sm text-gray-400">[Метрики]</span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h1 className="font-mono text-xl mb-8">[СОЗДАНИЕ ЗАДАЧИ - ЗАГРУЗКА ДАННЫХ]</h1>

        {/* Upload Type Selection */}
        <div className="mb-8">
          <label className="block font-mono text-sm mb-4">[Тип данных]</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUploadType('repository')}
              className={`p-6 border-2 font-mono text-sm transition-all ${
                uploadType === 'repository'
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-400 hover:border-gray-800'
              }`}
            >
              <FolderGit2 className="w-8 h-8 mb-3 mx-auto" />
              <div>[Git Repository]</div>
            </button>
            <button
              onClick={() => setUploadType('dataset')}
              className={`p-6 border-2 font-mono text-sm transition-all ${
                uploadType === 'dataset'
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-400 hover:border-gray-800'
              }`}
            >
              <Database className="w-8 h-8 mb-3 mx-auto" />
              <div>[Dataset Upload]</div>
            </button>
          </div>
        </div>

        {/* Repository Upload */}
        {uploadType === 'repository' && (
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-sm mb-3">[URL репозитория]</label>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [https://github.com/username/repo.git]
              </div>
            </div>

            <div>
              <label className="block font-mono text-sm mb-3">[Branch]</label>
              <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                [main]
              </div>
            </div>
          </div>
        )}

        {/* Dataset Upload */}
        {uploadType === 'dataset' && (
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-sm mb-3">[Обучающий набор]</label>
              <div className="border-2 border-dashed border-gray-400 p-8 text-center hover:border-gray-800 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <div className="font-mono text-sm text-gray-600">
                  [Загрузить training set]
                </div>
              </div>
            </div>

            <div>
              <label className="block font-mono text-sm mb-3">[Валидационный набор]</label>
              <div className="border-2 border-dashed border-gray-400 p-8 text-center hover:border-gray-800 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <div className="font-mono text-sm text-gray-600">
                  [Загрузить validation set]
                </div>
              </div>
            </div>

            <div>
              <label className="block font-mono text-sm mb-3">[Тестовый набор (скрытый)]</label>
              <div className="border-2 border-dashed border-gray-400 p-8 text-center hover:border-gray-800 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <div className="font-mono text-sm text-gray-600">
                  [Загрузить test set]
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Baseline Configuration */}
      <div className="border-2 border-gray-800 p-8 mb-6 bg-white">
        <h2 className="font-mono text-lg mb-6">[BASELINE МОДЕЛЬ]</h2>

        <div className="space-y-6">
          <div>
            <label className="block font-mono text-sm mb-3">[Скрипт baseline модели]</label>
            <div className="border-2 border-dashed border-gray-400 p-8 text-center hover:border-gray-800 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <div className="font-mono text-sm text-gray-600">
                [Загрузить baseline.py или baseline.zip]
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-sm mb-3">[Результаты baseline на валидации]</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs font-mono text-gray-600 mb-2">Metric 1</div>
                <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                  [85.2]
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600 mb-2">Metric 2</div>
                <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                  [0.831]
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600 mb-2">Время (ms)</div>
                <div className="border-2 border-gray-400 p-3 font-mono text-sm">
                  [95]
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-sm mb-3">[Описание baseline подхода]</label>
            <div className="border-2 border-gray-400 p-4 min-h-24 font-mono text-sm">
              [Описание используемой архитектуры и подхода...]
            </div>
          </div>
        </div>
      </div>

      {/* Environment Configuration */}
      <div className="border-2 border-gray-800 p-8 mb-8 bg-white">
        <h2 className="font-mono text-lg mb-6">[ОКРУЖЕНИЕ]</h2>

        <div className="space-y-6">
          <div>
            <label className="block font-mono text-sm mb-3">[Python версия]</label>
            <div className="border-2 border-gray-400 p-3 font-mono text-sm">
              [3.9 ▼]
            </div>
          </div>

          <div>
            <label className="block font-mono text-sm mb-3">[requirements.txt или environment.yml]</label>
            <div className="border-2 border-dashed border-gray-400 p-8 text-center hover:border-gray-800 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <div className="font-mono text-sm text-gray-600">
                [Загрузить файл зависимостей]
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-sm mb-3">[Docker image (опционально)]</label>
            <div className="border-2 border-gray-400 p-3 font-mono text-sm">
              [python:3.9-slim]
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Link
          to="/"
          className="border-2 border-gray-800 px-8 py-4 font-mono hover:bg-gray-100 transition-colors"
        >
          [ОТМЕНА]
        </Link>
        <button
          onClick={() => navigate('/create/metrics')}
          className="flex-1 border-2 border-gray-800 px-8 py-4 font-mono bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center justify-center gap-3"
        >
          [ДАЛЕЕ: НАСТРОЙКА МЕТРИК]
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}