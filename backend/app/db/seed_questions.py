"""
Скрипт для добавления тестовых вопросов в БД
Запустить: python seed_questions.py
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.assessment import AssessmentQuestion, AssessmentTypeEnum, DifficultyEnum

# Создаём таблицы если их нет
Base.metadata.create_all(bind=engine)

def seed_questions():
    db = SessionLocal()
    
    # Проверяем есть ли уже вопросы
    existing = db.query(AssessmentQuestion).count()
    if existing > 0:
        print(f"Already have {existing} questions. Skipping seed.")
        db.close()
        return
    
    questions = [
        # JUNIOR LEVEL - Programming
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "Programming",
            "question_text": "What is a variable in programming?",
            "difficulty": DifficultyEnum.JUNIOR,
            "options": [
                {"id": "a", "text": "A storage location with a name", "points": 10},
                {"id": "b", "text": "A function that returns a value", "points": 0},
                {"id": "c", "text": "A type of loop", "points": 0},
                {"id": "d", "text": "A database table", "points": 0},
            ],
            "correct_answer": "a",
            "max_points": 10,
            "explanation": "A variable is a named storage location in memory that holds a value.",
        },
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "Programming",
            "question_text": "Which data structure uses LIFO (Last In First Out)?",
            "difficulty": DifficultyEnum.JUNIOR,
            "options": [
                {"id": "a", "text": "Queue", "points": 0},
                {"id": "b", "text": "Stack", "points": 10},
                {"id": "c", "text": "Array", "points": 0},
                {"id": "d", "text": "Tree", "points": 0},
            ],
            "correct_answer": "b",
            "max_points": 10,
            "explanation": "A stack follows the LIFO principle - the last element added is the first one removed.",
        },
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "Programming",
            "question_text": "What does API stand for?",
            "difficulty": DifficultyEnum.JUNIOR,
            "options": [
                {"id": "a", "text": "Application Programming Interface", "points": 10},
                {"id": "b", "text": "Advanced Program Integration", "points": 0},
                {"id": "c", "text": "Automated Process Indicator", "points": 0},
                {"id": "d", "text": "Application Process Integration", "points": 0},
            ],
            "correct_answer": "a",
            "max_points": 10,
            "explanation": "API stands for Application Programming Interface - a way for programs to communicate.",
        },
        
        # MIDDLE LEVEL - System Design
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "System Design",
            "question_text": "What is the main benefit of using a Load Balancer?",
            "difficulty": DifficultyEnum.MIDDLE,
            "options": [
                {"id": "a", "text": "Increases database speed", "points": 0},
                {"id": "b", "text": "Distributes traffic across multiple servers", "points": 10},
                {"id": "c", "text": "Encrypts user data", "points": 0},
                {"id": "d", "text": "Reduces code complexity", "points": 0},
            ],
            "correct_answer": "b",
            "max_points": 10,
            "explanation": "Load balancers distribute incoming traffic across multiple servers to improve availability and performance.",
        },
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "System Design",
            "question_text": "Which database type is best for hierarchical data?",
            "difficulty": DifficultyEnum.MIDDLE,
            "options": [
                {"id": "a", "text": "Relational (SQL)", "points": 0},
                {"id": "b", "text": "Document (NoSQL)", "points": 10},
                {"id": "c", "text": "Key-Value", "points": 0},
                {"id": "d", "text": "Graph", "points": 5},
            ],
            "correct_answer": "b",
            "max_points": 10,
            "explanation": "Document databases like MongoDB are excellent for hierarchical/nested data structures.",
        },
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "Programming",
            "question_text": "What is the time complexity of binary search?",
            "difficulty": DifficultyEnum.MIDDLE,
            "options": [
                {"id": "a", "text": "O(n)", "points": 0},
                {"id": "b", "text": "O(log n)", "points": 10},
                {"id": "c", "text": "O(n²)", "points": 0},
                {"id": "d", "text": "O(1)", "points": 0},
            ],
            "correct_answer": "b",
            "max_points": 10,
            "explanation": "Binary search has O(log n) complexity as it halves the search space each iteration.",
        },
        
        # SENIOR LEVEL - Architecture
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "Architecture",
            "question_text": "What is the CAP theorem in distributed systems?",
            "difficulty": DifficultyEnum.SENIOR,
            "options": [
                {"id": "a", "text": "Consistency, Availability, Partition tolerance - can only guarantee 2 of 3", "points": 10},
                {"id": "b", "text": "A method for caching data", "points": 0},
                {"id": "c", "text": "A database indexing strategy", "points": 0},
                {"id": "d", "text": "A security protocol", "points": 0},
            ],
            "correct_answer": "a",
            "max_points": 10,
            "explanation": "CAP theorem states that distributed systems can only guarantee 2 out of 3: Consistency, Availability, and Partition tolerance.",
        },
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "Architecture",
            "question_text": "What is Event Sourcing?",
            "difficulty": DifficultyEnum.SENIOR,
            "options": [
                {"id": "a", "text": "A caching strategy", "points": 0},
                {"id": "b", "text": "Storing all changes as a sequence of events", "points": 10},
                {"id": "c", "text": "A testing methodology", "points": 0},
                {"id": "d", "text": "A deployment pattern", "points": 0},
            ],
            "correct_answer": "b",
            "max_points": 10,
            "explanation": "Event Sourcing stores the state of a system as a sequence of events rather than just the current state.",
        },
        {
            "assessment_type": AssessmentTypeEnum.TECHNICAL,
            "category": "System Design",
            "question_text": "What is the main advantage of microservices over monolithic architecture?",
            "difficulty": DifficultyEnum.SENIOR,
            "options": [
                {"id": "a", "text": "Easier to write initially", "points": 0},
                {"id": "b", "text": "Independent deployment and scaling", "points": 10},
                {"id": "c", "text": "Lower infrastructure costs", "points": 0},
                {"id": "d", "text": "No need for testing", "points": 0},
            ],
            "correct_answer": "b",
            "max_points": 10,
            "explanation": "Microservices allow independent deployment, scaling, and technology choices for each service.",
        },
        
        # EXPERT/TEAM LEAD - Leadership
        {
            "assessment_type": AssessmentTypeEnum.LEADERSHIP,
            "category": "Management",
            "question_text": "What is the most important quality of a technical lead?",
            "difficulty": DifficultyEnum.EXPERT,
            "options": [
                {"id": "a", "text": "Being the best coder on the team", "points": 0},
                {"id": "b", "text": "Enabling and empowering the team", "points": 10},
                {"id": "c", "text": "Making all technical decisions alone", "points": 0},
                {"id": "d", "text": "Working the longest hours", "points": 0},
            ],
            "correct_answer": "b",
            "max_points": 10,
            "explanation": "A great tech lead empowers their team to succeed rather than doing everything themselves.",
        },
        {
            "assessment_type": AssessmentTypeEnum.LEADERSHIP,
            "category": "Management",
            "question_text": "How should technical debt be managed?",
            "difficulty": DifficultyEnum.EXPERT,
            "options": [
                {"id": "a", "text": "Ignore it until it becomes critical", "points": 0},
                {"id": "b", "text": "Track, prioritize, and allocate time for it", "points": 10},
                {"id": "c", "text": "Rewrite everything from scratch", "points": 0},
                {"id": "d", "text": "Let developers fix it whenever they want", "points": 0},
            ],
            "correct_answer": "b",
            "max_points": 10,
            "explanation": "Technical debt should be tracked, prioritized, and regularly addressed with allocated time.",
        },
    ]
    
    # Добавляем вопросы в БД
    for q_data in questions:
        question = AssessmentQuestion(**q_data)
        db.add(question)
    
    db.commit()
    print(f"✅ Added {len(questions)} questions to database!")
    db.close()


if __name__ == "__main__":
    print("🌱 Seeding assessment questions...")
    seed_questions()
    print("✨ Done!")