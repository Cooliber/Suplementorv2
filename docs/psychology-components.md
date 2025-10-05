# Psychology Components Documentation

## Overview

The Suplementor Psychology Components provide a comprehensive set of tools for understanding cognitive biases, forming healthy habits, and implementing productivity techniques. These components are designed with Polish localization and accessibility in mind, helping users develop better decision-making skills and behavioral patterns.

## Component Architecture

### Core Psychology Components

1. **CognitiveBiasDetector** - Identifies and mitigates cognitive biases in supplement decisions
2. **HabitFormationTracker** - Tracks and supports habit formation with psychological principles
3. **ProductivityTechniqueBrowser** - Explores evidence-based productivity techniques

## Key Features

### Cognitive Bias Detection
- **Bias Identification**: Recognizes common cognitive biases affecting supplement decisions
- **Mitigation Strategies**: Provides evidence-based strategies to counteract biases
- **Scenario-Based Learning**: Interactive scenarios teaching bias recognition
- **Supplement Context**: Specific bias examples related to supplement use

### Habit Formation Tracking
- **Behavioral Psychology**: Applies proven habit formation principles
- **Progress Monitoring**: Tracks streaks, completions, and consistency
- **Strategy Implementation**: Uses techniques like habit stacking and environmental design
- **Supplement Integration**: Connects habits with relevant supplement timing

### Productivity Technique Exploration
- **Evidence-Based Methods**: Curated productivity techniques with scientific backing
- **Implementation Guidance**: Step-by-step instructions for technique adoption
- **Synergy Mapping**: Shows connections between techniques and supplements
- **Performance Tracking**: Metrics for measuring technique effectiveness

## Polish Localization

All psychology components are fully localized in Polish:
- Complete Polish translation of all content and labels
- Culturally appropriate examples and scenarios
- Proper psychological terminology in Polish
- Accessibility-compliant Polish text

## Accessibility Compliance

Components follow WCAG 2.1 AA guidelines:
- Screen reader compatibility with Polish voice support
- Keyboard navigation for all interactive elements
- Proper color contrast ratios
- Semantic HTML structure
- ARIA labels and roles

## Usage Examples

### Cognitive Bias Detector Implementation

```tsx
import { CognitiveBiasDetector } from '@/components/psychology';

const biasScenarios = [
  {
    id: 'confirmation-bias',
    title: 'Confirmation Bias in Supplement Research',
    polishTitle: 'Zafałszowanie potwierdzające w badaniach nad suplementami',
    description: 'Tendency to search for, interpret, and remember information that confirms pre-existing beliefs',
    polishDescription: 'Tendencja do wyszukiwania, interpretowania i zapamiętywania informacji potwierdzających istniejące przekonania',
    scenario: 'You only read studies that support your belief about a supplement',
    polishScenario: 'Czytasz tylko badania potwierdzające twoje przekonania o suplemencie',
    biasType: 'CONFIRMATION_BIAS',
    polishBiasType: 'Zafałszowanie potwierdzające',
    severity: 'HIGH',
    polishSeverity: 'Wysoka',
    questions: [
      {
        id: 'q1',
        question: 'What cognitive bias is demonstrated in this scenario?',
        polishQuestion: 'Jaki błąd poznawczy jest przedstawiony w tym scenariuszu?',
        type: 'MULTIPLE_CHOICE',
        options: [
          {
            id: 'a',
            text: 'Confirmation Bias',
            polishText: 'Zafałszowanie potwierdzające',
            isCorrect: true,
            explanation: 'This is confirmation bias - seeking information that confirms existing beliefs',
            polishExplanation: 'To jest zafałszowanie potwierdzające - poszukiwanie informacji potwierdzających istniejące przekonania'
          }
        ],
        points: 10
      }
    ],
    mitigation: {
      strategy: 'Active open-mindedness',
      polishStrategy: 'Aktywna otwartość umysłu',
      steps: ['Seek disconfirming evidence', 'Consider alternative viewpoints'],
      polishSteps: ['Poszukuj dowodów przeciwstawnych', 'Rozważ alternatywne punkty widzenia'],
      practicalTips: ['Read studies with opposing conclusions', 'Discuss with people who disagree'],
      polishPracticalTips: ['Czytaj badania z przeciwnymi wnioskami', 'Dyskutuj z osobami, które nie zgadzają się']
    },
    supplementContext: {
      relevance: 'Critical for objective supplement evaluation',
      polishRelevance: 'Krytyczne dla obiektywnej oceny suplementów',
      examples: ['Only reading positive reviews', 'Ignoring contraindications'],
      polishExamples: ['Czytanie tylko pozytywnych recenzji', 'Ignorowanie przeciwwskazań'],
      preventionTips: ['Set up alerts for negative studies', 'Use systematic review sources'],
      polishPreventionTips: ['Ustaw powiadomienia o negatywnych badaniach', 'Używaj źródeł przeglądu systematycznego']
    }
  }
];

export default function BiasTrainingPage() {
  const handleScenarioComplete = (scenarioId: string, responses: any[], score: number) => {
    console.log(`Scenario ${scenarioId} completed with score ${score}`);
  };

  const handleBiasDetected = (biasType: string, severity: string) => {
    console.log(`Bias detected: ${biasType} (${severity})`);
  };

  return (
    <div className="container mx-auto py-8">
      <CognitiveBiasDetector
        scenarios={biasScenarios}
        onScenarioComplete={handleScenarioComplete}
        onBiasDetected={handleBiasDetected}
      />
    </div>
  );
}
```

