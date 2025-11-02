import { useState, useEffect } from 'react';
import { assessmentAPI } from '../api/assessment';
import type{  AssessmentQuestion } from '../api/assessment';
import type{  AssessmentResult } from '../api/assessment';
import Header from '../components/Header';

export default function AssessmentPage() {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await assessmentAPI.getQuestions('general');
      setQuestions(data);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setStage('quiz');
    loadQuestions();
  };

  const handleAnswer = (questionId: number, answerId: string) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const submission = {
        assessment_type: 'general',
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          user_answer: answer,
        })),
        time_taken_seconds: timeTaken,
      };

      const resultData = await assessmentAPI.submitAssessment(submission);
      setResult(resultData);
      setStage('result');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />

      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1rem' }}>
        {/* INTRO STAGE */}
        {stage === 'intro' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
            padding: '3rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
              Career Assessment
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
              Take this assessment to discover your current career level and get personalized recommendations for growth.
            </p>

            <div style={{
              background: '#f0f7ff',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}>
              <h3 style={{ marginTop: 0, color: '#3b82f6' }}>📋 What to expect:</h3>
              <ul style={{ color: '#555', lineHeight: '1.8' }}>
                <li>11 technical questions covering programming, system design, and leadership</li>
                <li>Questions range from Junior to Expert level</li>
                <li>Takes approximately 10-15 minutes</li>
                <li>Receive your level: Junior, Middle, Senior, or Team Lead</li>
                <li>Get personalized recommendations and earn XP!</li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 3rem',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.2rem',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1,
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? 'Loading...' : 'Start Assessment 🚀'}
            </button>
          </div>
        )}

        {/* QUIZ STAGE */}
        {stage === 'quiz' && currentQuestion && (
          <div>
            {/* Progress Bar */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: '#666',
              }}>
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            {/* Question Card */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
              padding: '2rem',
            }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}>
                <span style={{
                  background: '#e0f2fe',
                  color: '#0284c7',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}>
                  {currentQuestion.category}
                </span>
                <span style={{
                  background: getDifficultyColor(currentQuestion.difficulty),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              <h2 style={{
                fontSize: '1.5rem',
                marginBottom: '2rem',
                color: '#333',
                lineHeight: '1.6',
              }}>
                {currentQuestion.question_text}
              </h2>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      style={{
                        background: isSelected ? '#e0f2fe' : 'white',
                        border: `2px solid ${isSelected ? '#3b82f6' : '#e0e0e0'}`,
                        borderRadius: '8px',
                        padding: '1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.background = '#f0f9ff';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e0e0e0';
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      <strong>{option.id.toUpperCase()}.</strong> {option.text}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '2rem',
                gap: '1rem',
              }}>
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                  }}
                >
                  ← Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered || loading}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      borderRadius: '8px',
                      cursor: !allAnswered || loading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      opacity: !allAnswered || loading ? 0.5 : 1,
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Assessment ✓'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESULT STAGE */}
        {stage === 'result' && result && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
            padding: '3rem',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {getLevelEmoji(result.determined_level)}
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
                Your Level: {result.determined_level?.toUpperCase()}
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>
                Score: {result.total_score.toFixed(1)}%
              </p>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {result.correct_answers}/{result.total_questions}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Correct Answers</div>
              </div>
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                  +{result.xp_earned}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>XP Earned</div>
              </div>
              <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  {result.time_taken_seconds ? Math.floor(result.time_taken_seconds / 60) : 0}m
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Time Taken</div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            {(result.strengths && result.strengths.length > 0) && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>💪 Strengths</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {result.strengths.map((strength, i) => (
                    <span key={i} style={{
                      background: '#d1fae5',
                      color: '#065f46',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                    }}>
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(result.weaknesses && result.weaknesses.length > 0) && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>📈 Areas to Improve</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {result.weaknesses.map((weakness, i) => (
                    <span key={i} style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                    }}>
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && (
              <div style={{
                background: '#f0f9ff',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}>
                <h3 style={{ marginTop: 0, color: '#3b82f6' }}>💡 Recommendations</h3>
                <p style={{ color: '#555', lineHeight: '1.6', margin: 0 }}>
                  {result.recommendations}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.location.href = '/profile'}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  setStage('intro');
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setResult(null);
                }}
                style={{
                  flex: 1,
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                Take Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    junior: '#10b981',
    middle: '#f59e0b',
    senior: '#ef4444',
    expert: '#8b5cf6',
  };
  return colors[difficulty.toLowerCase()] || '#6c757d';
}

function getLevelEmoji(level: string): string {
  const emojis: Record<string, string> = {
    junior: '🌱',
    middle: '⭐',
    senior: '🚀',
    team_lead: '👑',
  };
  return emojis[level?.toLowerCase()] || '🎯';
}