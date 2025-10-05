# Supplement-History Linkage System

## Overview

The Supplement-History Linkage System connects modern supplement profiles with historical Traditional Chinese Medicine (TCM) entries, providing users with rich educational context about the historical use and evolution of herbal supplements.

## Architecture

### Database Models

#### ComprehensiveSupplement
- **Collection**: `comprehensivesupplements`
- **Purpose**: Stores detailed supplement profiles
- **Key Field**: `_id` (MongoDB ObjectId)

#### SupplementHistory
- **Collection**: `supplementhistories`
- **Purpose**: Stores historical timeline entries
- **Key Field**: `relatedSupplements` (Array of ObjectIds referencing ComprehensiveSupplement)

### Data Flow

```
User visits /suplementy/rhodiola-rosea
    ↓
Page fetches supplement by ID
    ↓
RelatedHistory component queries:
    SupplementHistory.find({ relatedSupplements: supplement._id })
    ↓
Displays 2-7 historical entries in Polish
```

## Implementation

### 1. ObjectId Mapping

File: `src/lib/db/seeds/supplement-history-tcm.ts`

```typescript
const SUPPLEMENT_OBJECTIDS: Record<string, string> = {
  "ashwagandha": "68e27ab104bfef0cb4713ddd",
  "coenzyme-q10": "68dd30f6fb83adc0777e91e9",
  "curcumin": "68dd30f7fb83adc0777e91ee",
  "ginkgo-biloba": "68dd30f7fb83adc0777e91fa",
  "lions-mane": "68e27ab304bfef0cb4713dfe",
  "magnesium": "68dd30f7fb83adc0777e920b",
  "omega-3": "68dd30f7fb83adc0777e9215",
  "rhodiola-rosea": "68dd30f7fb83adc0777e9229",
  "vitamin-d3": "68dd30f8fb83adc0777e9231",
};
```

### 2. Helper Function

```typescript
function getSupplementObjectIds(supplementIds: string[]): Types.ObjectId[] {
  return supplementIds
    .filter(id => SUPPLEMENT_OBJECTIDS[id])
    .map(id => new Types.ObjectId(SUPPLEMENT_OBJECTIDS[id]));
}
```

### 3. Historical Entry Example

```typescript
{
  id: "tcm-li-shizhen-bencao-gangmu",
  title: "Li Shizhen's Bencao Gangmu (Compendium of Materia Medica)",
  polishTitle: "Bencao Gangmu Li Shizhena (Kompendium Materia Medica)",
  era: "Ming Dynasty",
  eraStartYear: 1550,
  eraEndYear: 1600,
  // Comprehensive herbal encyclopedia entries for cognitive and adaptogenic herbs
  relatedSupplements: getSupplementObjectIds([
    "rhodiola-rosea", 
    "ginkgo-biloba", 
    "curcumin", 
    "lions-mane", 
    "ashwagandha"
  ]),
  // ... other fields
}
```

## TCM Timeline Mappings

### Historical Rationale

| TCM Entry | Supplements | Rationale |
|-----------|------------|-----------|
| **Shennong Legend** (-2800 to -2000) | rhodiola-rosea, ashwagandha | Ancient adaptogenic herbs from mythic origins of herbal medicine |
| **Huangdi Neijing** (-300 to 200) | rhodiola-rosea, ashwagandha | Foundational herbs aligned with Qi theory and Yin-Yang balance |
| **Shennong Bencao Jing** (-100 to 200) | curcumin, ginkgo-biloba, rhodiola-rosea | Herbs documented in earliest materia medica |
| **Zhang Zhongjing** (150 to 220) | curcumin, ginkgo-biloba | Herbs used in classical formulations for immune support |
| **Sun Simiao** (600 to 700) | ginkgo-biloba, curcumin, lions-mane | Herbs refined by the Medicine King for cognitive benefits |
| **Song Printing** (960 to 1279) | ginkgo-biloba, rhodiola-rosea | Herbs widely disseminated through printing technology |
| **Li Shizhen Bencao** (1550 to 1600) | rhodiola-rosea, ginkgo-biloba, curcumin, lions-mane, ashwagandha | Comprehensive encyclopedia entries |
| **Qing Refinement** (1644 to 1912) | ginkgo-biloba, curcumin, rhodiola-rosea | Herbs refined in Qing dynasty practices |
| **Modern Integration** (1912 to 2000) | omega-3, coenzyme-q10, vitamin-d3, magnesium | Modern supplements with TCM integration research |
| **Globalization** (1980 to 2025) | rhodiola-rosea, ashwagandha, curcumin, ginkgo-biloba, lions-mane | Herbs popularized globally |

