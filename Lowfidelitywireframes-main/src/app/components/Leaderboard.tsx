import { useState } from "react";
import { useParams, Link } from "react-router";
import { Filter, Trophy, TrendingUp, Bell, Award, Clock } from "lucide-react";

const mockLeaderboard = [
  { rank: 1, user: "user_alpha_42", score: 92.8, submissions: 8, lastSubmit: "14.03.2026 18:45", trend: "up" },
  { rank: 2, user: "ml_expert_99", score: 91.3, submissions: 12, lastSubmit: "14.03.2026 20:12", trend: "up" },
  { rank: 3, user: "data_wizard", score: 89.7, submissions: 6, lastSubmit: "13.03.2026 22:30", trend: "same" },
  { rank: 4, user: "neural_ninja", score: 87.6, submissions: 15, lastSubmit: "14.03.2026 19:23", trend: "down" },
  { rank: 5, user: "code_master", score: 86.4, submissions: 9, lastSubmit: "14.03.2026 16:08", trend: "up" },
  { rank: 6, user: "ai_researcher", score: 85.9, submissions: 11, lastSubmit: "13.03.2026 14:55", trend: "same" },
  { rank: 7, user: "algo_smith", score: 85.2, submissions: 4, lastSubmit: "12.03.2026 11:20", trend: "same" },
  { rank: 8, user: "tech_guru_88", score: 84.1, submissions: 7, lastSubmit: "14.03.2026 09:42", trend: "down" },
];

