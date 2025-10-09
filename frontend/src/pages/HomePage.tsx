import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      setSkills([...skills, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    if (skills.length > 0) {
      navigate('/results', { state: { skills } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Career Matcher
          </h1>
          <p className="text-xl text-gray-600">
            Найдите идеальные вакансии на основе ваших навыков
          </p>
        </div>

        {/* Skills Input */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Введите ваши навыки</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Например: Python, React, Docker"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addSkill}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Добавить
            </button>
          </div>

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={skills.length === 0}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            Найти подходящие вакансии ({skills.length} навыков)
          </button>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Точный матчинг</h3>
            <p className="text-sm text-gray-600">
              Видите % совпадения ваших навыков с требованиями вакансии
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="font-semibold mb-2">Гибкая настройка</h3>
            <p className="text-sm text-gray-600">
              Меняйте минимальный процент совпадения под ваши цели
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Детальный анализ</h3>
            <p className="text-sm text-gray-600">
              Узнайте какие навыки вам нужно развить
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}