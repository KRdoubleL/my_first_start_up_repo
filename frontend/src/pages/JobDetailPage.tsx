import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockJobs } from '../data/mockJobs';
import { useMemo } from 'react';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Получаем навыки пользователя из localStorage (временно) или из location.state
  const userSkillsString = sessionStorage.getItem('userSkills');
  const userSkills: string[] = userSkillsString ? JSON.parse(userSkillsString) : [];
  
  // Находим вакансию по ID
  const job = mockJobs.find(j => j.id === id);
  
  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Вакансия не найдена</h1>
          <Link to="/results" className="text-blue-600 hover:text-blue-700">
            ← Назад к результатам
          </Link>
        </div>
      </div>
    );
  }
  
  // Вычисляем совпадения навыков
const skillsAnalysis = useMemo(() => {
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
  
  const matching = job.requiredSkills.filter(skill =>
    normalizedUserSkills.includes(skill.toLowerCase())
  );
  
  const missing = job.requiredSkills.filter(skill =>
    !normalizedUserSkills.includes(skill.toLowerCase())
  );
  
  const matchPercentage = Math.round((matching.length / job.requiredSkills.length) * 100);
  
  return { matching, missing, matchPercentage };
}, [job, userSkills]);
  
  const matchColor = 
    skillsAnalysis.matchPercentage >= 80 ? 'text-green-600 bg-green-50 border-green-300' :
    skillsAnalysis.matchPercentage >= 60 ? 'text-blue-600 bg-blue-50 border-blue-300' :
    skillsAnalysis.matchPercentage >= 40 ? 'text-yellow-600 bg-yellow-50 border-yellow-300' :
    'text-gray-600 bg-gray-50 border-gray-300';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Назад к результатам
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-2xl text-gray-600 mb-4">{job.company}</p>
              
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span className="text-lg">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <span className="text-lg font-semibold">{job.salary}</span>
                </div>
              </div>
            </div>
            
            {/* Match Badge */}
            <div className={`px-6 py-3 rounded-full border-2 ${matchColor} font-bold text-2xl`}>
              {skillsAnalysis.matchPercentage}%
            </div>
          </div>
        </div>

        {/* Skills Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Matching Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">✅</span>
              <h2 className="text-2xl font-bold text-green-600">
                У вас есть ({skillsAnalysis.matching.length})
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsAnalysis.matching.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-300"
                >
                  {skill}
                </span>
              ))}
              {skillsAnalysis.matching.length === 0 && (
                <p className="text-gray-500 italic">Нет совпадающих навыков</p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">📚</span>
              <h2 className="text-2xl font-bold text-orange-600">
                Нужно развить ({skillsAnalysis.missing.length})
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsAnalysis.missing.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-300"
                >
                  {skill}
                </span>
              ))}
              {skillsAnalysis.missing.length === 0 && (
                <p className="text-green-600 font-semibold">🎉 У вас есть все требуемые навыки!</p>
              )}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание вакансии</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">{job.description}</p>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">Требования:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {job.requiredSkills.map((skill, index) => (
              <li key={index} className="text-lg">
                <span className="font-medium">{skill}</span>
                {skillsAnalysis.matching.includes(skill) && (
                  <span className="ml-2 text-green-600 font-bold">✓</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg shadow-md transition-colors">
            📧 Откликнуться на вакансию
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg shadow-md transition-colors">
            ❤️ Добавить в избранное
          </button>
        </div>

        {/* Tips Section */}
        {skillsAnalysis.missing.length > 0 && (
          <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">💡 Рекомендации:</h3>
            <p className="text-yellow-700 mb-2">
              Вам не хватает {skillsAnalysis.missing.length} навыка(ов) для этой вакансии.
            </p>
            <p className="text-yellow-700">
              Рекомендуем пройти курсы по: <span className="font-semibold">{skillsAnalysis.missing.slice(0, 3).join(', ')}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}