### Habit Formation Tracker Implementation

```tsx
import { HabitFormationTracker } from '@/components/psychology';

const habits = [
  {
    id: 'supplement-intake',
    userId: 'user-1',
    habitType: 'SUPPLEMENT_INTAKE',
    polishHabitType: 'Stosowanie suplementów',
    habitDetails: {
      name: 'Daily Supplement Routine',
      polishName: 'Codzienna rutyna suplementów',
      description: 'Take all daily supplements at consistent times',
      polishDescription: 'Przyjmuj wszystkie dzienne suplementy w ustalonych porach',
      targetFrequency: 'DAILY',
      polishTargetFrequency: 'Codziennie',
      estimatedDuration: 2,
      difficulty: 'EASY',
      polishDifficulty: 'Łatwy'
    },
    formationStrategy: {
      technique: 'HABIT_STACKING',
      polishTechnique: 'Stosowanie nawyków',
      cue: 'After morning coffee',
      polishCue: 'Po porannej kawie',
      routine: 'Take Alpha-GPC, Lion's Mane, and Magnesium',
      polishRoutine: 'Przyjmij Alfa-GPC, Soplówkę jeżowatą i Magnez',
      reward: 'Feel mentally prepared for the day',
      polishReward: 'Poczuj się psychicznie przygotowany na dzień',
      environmentalTriggers: ['Supplement organizer on kitchen counter'],
      polishEnvironmentalTriggers: ['Organizer suplementów na blacie kuchennym']
    },
    progress: {
      startDate: new Date(),
      targetCompletionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      currentStreak: 5,
      longestStreak: 12,
      totalCompletions: 25,
      missedDays: 3,
      completionRate: 89.3,
      weeklyProgress: [
        {
          week: 1,
          completions: 7,
          target: 7,
          notes: 'Perfect week',
          polishNotes: 'Idealny tydzień'
        }
      ]
    },
    relatedSupplements: [
      {
        supplementId: 'alpha-gpc',
        supplementName: 'Alpha-GPC',
        polishSupplementName: 'Alfa-GPC',
        relationship: 'SUPPORTS_HABIT',
        polishRelationship: 'Wspiera nawyk'
      }
    ],
    relatedTechniques: [],
    insights: {
      bestPerformanceTimes: ['Morning after breakfast'],
      polishBestPerformanceTimes: ['Rano po śniadaniu'],
      challengingScenarios: ['Busy mornings', 'Traveling'],
      polishChallengingScenarios: ['Zajęte poranki', 'Podróże'],
      motivationalFactors: ['Improved focus', 'Better sleep'],
      polishMotivationalFactors: ['Poprawione skupienie', 'Lepszy sen'],
      barriers: ['Forgetting', 'Running out of supplements'],
      polishBarriers: ['Zapominanie', 'Brak suplementów']
    },
    isActive: true,
    lastUpdated: new Date(),
    completedAt: undefined
  }
];

export default function HabitTrackingPage() {
  const handleHabitCreate = (habit: Partial<any>) => {
    console.log('Creating new habit:', habit);
  };

  const handleHabitUpdate = (habitId: string, updates: Partial<any>) => {
    console.log(`Updating habit ${habitId}:`, updates);
  };

  const handleHabitDelete = (habitId: string) => {
    console.log(`Deleting habit ${habitId}`);
  };

  const handleCompletionToggle = (habitId: string, date: Date, completed: boolean, notes?: string) => {
    console.log(`Toggling completion for habit ${habitId} on ${date}: ${completed}`);
  };

  return (
    <div className="container mx-auto py-8">
      <HabitFormationTracker
        habits={habits}
        completions={[]}
        onHabitCreate={handleHabitCreate}
        onHabitUpdate={handleHabitUpdate}
        onHabitDelete={handleHabitDelete}
        onCompletionToggle={handleCompletionToggle}
        onCompletionUpdate={() => {}}
      />
    </div>
  );
}
```

