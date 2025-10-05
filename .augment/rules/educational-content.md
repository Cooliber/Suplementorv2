---
type: "agent_requested"
description: "Example description"
---

# Educational Content Standards for Suplementor

## Overview
Comprehensive standards for neuroscience and supplement educational content in the Suplementor Polish platform, ensuring scientific accuracy, pedagogical effectiveness, and cultural appropriateness.

## Scientific Accuracy Standards

### Evidence-Based Medicine Requirements
- **Primary Sources**: PubMed-indexed studies only
- **Evidence Hierarchy**: Systematic reviews > RCTs > Observational studies > Expert opinion
- **Quality Scoring**: 0-10 scale based on study design, sample size, and methodology
- **Citation Format**: Include PubMed ID, DOI, and quality score for all studies
- **Update Frequency**: Quarterly review of evidence levels and new research

### Research Study Integration
```typescript
interface ResearchStudy {
  id: string;
  title: string;
  polishTitle: string;
  authors: string[];
  journal: string;
  year: number;
  studyType: StudyType;
  primaryOutcome: string;
  polishPrimaryOutcome: string;
  findings: string;
  polishFindings: string;
  evidenceLevel: EvidenceLevel;
  pubmedId?: string;
  doi?: string;
  sampleSize?: number;
  duration?: string;
  dosage?: string;
  qualityScore: number; // 0-10 scale
  lastUpdated: string;
}
```

### Medical Disclaimer Requirements
All content must include appropriate Polish medical disclaimers:
- "Informacje zawarte w tej aplikacji mają charakter edukacyjny"
- "Nie zastępują konsultacji z lekarzem lub farmaceutą"
- "Przed rozpoczęciem suplementacji skonsultuj się z lekarzem"
- "W przypadku działań niepożądanych przerwij stosowanie"

## Neuroscience Content Standards

### Brain Anatomy Education
- **3D Visualization**: Interactive models with Polish anatomical labels
- **Regional Functions**: Detailed descriptions of cognitive functions per brain region
- **Supplement Interactions**: Visual representation of supplement effects on brain regions
- **Learning Progression**: Beginner → Intermediate → Advanced content paths

### Polish Anatomical Terminology
```typescript
interface BrainRegionData {
  id: string;
  name: string; // English name
  polishName: string; // Polish anatomical term
  description: string;
  polishDescription: string;
  functions: string[];
  polishFunctions: string[];
  relatedSupplements: string[];
  cognitiveRoles: CognitiveRole[];
  visualizationData: {
    position: Vector3;
    color: string;
    opacity: number;
    meshPath: string;
  };
}

// Required Polish brain region translations
const BRAIN_REGIONS_POLISH = {
  'frontal-lobe': 'Płat czołowy',
  'parietal-lobe': 'Płat ciemieniowy',
  'temporal-lobe': 'Płat skroniowy',
  'occipital-lobe': 'Płat potyliczny',
  'hippocampus': 'Hipokamp',
  'amygdala': 'Ciało migdałowate',
  'cerebellum': 'Móżdżek',
  'brainstem': 'Pień mózgu',
  'thalamus': 'Wzgórze',
  'hypothalamus': 'Podwzgórze'
} as const;
```

## Supplement Education Standards

### Comprehensive Supplement Profiles
Each supplement must include:
1. **Basic Information**: Names, categories, sources
2. **Active Compounds**: Chemical structures, bioavailability, metabolism
3. **Mechanisms of Action**: Detailed biological pathways
4. **Clinical Applications**: Evidence-based uses with efficacy ratings
5. **Dosage Guidelines**: Therapeutic ranges, timing, administration
6. **Safety Profile**: Side effects, contraindications, interactions
7. **Research Evidence**: Studies with quality assessments
8. **Polish Context**: Cultural considerations, availability, regulations

### Polish Supplement Terminology
```typescript
interface SupplementEducationalContent {
  basicInfo: {
    name: string;
    polishName: string;
    category: string;
    polishCategory: string;
    commonNames: string[];
    polishCommonNames: string[];
    sources: string[];
    polishSources: string[];
  };
  
  mechanisms: MechanismOfAction[];
  clinicalUses: ClinicalApplication[];
  safetyInfo: SafetyProfile;
  dosageInfo: DosageGuidelines;
  researchEvidence: ResearchStudy[];
  
  // Educational components
  learningObjectives: string[];
  polishLearningObjectives: string[];
  keyTakeaways: string[];
  polishKeyTakeaways: string[];
  quizQuestions: QuizQuestion[];
}
```

