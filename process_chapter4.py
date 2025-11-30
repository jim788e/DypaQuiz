#!/usr/bin/env python3
import json
import re
import csv

# Read chapter4.txt
with open('chapter4.txt', 'r', encoding='utf-8') as f:
    lines = [line.rstrip() for line in f.readlines()]

# Read explanations CSV
explanations = {}
with open('Chapter4explanation.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        num = int(row['number'])
        explanations[num] = {
            'answer': row['answer'],
            'explanation': row['explaination']
        }

# Get max ID from Chapter3 to continue numbering
try:
    with open('Chapter3.json', 'r', encoding='utf-8') as f:
        chapter3 = json.load(f)
        max_id = max([q['id'] for q in chapter3['questions']]) if chapter3['questions'] else 0
except:
    max_id = 0

questions = []
i = 0
current_id = max_id + 1
sequential_question_num = 0  # Sequential counter for CSV matching

while i < len(lines):
    line = lines[i].strip()
    
    # Skip empty lines and headers
    if not line or line.startswith('ΕΝΟΤΗΤΑ') or line.startswith('Άσκηση') or line.startswith('ΕΡΩΤΗΣΕΙΣ'):
        i += 1
        continue
    
    # Match question number pattern: "1. Question text"
    match = re.match(r'^(\d+)\.\s+(.+)$', line)
    if match:
        sequential_question_num += 1  # Increment sequential counter
        question_num = int(match.group(1))  # Local question num in exercise
        question_text = match.group(2).strip()
        
        # Check if it's True/False (ends with Σωστό or Λάθος)
        if question_text.endswith('Σωστό') or question_text.endswith('Λάθος'):
            answer_text = 'Σωστό' if question_text.endswith('Σωστό') else 'Λάθος'
            question_text = question_text[:-len(answer_text)].strip()
            
            exp = explanations.get(sequential_question_num, {})
            answer_from_csv = exp.get('answer', answer_text)
            correct_index = 0 if 'Σωστό' in answer_from_csv else 1
            
            questions.append({
                'id': current_id,
                'question': question_text,
                'options': ['Σωστό', 'Λάθος'],
                'correctAnswer': correct_index,
                'explanation': exp.get('explanation', '')
            })
            current_id += 1
            i += 1
        else:
            # Multiple choice - collect options from following lines
            options = []
            i += 1
            
            # Collect options until we hit next question or empty section
            while i < len(lines):
                next_line = lines[i].strip()
                
                # Check if it's the next question
                if re.match(r'^\d+\.\s+', next_line):
                    break
                
                # Check if it's an option (A., B., C., D., E. or α), β), etc.)
                option_match = re.match(r'^([ΑαAΒβBΓγCΔδDΕεE])\.?\)?\s*(.+)$', next_line)
                if option_match:
                    options.append(option_match.group(2).strip())
                elif next_line and not next_line.startswith('Άσκηση') and not next_line.startswith('ΕΡΩΤΗΣΕΙΣ'):
                    # Might be continuation of question text
                    question_text += ' ' + next_line
                
                i += 1
            
            # Process multiple choice question
            if options:
                exp = explanations.get(sequential_question_num, {})
                answer_text = exp.get('answer', '').strip()
                
                # Map answer letter to index - check first character/pattern
                correct_index = 0
                # Extract first letter/character from answer
                first_char = answer_text[0] if answer_text else ''
                
                # Check for Greek lowercase with parenthesis first (α), β), etc.)
                if first_char == 'α' or answer_text.startswith('α)'):
                    correct_index = 0
                elif first_char == 'β' or answer_text.startswith('β)'):
                    correct_index = 1
                elif first_char == 'γ' or answer_text.startswith('γ)'):
                    correct_index = 2
                elif first_char == 'δ' or answer_text.startswith('δ)'):
                    correct_index = 3
                elif first_char == 'ε' or answer_text.startswith('ε)'):
                    correct_index = 4
                # Check for uppercase English/Latin (A, B, C, D, E)
                elif first_char == 'A' or answer_text.startswith('A.'):
                    correct_index = 0
                elif first_char == 'B' or answer_text.startswith('B.'):
                    correct_index = 1
                elif first_char == 'C' or answer_text.startswith('C.'):
                    correct_index = 2
                elif first_char == 'D' or answer_text.startswith('D.'):
                    correct_index = 3
                elif first_char == 'E' or answer_text.startswith('E.'):
                    correct_index = 4
                # Check for Greek uppercase (Α, Β, Γ, Δ, Ε)
                elif first_char == 'Α' or answer_text.startswith('Α.'):
                    correct_index = 0
                elif first_char == 'Β' or answer_text.startswith('Β.'):
                    correct_index = 1
                elif first_char == 'Γ' or answer_text.startswith('Γ.'):
                    correct_index = 2
                elif first_char == 'Δ' or answer_text.startswith('Δ.'):
                    correct_index = 3
                elif first_char == 'Ε' or answer_text.startswith('Ε.'):
                    correct_index = 4
                # Fallback: check if answer contains the option text
                else:
                    for idx, opt in enumerate(options):
                        if opt in answer_text or answer_text in opt:
                            correct_index = idx
                            break
                
                questions.append({
                    'id': current_id,
                    'question': question_text,
                    'options': options,
                    'correctAnswer': correct_index,
                    'explanation': exp.get('explanation', '')
                })
                current_id += 1
            else:
                # No options found, treat as True/False
                exp = explanations.get(question_num, {})
                answer_text = exp.get('answer', 'Σωστό')
                correct_index = 0 if 'Σωστό' in answer_text else 1
                
                questions.append({
                    'id': current_id,
                    'question': question_text,
                    'options': ['Σωστό', 'Λάθος'],
                    'correctAnswer': correct_index,
                    'explanation': exp.get('explanation', '')
                })
                current_id += 1
    else:
        i += 1

# Create Chapter4.json
chapter4_data = {
    "chapterTitle": "4 - Διαχείριση Εφοδιαστικής Αλυσίδας",
    "questions": questions
}

with open('Chapter4.json', 'w', encoding='utf-8') as f:
    json.dump(chapter4_data, f, ensure_ascii=False, indent=2)

print(f"Created Chapter4.json with {len(questions)} questions")
print(f"Question IDs range from {questions[0]['id']} to {questions[-1]['id']}")
print(f"\nFirst few questions:")
for q in questions[:5]:
    print(f"  ID {q['id']}: {q['question'][:50]}... ({len(q['options'])} options)")
