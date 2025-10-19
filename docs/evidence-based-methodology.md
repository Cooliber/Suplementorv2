# Metodologia oparta na dowodach naukowych - Suplementor

## Spis treści
1. [Hierarchia dowodów naukowych](#hierarchia-dowodów-naukowych)
2. [Ocena jakości badań](#ocena-jakości-badań)
3. [Interpretacja wyników badań](#interpretacja-wyników-badań)
4. **Meta-analizy i przeglądy systematyczne**](#meta-analizy-i-przeglądy-systematyczne)
5. [Źródła danych naukowych](#źródła-danych-naukowych)
6. [Aktualizacja bazy wiedzy](#aktualizacja-bazy-wiedzy)
7. [Polska terminologia medyczna](#polska-termininologia-medyczna)

## Hierarchia dowodów naukowych

### Poziomy wiarygodności badań

#### 1. Meta-analizy i przeglądy systematyczne (najwyższy poziom)
**Definicja**: Statystyczna analiza wielu badań na ten sam temat

**Kryteria jakości**:
- Minimum 5-10 badań włączonych
- Heterogenność badań < 50% (I² statistic)
- Ocena ryzyka błędu systematycznego
- Analiza publication bias

**Przykład**:
```
Meta-analiza: "Witamina D a choroby sercowo-naczyniowe"
- 25 badań RCT włączonych
- 15,000+ uczestników
- Heterogenność: I² = 35% (niska)
- Wniosek: 15% redukcja ryzyka CVD przy suplementacji 2000 IU/dzień
```

#### 2. Randomizowane badania kontrolowane (RCT)
**Definicja**: Uczestnicy losowo przydzielani do grupy suplementu lub placebo

**Kryteria jakości**:
- Randomizacja właściwa (komputerowa, nie ręczna)
- Podwójna ślepota prób (double-blind)
- Grupa kontrolna z placebo
- Wielkość próby obliczona a priori
- Analiza intention-to-treat

**Ocena ryzyka błędu**:
- **Wysokie ryzyko**: małe badania, brak informacji o randomizacji
- **Umiarkowane ryzyko**: niektóre kryteria niespełnione
- **Niskie ryzyko**: wszystkie kryteria jakości spełnione

#### 3. Badania kohortowe
**Definicja**: Obserwacja grupy ludzi przez dłuższy czas

**Zalety**:
- Badanie efektów długoterminowych
- Większe grupy badanych
- Realne warunki życia

**Ograniczenia**:
- Brak randomizacji
- Możliwe czynniki zakłócające
- Nie udowadnia przyczynowości

#### 4. Badania przekrojowe
**Definicja**: Jednorazowy pomiar w grupie ludzi

**Zastosowanie**:
- Badanie częstości występowania
- Generowanie hipotez
- Badanie korelacji

**Ograniczenia**:
- Nie pokazuje przyczynowości
- Możliwość błędu odwrotnego

#### 5. Studia przypadków i serie przypadków
**Definicja**: Szczegółowy opis pojedynczych przypadków

**Zastosowanie**:
- Generowanie hipotez
- Badanie rzadkich efektów ubocznych
- Opisy nietypowych reakcji

**Ograniczenia**:
- Brak grupy kontrolnej
- Możliwość błędu selekcji
- Nie można generalizować

---

## Ocena jakości badań

### Kryteria oceny RCT

#### 1. Randomizacja i alokacja
**Dobra randomizacja**:
- Komputerowa generacja sekwencji
- Ukryta alokacja (concealed allocation)
- Stratyfikacja według ważnych czynników

**Czerwone flagi**:
- Brak informacji o metodzie randomizacji
- Ręczna randomizacja przez badacza
- Brak ukrytej alokacji

#### 2. Kontrola warunków badania
**Ślepota prób**:
- Podwójna ślepota: uczestnicy i badacze nie wiedzą o przydziale
- Potrójna ślepota: także analitycy danych
- Testowanie ślepoty (czy uczestnicy odgadli grupę)

**Grupa kontrolna**:
- Placebo identyczne w wyglądzie, smaku, zapachu
- Aktywne placebo dla substancji z efektami subiektywnymi
- Grupa kontrolna bez suplementacji

#### 3. Wielkość próby i moc statystyczna
**Obliczenie mocy**:
- Na podstawie oczekiwanego efektu
- Uwzględnienie dropout rate (10-20%)
- Minimum 80% mocy dla wykrycia efektu

**Przykład obliczenia**:
```
Oczekiwany efekt: 15% poprawa funkcji poznawczych
Wielkość efektu: d = 0.3 (mały efekt)
Potrzebna wielkość próby: 176 osób na grupę (80% mocy, α = 0.05)
```

#### 4. Analiza statystyczna
**Intention-to-treat (ITT)**:
- Analiza wszystkich randomizowanych osób
- Wliczanie dropoutów do grupy oryginalnej
- Zachowuje randomization benefit

**Per-protocol analysis**:
- Tylko osoby przestrzegające protokołu
- Może zawyżać efekty
- Uzupełnia analizę ITT

---

## Interpretacja wyników badań

### Wielkość efektu (effect size)

#### 1. Standaryzowana miara efektu
**Cohen's d**:
- d < 0.2: efekt pomijalny
- d = 0.2-0.5: mały efekt
- d = 0.5-0.8: średni efekt
- d > 0.8: duży efekt

**Przykład**:
```
Badanie: Omega-3 a depresja
- Cohen's d = 0.45 (średni efekt)
- Klinicznie znaczący: tak
- Wartość praktyczna: umiarkowana
```

#### 2. Kliniczna znacząca różnica
**Nie tylko statystyka**:
- Czy różnica jest ważna dla pacjenta?
- Czy różnica przekłada się na jakość życia?
- Czy koszt suplementacji jest uzasadniony efektem?

**Przykład**:
```
Badanie: Witamina D a gęstość kości
- Statystyczna różnica: p < 0.05
- Kliniczna różnica: +0.5% gęstości kości/rok
- Znaczenie: minimalne, nie zapobiega złamaniom
```

---

### 3. Wartości p i przedziały ufności

**Prawidłowa interpretacja**:
- p < 0.05: mało prawdopodobne, że efekt jest przypadkowy
- p > 0.05: nie ma wystarczających dowodów na efekt
- p nie mówi o wielkości efektu

**Przedziały ufności (95% CI)**:
- Pokazują precyzję oszacowania
- Im węższy CI, tym precyzyjniejsze badanie
- Jeśli CI zawiera 0, efekt nieistotny statystycznie

**Przykład**:
```
Badanie: Magnez a sen
- Średnia różnica: +15 minut snu
- 95% CI: +2 do +28 minut
- Interpretacja: Efekt prawdopodobnie istnieje, ale niepewny
```

---

## Meta-analizy i przeglądy systematyczne

### Proces tworzenia meta-analizy

#### 1. Protokół badania
**Rejestracja protokołu**:
- PROSPERO rejestracja przed rozpoczęciem
- Określenie kryteriów włączenia/wyłączenia
- Plan analizy statystycznej

#### 2. Wyszukiwanie literatury
**Bazy danych**:
- PubMed/MEDLINE
- Embase
- Cochrane Library
- Web of Science
- Polskie bazy: Polska Bibliografia Lekarska

**Strategia wyszukiwania**:
- Kombinacje słów kluczowych
- Synonimy i terminy MeSH
- Brak ograniczeń językowych
- Szara literatura (konferencje, tezy)

#### 3. Selekcja badań
**Kryteria włączenia**:
- Typ badania (RCT dla interwencji)
- Populacja (dorośli, zdrowi)
- Interwencja (konkretny suplement)
- Outcomes (miary efektów)

**Proces selekcji**:
- Dwa niezależni recenzenci
- Rozstrzyganie wątpliwości przez trzeciego
- Dokumentacja powodów wyłączenia

#### 4. Ekstrakcja danych
**Standardowe informacje**:
- Charakterystyka badania
- Uczestnicy (wiek, płeć, zdrowie)
- Interwencja (suplement, dawka, czas)
- Outcomes (miary, czas pomiaru)
- Ryzyko błędu systematycznego

#### 5. Ocena jakości włączonych badań
**Narzędzia oceny**:
- **Cochrane Risk of Bias Tool** dla RCT
- **ROBINS-I** dla badań nie-randomizowanych
- **GRADE** dla oceny pewności dowodów

#### 6. Analiza statystyczna
**Modele meta-analizy**:
- **Fixed-effect model**: zakłada jeden prawdziwy efekt
- **Random-effects model**: uwzględnia heterogenność między badaniami

**Miary heterogenności**:
- I² statistic: 0-100% (wysoka = duża heterogenność)
- Tau²: miara wariancji między badaniami
- Q statistic: test heterogenności

#### 7. Analiza podgrup i wrażliwości
**Analiza podgrup**:
- Według dawki suplementu
- Według czasu trwania
- Według cech uczestników

**Analiza wrażliwości**:
- Wykluczenie badań niskiej jakości
- Wykluczenie małych badań
- Testowanie różnych modeli statystycznych

#### 8. Publikacja wyników
**Raportowanie**:
- Zgodnie z PRISMA guidelines
- Rejestracja w PROSPERO
- Dostępność danych dla innych badaczy

---

## Źródła danych naukowych

### Bazy danych i zasoby

#### 1. PubMed/MEDLINE
**Najważniejsza baza**:
- 30+ milionów cytowań
- Aktualizacja codzienna
- Zaawansowane filtry wyszukiwania
- Linki do pełnych tekstów

**Wyszukiwanie w PubMed**:
```
("supplement name"[Title/Abstract] OR "scientific name"[Title/Abstract]) AND (clinical trial[Filter] OR randomized[Filter]) AND ("2010"[Date - Publication] : "2024"[Date - Publication])
```

#### 2. Cochrane Library
**Złoty standard przeglądów**:
- Systematyczne przeglądy interwencji medycznych
- Metodyczne standardy jakości
- Regularne aktualizacje

#### 3. ClinicalTrials.gov
**Rejestr badań klinicznych**:
- Aktualne i planowane badania
- Wyniki opublikowane i nieopublikowane
- Zgodność z FDAAA 801

#### 4. Polskie źródła naukowe
**Bazy polskie**:
- Polska Bibliografia Lekarska
- Baza czasopism medycznych
- Repozytorium CeON
- Biblioteka Narodowa

**Czasopisma polskie**:
- Polski Merkuriusz Lekarski
- Medycyna Rodzinna
- Farmacja Polska
- Postępy Fitoterapii

---

## Aktualizacja bazy wiedzy

### Proces aktualizacji

#### 1. Monitorowanie literatury
**Automatyczne alerty**:
- Cotygodniowe wyszukiwania w PubMed
- Alerty Google Scholar
- Monitorowanie kluczowych czasopism
- Śledzenie pre-printów

#### 2. Ocena nowych badań
**Kryteria włączenia**:
- Publikacja w peer-reviewed journal
- Impact factor > 2.0 (dla nowych suplementów)
- Minimum 20 uczestników (dla RCT)
- Czas trwania > 2 tygodnie

#### 3. Aktualizacja informacji
**Harmonogram**:
- Krytyczne aktualizacje: natychmiast (bezpieczeństwo)
- Ważne badania: w ciągu tygodnia
- Rutynowe aktualizacje: w ciągu miesiąca

#### 4. Weryfikacja przez ekspertów
**Zespół naukowy**:
- Farmakolodzy kliniczni
- Lekarze specjaliści
- Naukowcy z tytułem doktora
- Native speakerzy polscy dla tłumaczeń

---

## Polska terminologia medyczna

### Zasady tłumaczenia

#### 1. Oficjalna terminologia
**Źródła**:
- Wielki słownik medyczny polsko-angielski
- Terminologia anatomii człowieka (PTA)
- Farmakopea Polska
- Słownik terminów medycznych (PZWL)

#### 2. Nazwy suplementów
**Zasady**:
- Nazwa łacińska w nawiasie przy pierwszym użyciu
- Nazwa polska jako główna
- Nazwy potoczne jeśli powszechnie używane

**Przykład**:
```
Bacopa monniera (L.) Pennell - bakopa drobnolistna, brahmi
```

#### 3. Terminy naukowe
**Tłumaczenia**:
- Evidence-based medicine → medycyna oparta na faktach
- Randomized controlled trial → randomizowane badanie kontrolowane
- Meta-analysis → meta-analiza
- Systematic review → przegląd systematyczny

#### 4. Jednostki miary
**Polskie oznaczenia**:
- mg → miligram
- mcg/µg → mikrogram
- IU → jednostka międzynarodowa
- % DV → % dziennego zapotrzebowania

---

## Praktyczne przykłady interpretacji

### Przykład 1: Witamina D a COVID-19

#### Badania początkowe (2020):
```
Meta-analiza 4 badań: OR = 0.89 (95% CI: 0.81-0.98)
Wniosek: 11% redukcja ryzyka COVID-19 przy suplementacji witaminy D
Ocena: umiarkowana pewność dowodów
```

#### Aktualizacja (2024):
```
Meta-analiza 25 badań, 50,000+ uczestników: OR = 0.92 (95% CI: 0.87-0.97)
Wniosek: 8% redukcja ryzyka, ale heterogenność wysoka (I² = 65%)
Ocena: niska pewność dowodów z powodu heterogenności
```

**Interpretacja dla użytkownika**:
- Witamina D prawdopodobnie lekko zmniejsza ryzyko COVID-19
- Efekt mały, ale klinicznie znaczący w populacji
- Nie zastępuje szczepień i innych środków profilaktycznych

---

### Przykład 2: Omega-3 a choroby serca

#### Hierarchia dowodów:
1. **Meta-analiza** (2019): 25 RCT, 127,000 uczestników
   - 7% redukcja ryzyka zawału serca
   - Wysoka pewność dowodów

2. **Duże RCT** (2020): VITAL trial, 25,871 uczestników
   - Brak efektu na choroby serca
   - Wysoka jakość badania

3. **Obserwacyjne badania** (2021): 420,000 osób
   - 15% redukcja ryzyka CVD przy wysokim spożyciu ryb

**Interpretacja**:
- Omega-3 mają umiarkowany efekt ochronny na serce
- Korzyści większe przy diecie bogatej w ryby
- Suplementacja uzupełnia, nie zastępuje dietę

---

### Przykład 3: Ashwagandha a stres

#### Badania dostępne:
- **RCT** (2012): 64 osoby, 300mg ekstraktu, 8 tygodni
  - 27% redukcja kortyzolu
  - Poprawa jakości snu

- **Meta-analiza** (2021): 8 RCT, 500+ uczestników
  - Standaryzowana różnica średnich: -0.59 (średni efekt)
  - Heterogenność: I² = 45% (umiarkowana)

**Interpretacja**:
- Ashwagandha umiarkowanie redukuje stres
- Efekt widoczny po 4-8 tygodniach
- Bezpieczna dla większości osób

---

## Krytyczne myślenie w suplementacji

### Pytania do zadania przy ocenie badań

#### 1. Czy badanie jest wiarygodne?
- Czy opublikowane w renomowanym czasopiśmie?
- Czy ma odpowiednią metodologię?
- Czy finansowanie jest transparentne?

#### 2. Czy wyniki są klinicznie znaczące?
- Czy wielkość efektu jest praktyczna?
- Czy korzyści przeważają nad ryzykiem?
- Czy wyniki można zastosować do mojej sytuacji?

#### 3. Czy istnieją alternatywy?
- Czy dieta może dostarczyć te same składniki?
- Czy inne suplementy mają lepsze dowody?
- Czy zmiana stylu życia byłaby skuteczniejsza?

---

## Podsumowanie metodologii

### Kluczowe zasady:

1. **Hierarchia dowodów**: meta-analizy > RCT > badania obserwacyjne
2. **Jakość ważniejsza niż ilość**: jedno dobre badanie > wiele słabych
3. **Kliniczna znacząca różnica**: nie tylko p < 0.05
4. **Aktualizacja wiedzy**: nauka się rozwija, informacje się zmieniają
5. **Indywidualizacja**: wyniki badań to średnie, nie gwarancja dla każdego

### Dla użytkowników aplikacji:

- **Zielone oznaczenie**: silne dowody naukowe
- **Żółte oznaczenie**: umiarkowane dowody
- **Czerwone oznaczenie**: słabe dowody lub brak
- **Linki do źródeł**: bezpośrednie linki do PubMed i pełnych tekstów

---

*Metodologia będzie aktualizowana wraz z rozwojem nauki. Ostatnia aktualizacja: październik 2025*