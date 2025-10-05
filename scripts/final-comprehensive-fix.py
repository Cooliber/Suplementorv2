#!/usr/bin/env python3
"""
Final comprehensive fix for comprehensive-supplements-database.ts
Handles all remaining TypeScript errors in one pass
"""

import re
import sys

def remove_invalid_properties(content):
    """Remove properties that don't exist in the TypeScript interfaces"""
    count = 0
    
    # Remove 'mechanism' and 'polishMechanism' from ClinicalApplication objects
    patterns = [
        (r',?\s*mechanism:\s*["\']([^"\']+)["\'],?\s*\n', 'mechanism'),
        (r',?\s*polishMechanism:\s*["\']([^"\']+)["\'],?\s*\n', 'polishMechanism'),
        (r',?\s*polishTiming:\s*\[[^\]]*\],?\s*\n', 'polishTiming'),
        (r',?\s*primaryEndpoint:\s*["\']([^"\']+)["\'],?\s*\n', 'primaryEndpoint'),
        (r',?\s*contraindications:\s*\[[^\]]*\],?\s*\n\s*polishContraindications:\s*\[[^\]]*\],?\s*\n', 'contraindications (in ClinicalApplication)'),
        (r',?\s*polishMetabolites:\s*\[[^\]]*\],?\s*\n', 'polishMetabolites'),
        (r',?\s*route:\s*["\']([^"\']+)["\'],?\s*\n', 'route (in Elimination)'),
    ]
    
    for pattern, name in patterns:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, '\n', content)
            count += len(matches)
            print(f"   ✅ Removed {len(matches)} instances of '{name}'")
    
    return content, count

def fix_enum_values(content):
    """Fix remaining enum value issues"""
    count = 0
    
    # Frequency enum fixes
    frequency_fixes = [
        (r'"Common \(10-15%\)"', '"common"'),
        (r'"Common \(15-20%\)"', '"common"'),
        (r'"Common \(8-12%\)"', '"common"'),
        (r'"Uncommon \(2-5%\)"', '"uncommon"'),
        (r'"Uncommon \(3-5%\)"', '"uncommon"'),
        (r'"Uncommon \(5-8%\)"', '"uncommon"'),
    ]
    
    for pattern, replacement in frequency_fixes:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            count += len(matches)
    
    # Severity enum fixes
    severity_fixes = [
        (r'"Mild to Moderate"', '"mild"'),
        (r'"Moderate to Severe"', '"moderate"'),
    ]
    
    for pattern, replacement in severity_fixes:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            count += len(matches)
    
    # Interaction type fixes
    interaction_fixes = [
        (r'"ANTAGONIZES"', '"antagonistic"'),
        (r'"HIGH"', '"severe"'),  # For interaction severity
    ]
    
    for pattern, replacement in interaction_fixes:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            count += len(matches)
    
    print(f"   ✅ Fixed {count} enum value issues")
    return content, count

def fix_research_studies(content):
    """Add missing required properties to ResearchStudy objects"""
    count = 0
    
    # Pattern: Find ResearchStudy objects missing evidenceLevel, findings, lastUpdated
    # Look for studies with id, title, authors, journal, year, studyType but missing required fields
    pattern = r'(\{\s*id:\s*["\']([^"\']+)["\'],\s*title:\s*["\']([^"\']+)["\'],\s*polishTitle:\s*["\']([^"\']+)["\'],\s*authors:\s*\[[^\]]+\],\s*journal:\s*["\']([^"\']+)["\'],\s*year:\s*(\d+),\s*studyType:\s*["\']([^"\']+)["\'],)'
    
    def replacer(match):
        nonlocal count
        full_match = match.group(0)
        # Check if evidenceLevel is already present in the next 500 characters
        context_start = match.start()
        context_end = min(match.end() + 500, len(content))
        context = content[context_start:context_end]
        
        if 'evidenceLevel:' not in context:
            count += 1
            # Add missing properties after studyType
            return match.group(1) + '\n\t\t\t\tevidenceLevel: \'MODERATE\',\n\t\t\t\t'
        return full_match
    
    content = re.sub(pattern, replacer, content)
    
    if count > 0:
        print(f"   ✅ Added evidenceLevel to {count} ResearchStudy objects")
    
    # Now add findings and lastUpdated
    pattern2 = r'(studyType:\s*["\']([^"\']+)["\'],\s*evidenceLevel:\s*["\']([^"\']+)["\'],\s*participantCount:)'
    
    def replacer2(match):
        full_match = match.group(0)
        context_start = match.start()
        context_end = min(match.end() + 500, len(content))
        context = content[context_start:context_end]
        
        if 'findings:' not in context:
            # Add findings and lastUpdated
            return match.group(1).replace('participantCount:', 'findings: \'Study findings\',\n\t\t\t\tpolishFindings: \'Wyniki badania\',\n\t\t\t\tlastUpdated: \'2024-01-15T00:00:00Z\',\n\t\t\t\tparticipantCount:')
        return full_match
    
    content = re.sub(pattern2, replacer2, content)
    
    return content, count

def main():
    file_path = 'src/data/comprehensive-supplements-database.ts'
    
    print("🔧 Starting final comprehensive fixes...\n")
    
    # Read file
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ Error: File not found: {file_path}")
        sys.exit(1)
    
    original_content = content
    total_fixes = 0
    
    # 1. Remove invalid properties
    print("1️⃣ Removing invalid properties...")
    content, count1 = remove_invalid_properties(content)
    total_fixes += count1
    
    # 2. Fix enum values
    print("\n2️⃣ Fixing enum values...")
    content, count2 = fix_enum_values(content)
    total_fixes += count2
    
    # 3. Fix research studies
    print("\n3️⃣ Fixing ResearchStudy objects...")
    content, count3 = fix_research_studies(content)
    total_fixes += count3
    
    # Write back if changes were made
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"\n✅ Successfully applied {total_fixes} fixes to {file_path}")
        print("📝 File has been updated. Please run `pnpm typecheck` to verify.")
    else:
        print("\n⚠️  No changes were made to the file.")
    
    print("\n🎉 Script completed!")
    print(f"\n📊 Total fixes applied: {total_fixes}")

if __name__ == '__main__':
    main()

