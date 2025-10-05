---
type: "agent_requested"
description: "Example description"
---

# Polish Localization Rules for Suplementor

## Overview
Comprehensive rules for Polish language implementation in the Suplementor educational platform, ensuring medical accuracy, cultural appropriateness, and regulatory compliance.

## Medical Terminology Standards

### Brain Anatomy (Anatomia Mózgu)
- **Frontal Lobe** → `Płat czołowy`
- **Hippocampus** → `Hipokamp`
- **Amygdala** → `Ciało migdałowate`
- **Prefrontal Cortex** → `Kora przedczołowa`
- **Neurotransmitters** → `Neuroprzekaźniki`
- **Synapses** → `Synapsy`
- **Neural Plasticity** → `Neuroplastyczność`
- **Blood-Brain Barrier** → `Bariera krew-mózg`

### Supplement Categories (Kategorie Suplementów)
- **Nootropic** → `Nootropik`
- **Adaptogen** → `Adaptogen`
- **Amino Acid** → `Aminokwas`
- **Fatty Acid** → `Kwas tłuszczowy`
- **Vitamin** → `Witamina`
- **Mineral** → `Minerał`
- **Herb** → `Zioło`

### Clinical Terms (Terminy Kliniczne)
- **Cognitive Enhancement** → `Wzmocnienie funkcji poznawczych`
- **Memory Improvement** → `Poprawa pamięci`
- **Attention Deficit** → `Deficyt uwagi`
- **Stress Reduction** → `Redukcja stresu`
- **Sleep Quality** → `Jakość snu`
- **Bioavailability** → `Biodostępność`
- **Half-life** → `Okres półtrwania`
- **Contraindications** → `Przeciwwskazania`

## Implementation Rules

### Required Polish Fields
All supplement profiles MUST include:
```typescript
interface SupplementProfile {
  name: string;           // English name
  polishName: string;     // REQUIRED: Polish translation
  description?: string;   // English description
  polishDescription: string; // REQUIRED: Polish description
  commonNames: string[];  // English common names
  polishCommonNames: string[]; // REQUIRED: Polish common names
  // ... other fields with Polish equivalents
}
```

### Text Formatting Standards
- **Currency**: Always use Euro format `"od 3,99 €"`
- **Dosage**: Include Polish units `"200mg dziennie"`
- **Timing**: Use Polish time expressions `"rano"`, `"wieczorem"`, `"z posiłkami"`
- **Frequency**: Polish frequency terms `"codziennie"`, `"w razie potrzeby"`

### Character Encoding
- **Encoding**: UTF-8 with full Polish character support
- **Special Characters**: ą, ć, ę, ł, ń, ó, ś, ź, ż
- **Testing**: All components must render Polish characters correctly
- **Fonts**: Use fonts with complete Polish character sets

### Cultural Context Rules
- **Healthcare System**: Reference Polish healthcare (NFZ, lekarz rodzinny)
- **Educational Context**: Align with Polish medical education standards
- **Regulatory Compliance**: Follow EU and Polish supplement regulations
- **Professional Terms**: Use terms familiar to Polish healthcare professionals

## Quality Assurance

### Validation Requirements
1. **Medical Accuracy**: All Polish medical terms reviewed by qualified professionals
2. **Consistency**: Uniform terminology across all components
3. **Completeness**: No missing Polish translations for user-facing content
4. **Cultural Appropriateness**: Content suitable for Polish cultural context

### Testing Standards
- **Character Rendering**: Test all Polish characters across browsers
- **Screen Reader**: Verify Polish text works with screen readers
- **Mobile Devices**: Ensure Polish text displays correctly on mobile
- **Print Compatibility**: Polish characters render in print/PDF exports

### Review Process
1. **Technical Review**: Verify implementation follows rules
2. **Medical Review**: Validate medical terminology accuracy
3. **Cultural Review**: Ensure cultural appropriateness
4. **User Testing**: Test with native Polish speakers

## Compliance Standards

### EU Regulatory Requirements
- **EFSA Guidelines**: Follow European Food Safety Authority standards
- **Polish Ministry of Health**: Comply with national health regulations
- **Data Protection**: GDPR compliance for Polish users
- **Accessibility**: EU accessibility directive compliance

### Medical Professional Standards
- **Terminology**: Use terms from Polish Medical Dictionary 2024
- **Evidence Standards**: Reference Polish and EU medical guidelines
- **Professional Communication**: Language appropriate for healthcare providers
- **Patient Education**: Clear, accessible language for general public

## Implementation Checklist

### Development Phase
- [ ] All new components include Polish translations
- [ ] Medical terminology follows approved dictionary
- [ ] Cultural context appropriate for Polish users
- [ ] Character encoding supports Polish characters

### Testing Phase
- [ ] Polish character rendering verified
- [ ] Medical terminology accuracy confirmed
- [ ] Cultural appropriateness validated
- [ ] Accessibility compliance tested

### Deployment Phase
- [ ] All user-facing text in Polish
- [ ] Medical disclaimers in Polish
- [ ] Error messages localized
- [ ] Help documentation translated

## Error Prevention

### Common Mistakes to Avoid
- Using Google Translate for medical terms
- Inconsistent terminology across components
- Missing Polish characters in fonts
- Inappropriate cultural references
- Non-compliant medical claims

### Quality Gates
- Automated Polish character validation
- Medical terminology consistency checks
- Cultural appropriateness review
- Professional medical review before release
