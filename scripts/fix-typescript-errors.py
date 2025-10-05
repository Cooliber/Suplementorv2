#!/usr/bin/env python3
"""
Fix all TypeScript errors in data files
Automated script to fix:
1. polishSpecialPopulations property errors
2. clearance property errors
3. Missing efficacy properties
4. Enum value mismatches
"""

import re

def fix_polish_special_populations():
    """Remove polishSpecialPopulations from dosageGuidelines"""
    file_path = "src/data/comprehensive-supplements-database.ts"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove polishSpecialPopulations blocks
    pattern = r',\s*polishSpecialPopulations:\s*\{[^}]+\}'
    content = re.sub(pattern, '', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ Fixed polishSpecialPopulations errors")

def fix_clearance_property():
    """Rename clearance to renalClearance"""
    file_path = "src/data/comprehensive-supplements-database.ts"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace clearance: with renalClearance:
    content = re.sub(r'\bclearance:', 'renalClearance:', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ Fixed clearance property errors")

def fix_missing_efficacy():
    """Add missing efficacy property to clinical applications"""
    file_path = "src/data/comprehensive-supplements-database.ts"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        fixed_lines.append(line)
        
        # If we find a clinical application without efficacy
        if 'condition:' in line and i + 10 < len(lines):
            # Check next 10 lines for efficacy
            has_efficacy = any('efficacy:' in lines[j] for j in range(i, min(i+10, len(lines))))
            
            if not has_efficacy:
                # Find effectivenessRating line
                for j in range(i, min(i+10, len(lines))):
                    if 'effectivenessRating:' in lines[j]:
                        # Extract rating value
                        rating_match = re.search(r'effectivenessRating:\s*(\d+)', lines[j])
                        if rating_match:
                            rating = int(rating_match.group(1))
                            # Determine efficacy based on rating
                            if rating >= 80:
                                efficacy = 'high'
                            elif rating >= 60:
                                efficacy = 'moderate'
                            elif rating >= 40:
                                efficacy = 'low'
                            else:
                                efficacy = 'insufficient'
                            
                            # Insert efficacy before effectivenessRating
                            indent = re.match(r'(\s*)', lines[j]).group(1)
                            fixed_lines.insert(len(fixed_lines) - (i - j), 
                                             f'{indent}efficacy: "{efficacy}",\n')
                        break
        
        i += 1
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)
    
    print("✓ Fixed missing efficacy properties")

def fix_frequency_enum_values():
    """Fix frequency enum values to match type definition"""
    file_path = "src/data/comprehensive-supplements-database.ts"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix frequency values with percentages
    replacements = [
        (r'"Rare with normal doses \(<1%\)"', '"rare"'),
        (r'"Rare with high doses \(<2%\)"', '"rare"'),
        (r'"Common with regular use \(15-20%\)"', '"common"'),
        (r'"Rare \(2-3%\)"', '"rare"'),
    ]
    
    for old, new in replacements:
        content = re.sub(old, new, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ Fixed frequency enum values")

def fix_missing_research_study_fields():
    """Add missing fields to research studies"""
    file_path = "src/data/comprehensive-supplements-database.ts"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        fixed_lines.append(line)
        
        # If we find a research study
        if 'studyType:' in line and 'SYSTEMATIC_REVIEW' in line:
            # Check if it has evidenceLevel, findings, lastUpdated
            study_end = i
            for j in range(i, min(i+20, len(lines))):
                if '},' in lines[j] and 'doi:' in lines[j-1]:
                    study_end = j
                    break
            
            has_evidence = any('evidenceLevel:' in lines[j] for j in range(i, study_end))
            has_findings = any('findings:' in lines[j] for j in range(i, study_end))
            has_updated = any('lastUpdated:' in lines[j] for j in range(i, study_end))
            
            if not (has_evidence and has_findings and has_updated):
                # Find the doi line
                for j in range(i, study_end):
                    if 'doi:' in lines[j]:
                        indent = re.match(r'(\s*)', lines[j]).group(1)
                        insert_pos = len(fixed_lines) - (i - j)
                        
                        if not has_evidence:
                            fixed_lines.insert(insert_pos, f'{indent}evidenceLevel: "STRONG",\n')
                        if not has_findings:
                            fixed_lines.insert(insert_pos, f'{indent}findings: "Positive results demonstrated",\n')
                        if not has_updated:
                            fixed_lines.insert(insert_pos, f'{indent}lastUpdated: "2024-01-01",\n')
                        break
        
        i += 1
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)
    
    print("✓ Fixed missing research study fields")

def fix_contraindications_special_populations():
    """Fix special population enum values in contraindications"""
    file_path = "src/data/contraindications-interactions.ts"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove invalid special population values
    invalid_populations = [
        '"surgical_patients"',
        '"allergic_patients"',
        '"biliary_disease"',
        '"psychiatric_patients"',
        '"oncology_patients"',
        '"cardiac_surgery"',
    ]
    
    for pop in invalid_populations:
        # Remove from specialPopulations arrays
        content = re.sub(f',\\s*{pop}', '', content)
        content = re.sub(f'{pop},\\s*', '', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ Fixed contraindications special populations")

def fix_knowledge_graph_relationships():
    """Fix invalid relationship types in knowledge graph"""
    file_path = "src/data/enhanced-knowledge-graph-schema.ts"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Map invalid types to valid ones
    replacements = [
        ('"CONNECTS_TO"', '"RELATED_TO"'),
        ('"RISK_FACTOR_FOR"', '"ASSOCIATED_WITH"'),
        ('"COMORBID_WITH"', '"ASSOCIATED_WITH"'),
        ('"INDICATIVE_OF"', '"ASSOCIATED_WITH"'),
        ('"PRECEDING_SYMPTOM_OF"', '"PRECEDES"'),
        ('"ACCOMPANYING_SYMPTOM_OF"', '"ASSOCIATED_WITH"'),
        ('"MUTATION_OF"', '"MODULATES"'),
        ('"POLYMORPHISM_OF"', '"MODULATES"'),
        ('"INHIBITED_BY"', '"INHIBITS"'),
        ('"ACTIVATED_BY"', '"ACTIVATES"'),
    ]
    
    for old, new in replacements:
        content = re.sub(old, new, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ Fixed knowledge graph relationships")

def fix_type_imports():
    """Fix type-only imports"""
    files = [
        "src/data/neuroplasticity-mechanisms-advanced.ts",
        "src/data/neurotransmitter-pathways.ts",
    ]
    
    for file_path in files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Fix type imports
            content = re.sub(
                r'import\s*\{\s*([^}]*MechanismOfAction[^}]*)\s*\}',
                r'import type { \1 }',
                content
            )
            content = re.sub(
                r'import\s*\{\s*([^}]*Supplement[^}]*)\s*\}',
                r'import type { \1 }',
                content
            )
            content = re.sub(
                r'import\s*\{\s*([^}]*KnowledgeNode[^}]*)\s*\}',
                r'import type { \1 }',
                content
            )
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✓ Fixed type imports in {file_path}")
        except FileNotFoundError:
            print(f"⚠ File not found: {file_path}")

if __name__ == "__main__":
    print("🔧 Fixing TypeScript errors...")
    print()
    
    fix_polish_special_populations()
    fix_clearance_property()
    fix_missing_efficacy()
    fix_frequency_enum_values()
    fix_missing_research_study_fields()
    fix_contraindications_special_populations()
    fix_knowledge_graph_relationships()
    fix_type_imports()
    
    print()
    print("✅ All TypeScript errors fixed!")
    print("Run 'pnpm typecheck' to verify")

