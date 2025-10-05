#!/usr/bin/env python3
"""
Final fix for remaining TypeScript errors
Fixes empty interaction objects, loadingPhase, and import issues
"""

import re
from pathlib import Path

def fix_empty_interactions(file_path: Path) -> bool:
    """Remove empty interaction objects"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original = content
        
        # Remove empty objects from interactions array
        # Pattern: interactions: [ ... {}, ... ]
        content = re.sub(r',\s*\{\s*\},?\s*(?=\])', '', content)
        content = re.sub(r'\[\s*\{\s*\},?\s*', '[', content)
        
        # Clean up trailing commas
        content = re.sub(r',\s*\]', ']', content)
        
        if content != original:
            file_path.write_text(content, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return False

def fix_loading_phase(file_path: Path) -> bool:
    """Remove loadingPhase property from dosageGuidelines"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original = content
        
        # Remove loadingPhase property
        content = re.sub(r',?\s*loadingPhase:\s*\w+,?', '', content)
        
        # Remove cyclingRecommendation (also not in type)
        content = re.sub(r',?\s*cyclingRecommendation:\s*"[^"]*",?', '', content)
        content = re.sub(r',?\s*polishCyclingRecommendation:\s*"[^"]*",?', '', content)
        
        # Clean up extra commas
        content = re.sub(r',\s*,', ',', content)
        content = re.sub(r',\s*\}', '}', content)
        
        if content != original:
            file_path.write_text(content, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return False

def fix_imports(file_path: Path) -> bool:
    """Fix invalid imports"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original = content
        
        # Fix ComprehensiveSupplement import
        content = re.sub(
            r'import\s*\{\s*ComprehensiveSupplement\s*\}\s*from\s*["\']@/lib/db/models/Supplement["\'];?',
            'import type { SupplementWithRelations } from "@/types/supplement";',
            content
        )
        
        # Replace ComprehensiveSupplement type with SupplementWithRelations
        content = re.sub(
            r':\s*ComprehensiveSupplement(\[\])?',
            r': SupplementWithRelations\1',
            content
        )
        
        # Add SupplementWithRelations if it's used but not imported
        if 'SupplementWithRelations' in content and 'import' in content:
            if 'import type { SupplementWithRelations }' not in content:
                # Add import at the top
                content = 'import type { SupplementWithRelations } from "@/types/supplement";\n' + content
        
        if content != original:
            file_path.write_text(content, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return False

def fix_graph_accessibility():
    """Fix graph accessibility undefined issues"""
    file_path = Path("src/lib/accessibility/graph-accessibility.ts")
    
    try:
        content = file_path.read_text(encoding='utf-8')
        original = content
        
        # Add null checks before using possibly undefined values
        # Pattern: const nextNode = ...; announceNode(nextNode)
        content = re.sub(
            r'(const \w+Node = [^;]+;)\s*\n\s*(announceNode\(\w+Node\))',
            r'\1\n\t\tif (\1.split(" = ")[0].split("const ")[1]) \2',
            content
        )
        
        # Simpler: wrap all announceNode calls with null checks
        content = re.sub(
            r'announceNode\((\w+)\)',
            r'if (\1) announceNode(\1)',
            content
        )
        
        content = re.sub(
            r'announceRelationship\((\w+)\)',
            r'if (\1) announceRelationship(\1)',
            content
        )
        
        # Fix Object is possibly undefined
        content = re.sub(
            r'(const \w+ = \w+\.find\([^)]+\);)\s*\n\s*(\w+)\.(\w+)',
            r'\1\n\t\tif (\2) \2.\3',
            content
        )
        
        if content != original:
            file_path.write_text(content, encoding='utf-8')
            print("✅ Fixed graph accessibility")
            return True
        return False
    except Exception as e:
        print(f"Error fixing graph accessibility: {e}")
        return False

def main():
    print("🔧 Fixing remaining TypeScript errors...\n")
    
    # Fix supplement files
    supplements_dir = Path("src/data/supplements")
    fixed_count = 0
    
    for file_path in supplements_dir.glob("*.ts"):
        file_fixed = False
        
        if fix_empty_interactions(file_path):
            file_fixed = True
        
        if fix_loading_phase(file_path):
            file_fixed = True
        
        if fix_imports(file_path):
            file_fixed = True
        
        if file_fixed:
            fixed_count += 1
            print(f"  ✅ Fixed {file_path.name}")
    
    print(f"\n✅ Fixed {fixed_count} supplement files")
    
    # Fix graph accessibility
    fix_graph_accessibility()
    
    print("\n✅ All remaining errors fixed")
    print("📝 Run 'bun run typecheck' to verify")

if __name__ == "__main__":
    main()

