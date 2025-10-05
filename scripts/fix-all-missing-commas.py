#!/usr/bin/env python3
"""
Fix ALL missing commas by analyzing the file structure
"""

import re

def fix_all_missing_commas(content):
    """Fix missing commas before property names"""
    count = 0
    
    # Pattern: Find lines that should have commas
    # Look for: value on one line, then property name on next line (without comma)
    lines = content.split('\n')
    
    for i in range(len(lines) - 1):
        current_line = lines[i].rstrip()
        next_line = lines[i + 1].strip()
        
        # Skip if current line already ends with comma, opening brace, or is empty
        if not current_line or current_line.endswith(',') or current_line.endswith('{') or current_line.endswith('['):
            continue
        
        # Skip if next line is closing brace/bracket or empty
        if not next_line or next_line.startswith('}') or next_line.startswith(']') or next_line.startswith('//'):
            continue
        
        # Check if next line starts with a property name (word followed by colon)
        if re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*\s*:', next_line):
            # Check if current line ends with a value (string, number, boolean, closing bracket/brace)
            if re.search(r'["\'\d\]\}]$', current_line):
                lines[i] = current_line + ','
                count += 1
    
    print(f"✅ Added {count} missing commas")
    return '\n'.join(lines), count

def main():
    file_path = 'src/data/comprehensive-supplements-database.ts'
    
    print("🔧 Fixing ALL missing commas...\n")
    
    # Read file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix all missing commas
    content, count = fix_all_missing_commas(content)
    
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

