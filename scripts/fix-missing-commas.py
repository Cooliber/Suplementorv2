#!/usr/bin/env python3
"""
Fix all missing commas in comprehensive-supplements-database.ts
"""

import re

def fix_missing_commas(content):
    """Add missing commas before specific properties"""
    count = 0
    
    # Properties that need commas before them
    properties_needing_commas = [
        'specialPopulations',
        'clinicalSignificance',
        'results',
        'polishRoute',
    ]
    
    for prop in properties_needing_commas:
        # Pattern: newline + whitespace + property: (without comma before)
        # Look for cases where the previous line doesn't end with a comma
        pattern = rf'([^,\s])\s*\n(\s+){prop}:'
        
        def replacer(match):
            nonlocal count
            count += 1
            # Add comma after the previous line's content
            return match.group(1) + ',\n' + match.group(2) + prop + ':'
        
        content = re.sub(pattern, replacer, content)
    
    print(f"✅ Added {count} missing commas")
    return content, count

def main():
    file_path = 'src/data/comprehensive-supplements-database.ts'
    
    print("🔧 Fixing missing commas...\n")
    
    # Read file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix missing commas
    content, count = fix_missing_commas(content)
    
    # Write back if changes were made
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"\n✅ Successfully fixed {count} missing commas")
        print("📝 File has been updated. Please run `pnpm typecheck` to verify.")
    else:
        print("\n⚠️  No changes were made to the file.")
    
    print("\n🎉 Script completed!")

if __name__ == '__main__':
    main()