### Productivity Technique Browser Implementation

```tsx
import { ProductivityTechniqueBrowser } from '@/components/psychology';

const techniques = [
  {
    id: 'pomodoro',
    name: 'Pomodoro Technique',
    polishName: 'Technika Pomodoro',
    category: 'TIME_MANAGEMENT',
    polishCategory: 'Zarządzanie czasem',
    description: 'Work in focused intervals with short breaks',
    polishDescription: 'Praca w skoncentrowanych odstępach czasu z krótkimi przerwami',
    
    methodology: {
      overview: 'Work for 25 minutes, then take a 5-minute break',
      polishOverview: 'Pracuj przez 25 minut, a następnie zrób 5-minutową przerwę',
      steps: [
        {
          stepNumber: 1,
          title: 'Choose a task',
          polishTitle: 'Wybierz zadanie',
          description: 'Select a specific task to work on',
          polishDescription: 'Wybierz konkretne zadanie do pracy',
          tips: ['Be specific about what you want to accomplish'],
          polishTips: ['Bądź konkretny co chcesz osiągnąć']
        }
      ],
      requirements: ['Timer', 'Task list'],
      polishRequirements: ['Minutnik', 'Lista zadań'],
      tools: ['Physical timer', 'Digital timer app'],
      polishTools: ['Minutnik fizyczny', 'Aplikacja zegara cyfrowego']
    },
    
    scientificBasis: {
      psychologicalPrinciples: ['Time-boxing', 'Focus enhancement'],
      polishPsychologicalPrinciples: ['Ograniczanie czasu', 'Wzmacnianie skupienia'],
      neuroscienceEvidence: 'Short work intervals prevent cognitive fatigue',
      polishNeuroscienceEvidence: 'Krótkie odstępy pracy zapobiegają zmęczeniu poznawczemu',
      researchStudies: [
        {
          title: 'Effect of time-boxing on task completion',
          polishTitle: 'Efekt ograniczania czasu na wykonanie zadań',
          authors: ['Smith J', 'Jones M'],
          year: 2020,
          findings: 'Time-boxing significantly improved task completion rates',
          polishFindings: 'Ograniczanie czasu znacząco poprawiło tempo wykonania zadań',
          evidenceLevel: 'STRONG'
        }
      ],
      evidenceLevel: 'STRONG',
      polishEvidenceLevel: 'Silne'
    },
    
    implementation: {
      gettingStarted: 'Start with one 25-minute session per day',
      polishGettingStarted: 'Zacznij od jednej sesji 25-minutowej dziennie',
      commonMistakes: ['Skipping breaks', 'Overextending work sessions'],
      polishCommonMistakes: ['Pomijanie przerw', 'Przedłużanie sesji pracy'],
      troubleshooting: [
        {
          problem: 'Difficulty focusing for 25 minutes',
          polishProblem: 'Trudności z skupieniem przez 25 minut',
          solution: 'Start with shorter intervals (15 minutes)',
          polishSolution: 'Zacznij od krótszych odstępów (15 minut)'
        }
      ],
      adaptations: [
        {
          situation: 'Complex tasks requiring deep focus',
          polishSituation: 'Złożone zadania wymagające głębokiego skupienia',
          modification: 'Use 50-minute intervals with 10-minute breaks',
          polishModification: 'Użyj 50-minutowych odstępów z 10-minutowymi przerwami'
        }
      ]
    },
    
    effectiveness: {
      averageImprovementPercentage: 25,
      timeToSeeResults: '1-2 weeks',
      polishTimeToSeeResults: '1-2 tygodnie',
      sustainabilityRating: 8,
      difficultyRating: 2,
      userSatisfactionRating: 9,
      applicabilityScenarios: ['Studying', 'Writing', 'Programming'],
      polishApplicabilityScenarios: ['Nauka', 'Pisanie', 'Programowanie']
    },
    
    supplementSynergies: [
      {
        supplementId: 'lions-mane',
        supplementName: 'Lion\'s Mane',
        polishSupplementName: 'Soplówka jeżowata',
        synergyType: 'ENHANCES',
        polishSynergyType: 'Wzmacnia',
        description: 'May enhance focus during Pomodoro sessions',
        polishDescription: 'Może wzmacniać skupienie podczas sesji Pomodoro',
        recommendedTiming: '30 minutes before starting',
        polishRecommendedTiming: '30 minut przed rozpoczęciem'
      }
    ],
    
    trackingMetrics: [
      {
        metric: 'Sessions completed',
        polishMetric: 'Sesje ukończone',
        measurementMethod: 'Count of 25-minute intervals',
        polishMeasurementMethod: 'Liczba 25-minutowych odstępów',
        frequency: 'Daily',
        polishFrequency: 'Dziennie',
        targetImprovement: 'Increase by 2 sessions per day',
        polishTargetImprovement: 'Zwiększ o 2 sesje dziennie'
      }
    ],
    
    relatedTechniques: ['Time blocking', 'Deep work'],
    prerequisites: [],
    polishPrerequisites: [],
    tags: ['focus', 'productivity', 'time management'],
    polishTags: ['skupienie', 'produktywność', 'zarządzanie czasem'],
    difficultyLevel: 'BEGINNER',
    estimatedTimeToMaster: 30,
    isActive: true
  }
];

export default function ProductivityPage() {
  const handleTechniqueSelect = (techniqueId: string) => {
    console.log(`Selected technique: ${techniqueId}`);
  };

  const handleStartImplementation = (techniqueId: string) => {
    console.log(`Starting implementation of technique: ${techniqueId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <ProductivityTechniqueBrowser
        techniques={techniques}
        onTechniqueSelect={handleTechniqueSelect}
        onStartImplementation={handleStartImplementation}
      />
    </div>
  );
}
```

## Component APIs

### CognitiveBiasDetector Props

```typescript
interface CognitiveBiasDetectorProps {
  scenarios: BiasScenario[];
  onScenarioComplete: (scenarioId: string, responses: UserResponse[], score: number) => void;
  onBiasDetected: (biasType: string, severity: string) => void;
  userProgress?: {
    completedScenarios: string[];
    totalScore: number;
    biasesIdentified: string[];
  };
  className?: string;
}
```

### HabitFormationTracker Props

```typescript
interface HabitFormationTrackerProps {
  habits: HabitFormation[];
  completions: HabitCompletion[];
  onHabitCreate: (habit: Partial<HabitFormation>) => void;
  onHabitUpdate: (habitId: string, updates: Partial<HabitFormation>) => void;
  onHabitDelete: (habitId: string) => void;
  onCompletionToggle: (habitId: string, date: Date, completed: boolean, notes?: string) => void;
  onCompletionUpdate: (completionId: string, updates: Partial<HabitCompletion>) => void;
  className?: string;
}
```

### ProductivityTechniqueBrowser Props

```typescript
interface ProductivityTechniqueBrowserProps {
  techniques: ProductivityTechnique[];
  onTechniqueSelect: (techniqueId: string) => void;
  onStartImplementation: (techniqueId: string) => void;
  userProgress?: {
    implementedTechniques: string[];
    masteredTechniques: string[];
    currentlyLearning: string[];
  };
  className?: string;
}
```

## Performance Guidelines

### Optimization Strategies

1. **Virtualization**: Only render visible habit cards and technique items
2. **Memoization**: Cache expensive calculations for habit statistics
3. **Lazy Loading**: Load detailed technique information on demand
4. **Batch Updates**: Group state updates to minimize re-renders

### Memory Management

1. **Cleanup Effects**: Proper cleanup of timers and event listeners
2. **Component Unmounting**: Release resources when components unmount
3. **Data Pagination**: Paginate large datasets to prevent memory issues

## Testing

### Unit Tests
All components have comprehensive unit tests covering:
- Rendering and basic functionality
- State management and updates
- Event handling and user interactions
- Error handling and edge cases

### Integration Tests
- Full system workflow testing
- Data flow between components
- API integration points
- Performance benchmarks

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance
- Semantic structure validation

## Best Practices

### Psychological Principles

1. **Evidence-Based Design**: All features grounded in behavioral psychology research
2. **Progressive Disclosure**: Reveal complexity gradually to avoid overwhelm
3. **Positive Reinforcement**: Celebrate successes to maintain motivation
4. **Gamification Elements**: Use streaks, achievements, and progress tracking

### User Experience

1. **Clear Feedback**: Immediate feedback for all user actions
2. **Intuitive Navigation**: Simple, predictable interface patterns
3. **Personalization**: Adapt to individual user progress and preferences
4. **Contextual Help**: Provide guidance exactly when and where needed

## Future Enhancements

### Planned Features

1. **AI-Powered Recommendations**: Machine learning for personalized bias detection
2. **Social Features**: Community sharing of successful habit strategies
3. **Advanced Analytics**: Deeper insights into productivity patterns
4. **Mobile Optimization**: Touch-friendly interfaces for mobile devices
5. **Voice Integration**: Voice commands for hands-free habit tracking

### Research Integration

1. **Live Study Updates**: Automatic integration of new psychological research
2. **Personalized Studies**: User-specific research recommendations
3. **Citation Tracking**: Monitor which studies users find most helpful
4. **Expert Commentary**: Add psychologist commentary on key findings

## Contributing

When adding new psychology components or modifying existing ones:

1. Follow established patterns for props and TypeScript interfaces
2. Include comprehensive test coverage
3. Ensure accessibility compliance
4. Provide Polish localization for all text
5. Document component usage in this guide
6. Maintain consistent styling with the design system
7. Apply psychological principles appropriately
8. Consider performance implications for large datasets

## Troubleshooting

### Common Issues

1. **Missing Polish Translations**
   - Solution: Check all text strings for Polish equivalents
   - Solution: Verify localization files are properly imported

2. **Accessibility Audit Failures**
   - Solution: Use Accessible versions of components
   - Solution: Check color contrast ratios
   - Solution: Verify focus management

3. **Performance Issues with Large Datasets**
   - Solution: Implement virtualization
   - Solution: Use pagination for long lists
   - Solution: Optimize rendering with memoization

4. **State Management Problems**
   - Solution: Use proper React state patterns
   - Solution: Implement proper cleanup in useEffect
   - Solution: Consider using Zustand for complex state