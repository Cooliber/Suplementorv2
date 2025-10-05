# 🎮 Gamification Components

Japanese-inspired UI/UX components for visualizing AI performance metrics and motivating continuous improvement.

## 🎯 Quick Start

```tsx
import {
  XPProgressBar,
  AchievementBadge,
  StreakCalendar,
  LeaderboardCard,
  QualityMetricsRadar,
  LevelUpNotification,
} from '@/components/gamification';
import { useGamificationStore } from '@/lib/stores/gamification-store';

function Dashboard() {
  const { currentXP, level, achievements } = useGamificationStore();
  
  return (
    <div className="space-y-6">
      <XPProgressBar currentXP={currentXP} level={level} variant="detailed" />
      
      <div className="grid grid-cols-4 gap-4">
        {achievements.map(achievement => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
```

## 📦 Components

### XPProgressBar
Visualizes XP accumulation and level progression with smooth animations.

**Variants**: `compact` | `default` | `detailed`

```tsx
<XPProgressBar
  currentXP={1250}
  levelXP={1201}
  nextLevelXP={3001}
  level={3}
  variant="detailed"
  onLevelUp={() => console.log('Level up!')}
/>
```

### AchievementBadge
Displays achievements with lock states, progress tracking, and celebration effects.

**Sizes**: `sm` | `md` | `lg`

```tsx
<AchievementBadge
  achievement={{
    id: 'first-perfect-score',
    name: 'First Perfect Score',
    description: 'Achieve 100% quality',
    icon: 'star',
    category: 'quality',
    xpReward: 500,
    unlocked: true,
  }}
  size="lg"
  showProgress
  showTooltip
/>
```

### StreakCalendar
Activity heatmap showing daily streaks and XP earned.

```tsx
<StreakCalendar
  streakData={[
    { date: '2025-01-01', active: true, xpEarned: 450 },
  ]}
  currentStreak={7}
  bestStreak={14}
  weeksToShow={12}
/>
```

### LeaderboardCard
Competitive rankings with position tracking.

**Categories**: `xp` | `quality` | `security` | `innovation` | `efficiency` | `architecture`

```tsx
<LeaderboardCard
  title="Overall XP Champions"
  entries={[
    { rank: 1, name: 'CodeMaster', score: 15420, change: 2 },
  ]}
  currentUserRank={5}
  category="xp"
/>
```

### QualityMetricsRadar
6-axis radar chart for quality visualization.

```tsx
<QualityMetricsRadar
  metrics={[
    { label: 'Code Quality', value: 92, target: 90 },
    { label: 'Security', value: 88, target: 95 },
  ]}
  title="Quality Overview"
  size={400}
/>
```

### LevelUpNotification
Celebration modal with confetti effects.

```tsx
<LevelUpNotification
  isOpen={true}
  onClose={() => {}}
  newLevel={3}
  levelName="Proficient Assistant"
  xpEarned={500}
  unlockedFeatures={['Advanced challenges']}
  duration={5000}
/>
```

## 🎨 Design Principles

### Japanese Aesthetics

**Ma (間) - Negative Space**
- Generous padding and breathing room
- Clean, uncluttered layouts

**Wabi-Sabi (侘寂) - Imperfect Beauty**
- Natural, organic motion curves
- Subtle imperfections in animations

**Kanso (簡素) - Simplicity**
- Minimal color palette
- Essential information only

### Animation Standards

```typescript
// Easing Curves
gentle: [0.25, 0.1, 0.25, 1.0]   // Water flowing
calm: [0.4, 0.0, 0.2, 1.0]       // Shoji door
precise: [0.45, 0.05, 0.55, 0.95] // Tea ceremony
elegant: [0.7, 0.0, 0.3, 1.0]    // Cherry blossoms

// Durations
Micro: 200-300ms
Transition: 400-600ms
Celebration: 1000-2000ms

// Motion
Scale: 1.0 → 1.02
Translate: 2-4px
Opacity: 0 → 1
Rotation: ±5°
```

## 🔧 State Management

### Zustand Store

```tsx
import { useGamificationStore } from '@/lib/stores/gamification-store';

// Get state
const { currentXP, level, achievements } = useGamificationStore();

// Add XP
const { addXP } = useGamificationStore();
addXP(100, 'task-completion');

// Unlock achievement
const { unlockAchievement } = useGamificationStore();
unlockAchievement('first-perfect-score');

// Update quality score
const { updateQualityScore } = useGamificationStore();
updateQualityScore('codeQuality', 95);
```

## 📊 Performance

- **Bundle**: ~40KB gzipped
- **FPS**: 60fps (GPU accelerated)
- **Accessibility**: WCAG 2.1 AA
- **Reduced Motion**: Supported

## 🎯 Level System

| Level | Name | XP Required |
|-------|------|-------------|
| 1 | Apprentice Assistant | 0 |
| 2 | Competent Assistant | 501 |
| 3 | Proficient Assistant | 1,201 |
| 4 | Expert Assistant | 3,001 |
| 5 | Master Architect | 6,001 |

## 🏆 Achievement Categories

- **Quality** (Blue) - Code quality achievements
- **Security** (Red) - Security mastery
- **Performance** (Green) - Optimization victories
- **Innovation** (Purple) - Creative solutions
- **Architecture** (Amber) - Architectural excellence
- **Streak** (Pink) - Consistency rewards

## 🎨 Color System

```typescript
// Level Colors
Level 1: from-slate-500 to-slate-600
Level 2: from-blue-500 to-blue-600
Level 3: from-purple-500 to-purple-600
Level 4: from-amber-500 to-amber-600
Level 5: from-emerald-500 to-emerald-600

// Category Colors
Quality: from-blue-500 to-cyan-500
Security: from-red-500 to-pink-500
Performance: from-green-500 to-emerald-500
Innovation: from-purple-500 to-fuchsia-500
Architecture: from-amber-500 to-orange-500
Streak: from-pink-500 to-pink-600
```

## ♿ Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ `prefers-reduced-motion`
- ✅ 4.5:1 color contrast

## 📚 Documentation

- **Full Docs**: `/docs/GAMIFICATION_UI_SYSTEM.md`
- **Implementation**: `/docs/GAMIFICATION_IMPLEMENTATION_COMPLETE.md`
- **Demo**: `/gamification-demo`

## 🚀 Demo

Visit `/gamification-demo` to see all components in action with interactive controls.

## 🔮 Future Features

- Sound effects
- Social sharing
- Custom achievements
- Team leaderboards
- Historical charts
- Export reports

## 📝 License

Part of the Suplementor project.

---

**Built with**: Framer Motion, Zustand, shadcn/ui, Tailwind CSS  
**Design**: Japanese-inspired calm aesthetics  
**Performance**: 60fps GPU-accelerated animations  
**Accessibility**: WCAG 2.1 AA compliant

