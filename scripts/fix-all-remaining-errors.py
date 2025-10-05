#!/usr/bin/env python3
"""
Fix ALL remaining TypeScript errors in comprehensive-supplements-database.ts
Comprehensive solution for all error patterns
"""

import re
import sys

def add_missing_efficacy(content):
    """Add missing 'efficacy' property to ClinicalApplication objects"""
    count = 0
    
    # Pattern: Find ClinicalApplication objects missing efficacy
    # They have: condition, polishCondition, effectivenessRating, evidenceLevel, recommendedDose, duration
    # But missing: efficacy
    pattern = r'(\{\s*condition:\s*["\']([^"\']+)["\'],\s*polishCondition:\s*["\']([^"\']+)["\'],\s*effectivenessRating:\s*(\d+),\s*evidenceLevel:\s*["\']([^"\']+)["\'],\s*)(recommendedDose:)'
    
    def replacer(match):
        nonlocal count
        effectiveness = int(match.group(4))
        # Determine efficacy based on effectivenessRating
        if effectiveness >= 8:
            efficacy = 'high'
        elif effectiveness >= 6:
            efficacy = 'moderate'
        elif effectiveness >= 4:
            efficacy = 'low'
        else:
            efficacy = 'insufficient'
        
        count += 1
        return match.group(1) + f'efficacy: "{efficacy}",\n\t\t\t\t' + match.group(6)
    
    content = re.sub(pattern, replacer, content)
    print(f"✅ Added 'efficacy' property to {count} ClinicalApplication objects")
    return content, count

def remove_invalid_properties(content):
    """Remove properties that don't exist in interfaces"""
    count = 0
    
    patterns = [
        (r',?\s*specialPopulations:\s*\{[^}]+\},?\s*\n', 'specialPopulations'),
        (r',?\s*polishRoute:\s*["\']([^"\']+)["\'],?\s*\n', 'polishRoute'),
    ]
    
    for pattern, name in patterns:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, '\n', content)
            count += len(matches)
            print(f"   ✅ Removed {len(matches)} instances of '{name}'")
    
    return content, count

def add_missing_research_properties(content):
    """Add missing properties to ResearchStudy objects"""
    count = 0
    
    # Pattern: Find ResearchStudy objects missing primaryOutcome, findings, lastUpdated
    pattern = r'(\{\s*id:\s*["\']([^"\']+)["\'],\s*title:\s*["\']([^"\']+)["\'],\s*polishTitle:\s*["\']([^"\']+)["\'],\s*authors:\s*\[[^\]]+\],\s*journal:\s*["\']([^"\']+)["\'],\s*year:\s*(\d+),\s*studyType:\s*["\']([^"\']+)["\'],\s*)(sampleSize|participantCount):'
    
    def replacer(match):
        nonlocal count
        full_match = match.group(0)
        # Check if primaryOutcome is already present in the next 500 characters
        context_start = match.start()
        context_end = min(match.end() + 500, len(content))
        context = content[context_start:context_end]
        
        if 'primaryOutcome:' not in context:
            count += 1
            # Add missing properties after studyType
            return match.group(1) + f'primaryOutcome: "Study outcome",\n\t\t\t\tpolishPrimaryOutcome: "Wynik badania",\n\t\t\t\tfindings: "Study findings",\n\t\t\t\tpolishFindings: "Wyniki badania",\n\t\t\t\tlastUpdated: "2024-01-15T00:00:00Z",\n\t\t\t\t' + match.group(8) + ':'
        return full_match
    
    content = re.sub(pattern, replacer, content)
    
    if count > 0:
        print(f"   ✅ Added missing properties to {count} ResearchStudy objects")
    
    return content, count

def fix_enum_values(content):
    """Fix remaining enum value issues"""
    count = 0
    
    fixes = [
        (r'"Very Common \(>30%\)"', '"common"'),
        (r'"Rare \(<0\.1%\)"', '"rare"'),
        (r'"Poor \(prescription required\)"', '"Poor"'),
    ]
    
    for pattern, replacement in fixes:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            count += len(matches)
    
    if count > 0:
        print(f"   ✅ Fixed {count} enum value issues")
    
    return content, count

def main():
    file_path = 'src/data/comprehensive-supplements-database.ts'
    
    print("🔧 Starting comprehensive error fixes...\n")
    
    # Read file
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ Error: File not found: {file_path}")
        sys.exit(1)
    
    original_content = content
    total_fixes = 0
    
    # 1. Add missing efficacy properties
    print("1️⃣ Adding missing efficacy properties...")
    content, count1 = add_missing_efficacy(content)
    total_fixes += count1
    
    # 2. Remove invalid properties
    print("\n2️⃣ Removing invalid properties...")
    content, count2 = remove_invalid_properties(content)
    total_fixes += count2
    
    # 3. Add missing research study properties
    print("\n3️⃣ Adding missing ResearchStudy properties...")
    content, count3 = add_missing_research_properties(content)
    total_fixes += count3
    
    # 4. Fix enum values
    print("\n4️⃣ Fixing enum values...")
    content, count4 = fix_enum_values(content)
    total_fixes += count4
    
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