## Verification Results

### Test Output (2025-01-XX)

```
✅ Total: 10 TCM entries with 31 supplement references

Rhodiola Rosea: 7 related entries
  - Shennong i początki medycyny ziołowej (Mythic Antiquity)
  - Huangdi Neijing (Wewnętrzny Kanon Żółtego Cesarza) (Warring States to Han)
  - Shennong Bencao Jing (Materia Medica Boskiego Rolnika) (Han Dynasty)
  - Druk i upowszechnienie w dynastii Song (Song Dynasty)
  - Bencao Gangmu Li Shizhena (Kompendium Materia Medica) (Ming Dynasty)
  - Udoskonalenia i komentarze epoki Qing (Qing Dynasty)
  - Globalne upowszechnienie i regulacje (Late 20th - 21st Century)

Ashwagandha: 4 related entries
Ginkgo Biloba: 7 related entries
Curcumin: 6 related entries
```

## Maintenance

### Adding New Supplements

1. **Seed the supplement** in MongoDB via `bun db:seed`
2. **Query for ObjectId**:
   ```bash
   bunx tsx scripts/get-supplement-objectids.ts
   ```
3. **Update mapping** in `src/lib/db/seeds/supplement-history-tcm.ts`:
   ```typescript
   const SUPPLEMENT_OBJECTIDS: Record<string, string> = {
     // ... existing
     "new-supplement": "NEW_OBJECTID_HERE",
   };
   ```
4. **Add to historical entries**:
   ```typescript
   relatedSupplements: getSupplementObjectIds([
     "existing-supplement",
     "new-supplement"  // Add here
   ]),
   ```
5. **Re-seed history**:
   ```bash
   bunx tsx scripts/seeds/seed-supplement-history-tcm.ts
   ```
6. **Verify**:
   ```bash
   bunx tsx scripts/verify-related-history.ts
   ```

### Adding New Historical Entries

1. **Create entry** in `src/lib/db/seeds/supplement-history-tcm.ts`
2. **Link supplements** using `getSupplementObjectIds()`
3. **Add comment** explaining historical connection
4. **Re-seed** and verify

## UI Components

### RelatedHistory Component

**Location**: `src/components/history/RelatedHistory.tsx`

**Features**:
- Displays historical entries in chronological order
- Shows Polish titles and descriptions
- Links to full timeline view
- Empty state when no entries found

**tRPC Query**:
```typescript
const { data: relatedHistory } = api.supplementHistory.getRelatedHistory.useQuery({
  supplementMongoId: supplement._id.toString()
});
```

## Best Practices

1. **Historical Accuracy**: Only link supplements with documented historical use
2. **Source Citations**: Include sources for each historical entry
3. **Polish Localization**: Always provide polishTitle and polishDescription
4. **Chronological Order**: Sort entries by eraStartYear
5. **Meaningful Connections**: Add comments explaining why supplements are linked

## Future Enhancements

- [ ] Add Ayurvedic historical entries
- [ ] Add Greek/Roman herbal medicine timeline
- [ ] Add European herbalism entries
- [ ] Create interactive timeline visualization
- [ ] Add source verification system
- [ ] Implement user-contributed historical notes

## References

- [WHO Traditional Medicine Strategy](https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine)
- Chinese Medicine in Early Chinese Texts (Various authors)
- Bencao Gangmu (Li Shizhen, 1596)

