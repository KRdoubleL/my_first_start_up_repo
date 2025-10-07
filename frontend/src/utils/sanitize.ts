// Защита от XSS атак - очистка пользовательского ввода
export const sanitizeInput = (input: string): string => {
  // Удаляем HTML теги
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// Валидация навыков
export const sanitizeSkill = (skill: string): string => {
  // Только буквы, цифры, пробелы, дефисы, точки
  return skill
    .replace(/[^a-zA-Z0-9\s\-\.#+]/g, '')
    .trim()
    .slice(0, 50) // Максимум 50 символов
}

// Валидация списка навыков
export const sanitizeSkillsList = (skills: string[]): string[] => {
  return skills
    .map(skill => sanitizeSkill(skill))
    .filter(skill => skill.length > 0 && skill.length <= 50)
    .slice(0, 20) // Максимум 20 навыков
}