export function Leaderboard() {
  const { id } = useParams();
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Breadcrumbs */}
      <div className="text-xs font-mono text-gray-500 mb-6">
        <Link to="/" className="hover:underline">[Каталог]</Link> / 
        <Link to={`/task/${id}`} className="hover:underline"> [Задача #{id}]</Link> / 
        [Лидерборд]
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Leaderboard */}
        <div className="col-span-2 space-y-6">
          {/* Header */}
          <div className="border-2 border-gray-800 p-6 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <h1 className="font-mono text-xl">[ЛИДЕРБОРД]</h1>
                  <div className="text-xs font-mono text-gray-600">
                    Улучшение модели ML для классификации
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-gray-600">Дедлайн</div>
                <div className="font-mono">25.03.2026</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="border-2 border-gray-800 p-4 bg-white">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5" />
              <div className="flex gap-4 flex-1">
                <div className="border-2 border-gray-400 px-4 py-2 font-mono text-sm cursor-pointer hover:border-gray-800">
                  [Все участники ▼]
                </div>
                <div className="border-2 border-gray-400 px-4 py-2 font-mono text-sm cursor-pointer hover:border-gray-800">
                  [Период: За все время ▼]
                </div>
                <div className="border-2 border-gray-400 px-4 py-2 font-mono text-sm cursor-pointer hover:border-gray-800">
                  [Метрика: Accuracy ▼]
                </div>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="border-2 border-gray-800 bg-white">
            <div className="grid grid-cols-12 gap-4 p-4 border-b-2 border-gray-400 font-mono text-xs text-gray-600">
              <div className="col-span-1 text-center">[#]</div>
              <div className="col-span-3">[Участник]</div>
              <div className="col-span-2 text-center">[Accuracy]</div>
              <div className="col-span-2 text-center">[F1-Score]</div>
              <div className="col-span-2 text-center">[Отправок]</div>
              <div className="col-span-2 text-center">[Последняя]</div>
            </div>

            {/* Table Rows */}
            {mockLeaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-400 items-center hover:bg-gray-50 transition-colors ${
                  selectedWinner === entry.rank ? 'bg-gray-100' : ''
                }`}
              >
                <div className="col-span-1 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {entry.rank === 1 && <Trophy className="w-5 h-5 text-gray-800" />}
                    {entry.rank === 2 && <Award className="w-5 h-5 text-gray-600" />}
                    {entry.rank === 3 && <Award className="w-5 h-5 text-gray-400" />}
                    <span className="font-mono text-sm">{entry.rank}</span>
                  </div>
                </div>
                <div className="col-span-3 font-mono text-sm">{entry.user}</div>
                <div className="col-span-2 text-center font-mono">{entry.score}%</div>
                <div className="col-span-2 text-center font-mono text-gray-600">0.{85 + entry.rank}</div>
                <div className="col-span-2 text-center font-mono text-sm text-gray-600">
                  {entry.submissions}
                </div>
                <div className="col-span-2 text-center font-mono text-xs text-gray-600">
                  {entry.lastSubmit.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Winner Selection (for organizer) */}
          <div className="border-2 border-gray-800 p-6 bg-white">
            <h2 className="font-mono text-lg mb-4">[ВЫБОР ПОБЕДИТЕЛЯ]</h2>
            <p className="font-mono text-sm text-gray-600 mb-6">
              Соревнование завершится 25.03.2026. Победитель будет определен автоматически
              по лучшему результату на тестовом наборе.
            </p>
            <div className="flex gap-4">
              <button className="flex-1 border-2 border-gray-800 px-6 py-3 font-mono text-sm hover:bg-gray-800 hover:text-white transition-colors">
                [ЗАВЕРШИТЬ ДОСРОЧНО]
              </button>
              <button className="flex-1 border-2 border-gray-800 px-6 py-3 font-mono text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                [ПОДТВЕРДИТЬ ПОБЕДИТЕЛЯ]
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="border-2 border-gray-800 p-6 bg-white">
            <h3 className="font-mono text-sm mb-4">[СТАТИСТИКА]</h3>
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-400">
                <div className="text-xs font-mono text-gray-600 mb-1">Всего участников</div>
                <div className="font-mono text-2xl">23</div>
              </div>
              <div className="pb-3 border-b border-gray-400">
                <div className="text-xs font-mono text-gray-600 mb-1">Всего отправок</div>
                <div className="font-mono text-2xl">187</div>
              </div>
              <div className="pb-3 border-b border-gray-400">
                <div className="text-xs font-mono text-gray-600 mb-1">Лучший результат</div>
                <div className="font-mono text-2xl">92.8%</div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600 mb-1">Baseline</div>
                <div className="font-mono text-2xl">85.2%</div>
              </div>
            </div>
          </div>

          {/* Prize Pool */}
          <div className="border-2 border-gray-800 p-6 bg-white">
            <h3 className="font-mono text-sm mb-4">[ПРИЗОВОЙ ФОНД]</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border-2 border-gray-800">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-mono text-sm">Победитель</span>
                </div>
                <span className="font-mono">10000 баллов</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="border-2 border-gray-800 p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5" />
              <h3 className="font-mono text-sm">[УВЕДОМЛЕНИЯ]</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-gray-400">
                <div className="flex items-start gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-mono text-xs">
                      user_alpha_42 вышел на 1 место
                    </div>
                    <div className="font-mono text-xs text-gray-500 mt-1">
                      2 часа назад
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 border border-gray-400">
                <div className="flex items-start gap-2 mb-2">
                  <Clock className="w-4 h-4 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-mono text-xs">
                      Новая отправка от ml_expert_99
                    </div>
                    <div className="font-mono text-xs text-gray-500 mt-1">
                      4 часа назад
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 border border-gray-400">
                <div className="flex items-start gap-2 mb-2">
                  <Bell className="w-4 h-4 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-mono text-xs">
                      3 новых участника присоединились
                    </div>
                    <div className="font-mono text-xs text-gray-500 mt-1">
                      Вчера
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-2 border-gray-800 p-6 bg-white">
            <h3 className="font-mono text-sm mb-4">[ТАЙМЛАЙН]</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-800 mt-2"></div>
                <div className="flex-1">
                  <div className="font-mono text-xs">Начало соревнования</div>
                  <div className="font-mono text-xs text-gray-500">01.03.2026</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-800 mt-2"></div>
                <div className="flex-1">
                  <div className="font-mono text-xs">Текущий момент</div>
                  <div className="font-mono text-xs text-gray-500">14.03.2026</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 border-2 border-gray-400 mt-2"></div>
                <div className="flex-1">
                  <div className="font-mono text-xs text-gray-500">Завершение</div>
                  <div className="font-mono text-xs text-gray-500">25.03.2026</div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 border border-gray-400">
              <div className="font-mono text-xs text-gray-600 text-center">
                Осталось: 11 дней
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}