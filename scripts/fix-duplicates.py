#!/usr/bin/env python3
"""
Fix duplicate properties in supplement files
Removes duplicate property definitions while preserving the correct structure
"""

import re
import os
from pathlib import Path

def fix_duplicate_properties_in_object(content: str) -> str:
    """Remove duplicate properties within objects"""
    lines = content.split('\n')
    result = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        result.append(line)
        
        # Check if this line starts an object
        if re.match(r'^\s*\{', line.strip()) or re.match(r'^\s*\w+:\s*\{', line):
            # Track properties in this object
            seen_props = set()
            object_depth = line.count('{') - line.count('}')
            i += 1
            
            while i < len(lines) and object_depth > 0:
                current_line = lines[i]
                object_depth += current_line.count('{') - current_line.count('}')
                
                # Check for property definition
                prop_match = re.match(r'^\s*(\w+):\s*', current_line)
                if prop_match:
                    prop_name = prop_match.group(1)
                    
                    # If we've seen this property, skip it and its value
                    if prop_name in seen_props:
                        # Skip this line
                        # Also skip continuation lines (values that span multiple lines)
                        i += 1
                        while i < len(lines):
                            next_line = lines[i]
                            # Stop if we hit another property or closing brace
                            if re.match(r'^\s*(\w+):', next_line) or re.match(r'^\s*\}', next_line):
                                break
                            i += 1
                        continue
                    else:
                        seen_props.add(prop_name)
                
                result.append(current_line)
                i += 1
            
            continue
        
        i += 1
    
    return '\n'.join(result)

def fix_supplement_file(file_path: Path) -> bool:
    """Fix a single supplement file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix duplicate properties
        content = fix_duplicate_properties_in_object(content)
        
        # Remove maximumSafeDose (not in type definition)
        content = re.sub(r',?\s*maximumSafeDose:\s*\{[^}]+\},?', '', content)
        
        # Clean up extra commas
        content = re.sub(r',\s*,', ',', content)
        content = re.sub(r',\s*\}', '}', content)
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return False

def main():
    print("🔧 Fixing duplicate properties in supplement files...")
    
    supplements_dir = Path("src/data/supplements")
    if not supplements_dir.exists():
        print(f"❌ Directory not found: {supplements_dir}")
        return
    
    fixed_count = 0
    for file_path in supplements_dir.glob("*.ts"):
        if fix_supplement_file(file_path):
            fixed_count += 1
            print(f"  ✅ Fixed {file_path.name}")
    
    print(f"\n✅ Fixed {fixed_count} files")
    print("📝 Run 'bun run typecheck' to verify")

if __name__ == "__main__":
    main()