## Interactive Learning Standards

### Quiz and Assessment Design
```typescript
interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'image-identification';
  question: string;
  polishQuestion: string;
  options?: string[];
  polishOptions?: string[];
  correctAnswer: string | string[];
  explanation: string;
  polishExplanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'anatomy' | 'supplements' | 'mechanisms' | 'safety';
  relatedContent: string[]; // IDs of related supplements/brain regions
}
```

### Progress Tracking Requirements
- **Learning Paths**: Structured progression through content
- **Competency Mapping**: Skills and knowledge checkpoints
- **Polish Proficiency**: Track understanding of Polish medical terminology
- **Adaptive Learning**: Adjust content difficulty based on performance

### Gamification Elements
- **Achievement System**: Badges for completing learning modules
- **Progress Visualization**: Visual progress bars and completion metrics
- **Leaderboards**: Optional social features for educational competition
- **Polish Cultural Context**: Achievements named with Polish educational themes

## Content Quality Assurance

### Review Process
1. **Scientific Review**: Medical professional validation
2. **Educational Review**: Pedagogical effectiveness assessment
3. **Polish Language Review**: Native speaker verification
4. **Cultural Review**: Polish cultural appropriateness
5. **Technical Review**: Implementation quality and accessibility

### Quality Metrics
- **Accuracy Score**: Percentage of scientifically accurate statements
- **Comprehension Rate**: User understanding metrics from quizzes
- **Engagement Metrics**: Time spent, completion rates, return visits
- **Polish Proficiency**: Correct usage of Polish medical terminology

### Content Update Procedures
- **Quarterly Reviews**: Update evidence levels and add new research
- **Annual Overhauls**: Comprehensive content review and expansion
- **Real-time Updates**: Immediate corrections for factual errors
- **User Feedback Integration**: Incorporate user suggestions and corrections

## Accessibility and Inclusion

### Polish Language Accessibility
- **Screen Reader Support**: Proper ARIA labels for Polish content
- **Font Requirements**: Support for Polish diacritical marks
- **Reading Level**: Appropriate for Polish educational standards
- **Cultural Sensitivity**: Respectful of Polish healthcare traditions

### Universal Design Principles
- **Multiple Learning Styles**: Visual, auditory, kinesthetic content
- **Cognitive Load Management**: Chunked information, clear navigation
- **Responsive Design**: Mobile-first approach for accessibility
- **Offline Capability**: Core content available without internet

## Regulatory Compliance

### EU Educational Standards
- **GDPR Compliance**: Data protection for educational records
- **Accessibility Directive**: EU digital accessibility requirements
- **Medical Device Regulation**: Compliance for health-related content
- **Consumer Protection**: Accurate health claims and disclaimers

### Polish Educational Integration
- **Ministry of Education Standards**: Align with Polish educational frameworks
- **Medical University Compatibility**: Content suitable for medical students
- **Professional Development**: Continuing education credits where applicable
- **Healthcare Provider Resources**: Materials for Polish healthcare professionals

## Content Expansion Guidelines

### New Supplement Addition Process
1. **Research Phase**: Comprehensive literature review
2. **Translation Phase**: Professional Polish medical translation
3. **Review Phase**: Multi-stage quality assurance
4. **Integration Phase**: Technical implementation and testing
5. **Validation Phase**: User testing and feedback incorporation

### Brain Region Content Development
1. **Anatomical Accuracy**: Verified against Polish medical atlases
2. **Functional Description**: Current neuroscience understanding
3. **Supplement Correlation**: Evidence-based supplement-brain interactions
4. **3D Visualization**: Accurate spatial representation
5. **Educational Integration**: Learning objectives and assessments

### Quality Assurance Checklist
- [ ] Scientific accuracy verified by medical professionals
- [ ] Polish translations reviewed by native speakers
- [ ] Cultural appropriateness confirmed
- [ ] Accessibility standards met
- [ ] Technical implementation tested
- [ ] User experience validated
- [ ] Regulatory compliance confirmed
