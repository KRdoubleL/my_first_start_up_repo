import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { mockJobs } from '../data/mockJobs';
import JobCard from '../components/JobCard';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userSkills = location.state?.skills as string[] || [];
  const [minMatchPercentage, setMinMatchPercentage] = useState(0);

  // Сохраняем навыки в sessionStorage для доступа на странице деталей
  useEffect(() => {
    if (userSkills.length > 0) {
      sessionStorage.setItem('userSkills', JSON.stringify(userSkills));
    }
  }, [userSkills]);

  // Если нет навыков - редирект на главную
  if (userSkills.length === 0) {
    navigate('/');
    return null;
  }

  // Вычисляем % совпадения для каждой вакансии
  const jobsWithMatch = useMemo(() => {
    return mockJobs.map((job) => {
      // Нормализуем навыки (lowercase для сравнения)
      const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
      const normalizedJobSkills = job.requiredSkills.map(s => s.toLowerCase());

      // Считаем совпадения
      const matchingSkills = normalizedJobSkills.filter(skill =>
        normalizedUserSkills.includes(skill)
      );

      // Процент совпадения
      const matchPercentage = Math.round(
        (matchingSkills.length / normalizedJobSkills.length) * 100
      );

      return {
        ...job,
        matchPercentage,
        matchingSkillsCount: matchingSkills.length,
      };
    });
  }, [userSkills]);

  // Фильтруем и сортируем
  const filteredJobs = jobsWithMatch
    .filter(job => job.matchPercentage >= minMatchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Назад к поиску
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Найденные вакансии
          </h1>
          <p className="text-gray-600">
            Показаны {filteredJobs.length} вакансий из {mockJobs.length}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ваши навыки:
              </label>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Минимальное совпадение: {minMatchPercentage}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={minMatchPercentage}
                onChange={(e) => setMinMatchPercentage(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {filteredJobs.length}
            </div>
            <div className="text-sm text-gray-600">Всего вакансий</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {filteredJobs.filter(j => j.matchPercentage >= 80).length}
            </div>
            <div className="text-sm text-gray-600">Отличное совпадение (80%+)</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {filteredJobs.filter(j => j.matchPercentage >= 60 && j.matchPercentage < 80).length}
            </div>
            <div className="text-sm text-gray-600">Хорошее совпадение (60-79%)</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-gray-600 mb-1">
              {Math.round(filteredJobs.reduce((sum, j) => sum + j.matchPercentage, 0) / filteredJobs.length) || 0}%
            </div>
            <div className="text-sm text-gray-600">Среднее совпадение</div>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Нет подходящих вакансий
            </h3>
            <p className="text-gray-600 mb-6">
              Попробуйте снизить минимальный процент совпадения или добавьте больше навыков
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
            >
              Изменить навыки
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}