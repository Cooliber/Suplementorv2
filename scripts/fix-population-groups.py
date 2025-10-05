#!/usr/bin/env python3
"""Fix populationGroup syntax errors"""

import re

file_path = "src/data/contraindications-interactions.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix all instances of "populationGroup: polishPopulationGroup:"
# Pattern: populationGroup: polishPopulationGroup: "value"
# Replace with: populationGroup: "group_name",\n\t\t\t\tpolishPopulationGroup: "value"

replacements = [
    (r'populationGroup: polishPopulationGroup: "choroba żółciowa"',
     'populationGroup: "biliary_disease",\n\t\t\t\tpolishPopulationGroup: "choroba żółciowa"'),
    (r'populationGroup: polishPopulationGroup: "pacjenci operacyjni"',
     'populationGroup: "surgical_patients",\n\t\t\t\tpolishPopulationGroup: "pacjenci operacyjni"'),
    (r'populationGroup: polishPopulationGroup: "pacjenci psychiatryczni"',
     'populationGroup: "psychiatric_patients",\n\t\t\t\tpolishPopulationGroup: "pacjenci psychiatryczni"'),
    (r'populationGroup: polishPopulationGroup: "pacjenci onkologiczni"',
     'populationGroup: "oncology_patients",\n\t\t\t\tpolishPopulationGroup: "pacjenci onkologiczni"'),
    (r'populationGroup: polishPopulationGroup: "chirurgia serca"',
     'populationGroup: "cardiac_surgery",\n\t\t\t\tpolishPopulationGroup: "chirurgia serca"'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed all populationGroup syntax errors")

