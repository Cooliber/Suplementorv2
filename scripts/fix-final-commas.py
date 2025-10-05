#!/usr/bin/env python3
"""
Fix the final 11 missing comma syntax errors
"""

import re

def fix_specific_lines(content):
    """Fix missing commas at specific line numbers"""
    lines = content.split('\n')
    
    # Line numbers that need commas (0-indexed, so subtract 1)
    lines_to_fix = [
        218,  # Line 219
        568,  # Line 569
        850,  # Line 851
        1161, # Line 1162
        1399, # Line 1400
        1648, # Line 1649
        1882, # Line 1883
        2120, # Line 2121
        2354, # Line 2355
        2600, # Line 2601
        2838, # Line 2839
    ]
    
    count = 0
    for line_num in lines_to_fix:
        if line_num < len(lines):
            line = lines[line_num]
            # Check if line doesn't already end with comma
            stripped = line.rstrip()
            if stripped and not stripped.endswith(',') and not stripped.endswith('{'):
                lines[line_num] = stripped + ','
                count += 1
    
    print(f"✅ Added {count} missing commas at specific lines")
    return '\n'.join(lines), count

def main():
    file_path = 'src/data/comprehensive-supplements-database.ts'
    
    print("🔧 Fixing final missing commas...\n")
    
    # Read file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix specific lines
    content, count = fix_specific_lines(content)
    
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

