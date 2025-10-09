import type { Job } from '../data/mockJobs';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const matchColor = 
  (job.matchPercentage ?? 0) >= 80 ? 'bg-green-100 text-green-800 border-green-300' :
  (job.matchPercentage ?? 0) >= 60 ? 'bg-blue-100 text-blue-800 border-blue-300' :
  (job.matchPercentage ?? 0) >= 40 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
  'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
      {/* Header with Match % */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        {job.matchPercentage !== undefined && (
          <div className={`px-4 py-2 rounded-full border-2 ${matchColor} font-bold text-lg`}>
            {job.matchPercentage}%
          </div>
        )}
      </div>

      {/* Location & Salary */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <span>📍</span>
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <span>💰</span>
          <span>{job.salary}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      {/* Skills */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition-colors">
        View Details
      </button>
    </div>
  );
}