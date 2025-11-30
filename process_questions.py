#!/usr/bin/env python3
import json
import re

# Read the questions file
with open('Finalquestions1part2.txt', 'r', encoding='utf-8') as f:
    questions_content = f.read()

# Read the answers file  
with open('AnswerWithExplanationfinal1part2.txt', 'r', encoding='utf-8') as f:
    answers_content = f.read()

# Parse questions
questions_lines = questions_content.strip().split('\n')
questions_data = {}

for line in questions_lines:
    if line.strip():
        # Extract question number and text
        parts = line.split('\t', 1)
        if len(parts) == 2:
            question_num = parts[0].strip()
            question_text = parts[1].strip()
            questions_data[question_num] = question_text

# Parse answers
answers_lines = answers_content.strip().split('\n')
answers_data = {}

for line in answers_lines:
    if line.strip():
        # Extract question number, answer, and explanation
        parts = line.split('\t', 1)
        if len(parts) == 2:
            question_num = parts[0].strip()
            answer_text = parts[1].strip()
            
            # Parse the answer and explanation
            if ' – ' in answer_text:
                answer, explanation = answer_text.split(' – ', 1)
                answers_data[question_num] = {
                    'answer': answer.strip(),
                    'explanation': explanation.strip()
                }
            else:
                # Handle cases without explanation separator
                answers_data[question_num] = {
                    'answer': answer_text.strip(),
                    'explanation': ''
                }

# Read existing Chapter1.json
with open('Chapter1.json', 'r', encoding='utf-8') as f:
    chapter_data = json.load(f)

# Get the last question ID
last_id = max([q['id'] for q in chapter_data['questions']])

# Create new questions
new_questions = []
current_id = last_id + 1

for question_num in sorted(questions_data.keys(), key=int):
    question_text = questions_data[question_num]
    answer_data = answers_data.get(question_num, {})
    
    # Determine if it's a True/False question or multiple choice
    if 'Α)' in question_text and 'Β)' in question_text:
        # Multiple choice question
        options = []
        correct_answer_index = None
        
        # Extract options more carefully
        # Split by semicolon first to get the options part
        if ';' in question_text:
            question_part = question_text.split(';', 1)[1]
        else:
            question_part = question_text
        
        # Parse options A, B, C, D
        if 'Α)' in question_part:
            # Extract option A
            option_a = question_part.split('Α)')[1].split('Β)')[0].strip()
            options.append(option_a)
            
            # Extract option B
            if 'Β)' in question_part:
                option_b = question_part.split('Β)')[1].split('Γ)')[0].strip()
                options.append(option_b)
                
                # Extract option C
                if 'Γ)' in question_part:
                    option_c = question_part.split('Γ)')[1].split('Δ)')[0].strip()
                    options.append(option_c)
                    
                    # Extract option D
                    if 'Δ)' in question_part:
                        option_d = question_part.split('Δ)')[1].strip()
                        options.append(option_d)
                else:
                    # Only A, B options
                    pass
            else:
                # Only A option
                pass
        
        # Determine correct answer
        answer_letter = answer_data.get('answer', '').strip()
        if answer_letter == 'Α':
            correct_answer_index = 0
        elif answer_letter == 'Β':
            correct_answer_index = 1
        elif answer_letter == 'Γ':
            correct_answer_index = 2
        elif answer_letter == 'Δ':
            correct_answer_index = 3
        
        new_question = {
            "id": current_id,
            "question": question_text,
            "options": options,
            "correctAnswer": correct_answer_index if correct_answer_index is not None else 0,
            "explanation": answer_data.get('explanation', '')
        }
    else:
        # True/False question
        correct_answer = 0 if answer_data.get('answer', '').strip() == 'Σωστό' else 1
        
        new_question = {
            "id": current_id,
            "question": question_text,
            "options": ["Σωστό", "Λάθος"],
            "correctAnswer": correct_answer,
            "explanation": answer_data.get('explanation', '')
        }
    
    new_questions.append(new_question)
    current_id += 1

# Append new questions to existing ones
chapter_data['questions'].extend(new_questions)

# Write updated JSON
with open('Chapter1.json', 'w', encoding='utf-8') as f:
    json.dump(chapter_data, f, ensure_ascii=False, indent=2)

print(f"Successfully added {len(new_questions)} new questions to Chapter1.json")
print(f"Total questions in chapter: {len(chapter_data['questions'])}")
