#!/usr/bin/env python3
"""
Fix missing required properties in comprehensive-supplements-database.ts
Adds 'reversible' to SideEffect objects and 'description' to Interaction objects
"""

import re
import sys

def fix_side_effects(content):
    """Add missing 'reversible: true' to SideEffect objects"""
    count = 0
    
    # Pattern: Find SideEffect objects without reversible property
    # Look for: effect, polishEffect, frequency, severity, management, polishManagement
    # But NOT reversible
    pattern = r'(\{\s*effect:\s*["\']([^"\']+)["\'],\s*polishEffect:\s*["\']([^"\']+)["\'],\s*frequency:\s*["\']([^"\']+)["\'],\s*severity:\s*["\']([^"\']+)["\'],\s*)(management:)'
    
    def replacer(match):
        nonlocal count
        full_match = match.group(0)
        # Check if 'reversible' is already present
        if 'reversible' not in full_match:
            count += 1
            # Insert reversible: true before management
            return match.group(1) + 'reversible: true,\n\t\t\t\t\t' + match.group(6)
        return full_match
    
    content = re.sub(pattern, replacer, content)
    print(f"✅ Added 'reversible' property to {count} SideEffect objects")
    return content, count

def fix_interactions(content):
    """Add missing 'description' to Interaction objects"""
    count = 0
    
    # Pattern: Find Interaction objects without description property
    # Look for: substance, polishSubstance, type, severity, mechanism
    # But NOT description
    pattern = r'(\{\s*substance:\s*["\']([^"\']+)["\'],\s*polishSubstance:\s*["\']([^"\']+)["\'],\s*type:\s*["\']([^"\']+)["\'],\s*)(severity:)'
    
    def replacer(match):
        nonlocal count
        full_match = match.group(0)
        # Check if 'description' is already present in the next 200 characters
        context_start = match.start()
        context_end = min(match.end() + 200, len(content))
        context = content[context_start:context_end]
        
        if 'description:' not in context:
            count += 1
            # Get the mechanism value to use as description
            mechanism_match = re.search(r'mechanism:\s*["\']([^"\']+)["\']', context)
            if mechanism_match:
                mechanism_text = mechanism_match.group(1)
                # Insert description after type
                return match.group(1) + f'description: \'{mechanism_text}\',\n\t\t\t\t\t' + match.group(5)
        return full_match
    
    content = re.sub(pattern, replacer, content)
    print(f"✅ Added 'description' property to {count} Interaction objects")
    return content, count

def main():
    file_path = 'src/data/comprehensive-supplements-database.ts'
    
    print("🔧 Starting property fixes...\n")
    
    # Read file
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ Error: File not found: {file_path}")
        sys.exit(1)
    
    original_content = content
    total_fixes = 0
    
    # Fix SideEffect objects
    print("1️⃣ Fixing SideEffect objects...")
    content, count1 = fix_side_effects(content)
    total_fixes += count1
    
    # Fix Interaction objects
    print("\n2️⃣ Fixing Interaction objects...")
    content, count2 = fix_interactions(content)
    total_fixes += count2
    
    # Write back if changes were made
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"\n✅ Successfully applied {total_fixes} fixes to {file_path}")
        print("📝 File has been updated. Please run `pnpm typecheck` to verify.")
    else:
        print("\n⚠️  No changes were made to the file.")
    
    print("\n🎉 Script completed!")

if __name__ == '__main__':
    main()

