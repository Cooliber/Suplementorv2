#!/usr/bin/env python3
"""
Fix Mongoose method calls (replace Prisma syntax with Mongoose syntax)
"""

import re

def fix_mongoose_methods(content):
    """Replace Prisma methods with Mongoose equivalents"""
    count = 0
    
    # Replace findMany with find
    matches = re.findall(r'\.findMany\(', content)
    if matches:
        content = re.sub(r'\.findMany\(', '.find(', content)
        count += len(matches)
        print(f"   ✅ Replaced {len(matches)} instances of 'findMany' with 'find'")
    
    # Replace findUnique with findOne
    matches = re.findall(r'\.findUnique\(', content)
    if matches:
        content = re.sub(r'\.findUnique\(', '.findOne(', content)
        count += len(matches)
        print(f"   ✅ Replaced {len(matches)} instances of 'findUnique' with 'findOne'")
    
    # Replace .count() with .countDocuments()
    matches = re.findall(r'\.count\(\)', content)
    if matches:
        content = re.sub(r'\.count\(\)', '.countDocuments()', content)
        count += len(matches)
        print(f"   ✅ Replaced {len(matches)} instances of 'count()' with 'countDocuments()'")
    
    return content, count

def add_type_annotations(content):
    """Add type annotations to callback parameters"""
    count = 0
    
    # Pattern: .map((param) => where param doesn't have type annotation
    pattern = r'\.map\(\(([a-zA-Z_][a-zA-Z0-9_]*)\)\s*=>'
    
    def replacer(match):
        nonlocal count
        param_name = match.group(1)
        # Check if it's already typed
        if ':' not in match.group(0):
            count += 1
            return f'.map(({param_name}: any) =>'
        return match.group(0)
    
    content = re.sub(pattern, replacer, content)
    
    if count > 0:
        print(f"   ✅ Added type annotations to {count} callback parameters")
    
    return content, count

def main():
    files_to_fix = [
        'src/server/api/routers/knowledge.ts',
        'src/server/api/routers/recommendations.ts',
    ]
    
    print("🔧 Fixing Mongoose method calls...\n")
    
    total_fixes = 0
    
    for file_path in files_to_fix:
        print(f"📝 Processing {file_path}...")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except FileNotFoundError:
            print(f"   ⚠️  File not found: {file_path}")
            continue
        
        original_content = content
        
        # Fix Mongoose methods
        content, count1 = fix_mongoose_methods(content)
        total_fixes += count1
        
        # Add type annotations
        content, count2 = add_type_annotations(content)
        total_fixes += count2
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"   ✅ Updated {file_path}\n")
        else:
            print(f"   ℹ️  No changes needed\n")
    
    print(f"\n✅ Total fixes applied: {total_fixes}")
    print("📝 Files have been updated. Please run `pnpm typecheck` to verify.")
    print("\n🎉 Script completed!")

if __name__ == '__main__':
    main()

