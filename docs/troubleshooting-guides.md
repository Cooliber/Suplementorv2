# Przewodniki rozwiązywania problemów - Suplementor

## Spis treści
1. [Problemy z aplikacją](#problemy-z-aplikacją)
2. [Problemy z kontem](#problemy-z-kontem)
3. [Problemy z suplementacją](#problemy-z-suplementacją)
4. [Problemy z danymi](#problemy-z-danymi)
5. [Problemy z przeglądarką](#problemy-z-przeglądarką)
6. [Problemy z urządzeniami mobilnymi](#problemy-z-urządzeniami-mobilnymi)
7. [Kontakt z supportem](#kontakt-z-supportem)

## Problemy z aplikacją

### Graf wiedzy się nie ładuje

**Objawy**: Graf wiedzy pokazuje "Ładowanie..." w nieskończoność lub biały ekran

**Możliwe przyczyny**:
- Problemy z połączeniem internetowym
- Przeglądarka blokuje zasoby
- Duża ilość węzłów powoduje timeout
- Błąd serwera

**Rozwiązania krok po kroku**:

1. **Sprawdź połączenie internetowe**
   ```bash
   # Otwórz terminal i sprawdź
   ping google.com
   # Lub sprawdź status na downdetector.pl
   ```

2. **Odśwież stronę**
   - Naciśnij `Ctrl + F5` (Windows/Linux) lub `Cmd + Shift + R` (Mac)
   - Zamknij i otwórz ponownie kartę przeglądarki

3. **Zmniejsz ilość węzłów**
   - W filtrach grafu ustaw maksymalnie 100 węzłów
   - Wybierz tylko jeden poziom dowodów (np. tylko "Silne")
   - Ogranicz kategorie do 2-3

4. **Wyczyść pamięć podręczną**
   - Naciśnij `Ctrl + Shift + Delete`
   - Wybierz "Pliki cookie" i "Obrazy i pliki w pamięci podręcznej"
   - Zrestartuj przeglądarkę

5. **Sprawdź w innej przeglądarce**
   - Spróbuj Chrome, Firefox, Edge
   - Jeśli działa w innej przeglądarce - problem z Twoją domyślną

6. **Wyłącz rozszerzenia**
   - Otwórz tryb incognito (`Ctrl + Shift + N`)
   - Jeśli działa - wyłącz rozszerzenia jedno po drugim

**Jeśli problem nadal występuje**:
- Sprawdź status serwera na status.suplementor.pl
- Skontaktuj się z supportem z informacjami o przeglądarce i systemie

---

### Kalkulator dawek nie oblicza

**Objawy**: Po wypełnieniu formularza kalkulator nie pokazuje wyników

**Możliwe przyczyny**:
- Nie wypełniono wszystkich wymaganych pól
- Suplement nie istnieje w bazie danych
- Błąd JavaScript w przeglądarce
- Nieprawidłowe dane wejściowe

**Rozwiązania**:

1. **Sprawdź wymagane pola**
   - Upewnij się, że wypełniłeś: wiek, wagę, cel suplementacji
   - Wybierz suplement z listy rozwijanej (nie wpisywać ręcznie)

2. **Sprawdź poprawność danych**
   - Wiek: 12-100 lat
   - Waga: 30-200 kg
   - Cel suplementacji: musi być wybrany

3. **Odśwież kalkulator**
   - Odśwież stronę kalkulatora
   - Wybierz inny suplement, potem wróć do oryginalnego

4. **Sprawdź bazę suplementów**
   - Upewnij się, że suplement istnieje: wyszukaj w bazie suplementów
   - Jeśli nie ma - zasugeruj dodanie przez formularz kontaktowy

---

### Interakcje się nie wyświetlają

**Objawy**: Sekcja interakcji jest pusta lub pokazuje "Brak danych"

**Rozwiązania**:

1. **Dodaj suplementy do obserwowanych**
   - Przejdź do "Moje suplementy"
   - Dodaj minimum 2 suplementy do listy
   - Wróć do sekcji "Interakcje"

2. **Sprawdź aktualizację danych**
   - Kliknij "Odśwież dane interakcji"
   - Poczekaj na synchronizację (10-15 sekund)

3. **Minimalna ilość suplementów**
   - Interakcje wymagają minimum 2 suplementów
   - Maksymalnie analizujemy 10 suplementów jednocześnie

---

### Wizualizacja 3D mózgu nie działa

**Objawy**: Model 3D nie ładuje się lub pokazuje czarny ekran

**Rozwiązania**:

1. **Wymagania systemowe**
   - Sprawdź czy Twoja karta graficzna obsługuje WebGL
   - Przejdź na get.webgl.org i sprawdź status

2. **Aktualizacja sterowników**
   - Zaktualizuj sterowniki karty graficznej
   - Zrestartuj komputer

3. **Zmniejsz jakość grafiki**
   - W ustawieniach wizualizacji zmniejsz jakość na "Niska"
   - Wyłącz cienie i refleksy

4. **Spróbuj innej przeglądarki**
   - Chrome i Edge zazwyczaj mają najlepszą obsługę WebGL

---

## Problemy z kontem

### Nie mogę się zalogować

**Objawy**: Komunikat "Nieprawidłowe dane logowania"

**Rozwiązania**:

1. **Sprawdź dane**
   - Upewnij się, że email jest poprawny
   - Sprawdź czy Caps Lock jest wyłączony
   - Spróbuj skopiować hasło zamiast wpisywać

2. **Resetuj hasło**
   - Kliknij "Zapomniałeś hasła?"
   - Sprawdź folder spam w skrzynce email
   - Link resetujący jest ważny 24 godziny

3. **Sprawdź status konta**
   - Upewnij się, że konto jest aktywne
   - Sprawdź czy nie masz blokady konta

4. **Kontakt z supportem**
   - Jeśli wszystkie powyższe zawodzą - napisz do supportu

---

### Nie mogę zarejestrować konta

**Objawy**: Formularz rejestracji nie działa lub pokazuje błędy

**Rozwiązania**:

1. **Sprawdź wymagania**
   - Email musi być poprawny i nieużywany
   - Hasło minimum 8 znaków
   - Wiek minimum 12 lat

2. **Sprawdź skrzynkę email**
   - Sprawdź folder spam
   - Email potwierdzający może przyjść z opóźnieniem

3. **Spróbuj innej przeglądarki**
   - Czasami problemy z JavaScript blokują formularz

---

### Nie widzę moich postępów

**Objawy**: Historia suplementacji jest pusta lub niekompletna

**Rozwiązania**:

1. **Synchronizacja danych**
   - Kliknij "Synchronizuj dane" w ustawieniach
   - Poczekaj na zakończenie synchronizacji

2. **Sprawdź daty**
   - Upewnij się, że przeglądasz właściwy okres czasu
   - Sprawdź czy suplementacja była śledzona

3. **Eksport i import**
   - Wyeksportuj dane w ustawieniach
   - Jeśli dane są w pliku - problem z synchronizacją

---

## Problemy z suplementacją

### Brak efektów suplementacji

**Objawy**: Po 4+ tygodniach suplementacji nie widzisz oczekiwanych efektów

**Możliwe przyczyny**:
- Za niskie dawki
- Nieregularne zażywanie
- Niska jakość suplementów
- Interakcje z innymi substancjami
- Nierozpoznane niedobory
- Zbyt wysokie oczekiwania

**Rozwiązania krok po kroku**:

1. **Weryfikacja dawek**
   ```
   Przykład dla witaminy D:
   - Sprawdź aktualne badania (PubMed)
   - Porównaj z kalkulatorem w aplikacji
   - Rozważ badanie krwi (25-OH witamina D)
   ```

2. **Analiza regularności**
   - Sprawdź historię w aplikacji (min 80% regularności)
   - Ustaw przypomnienia w telefonie
   - Łącz z istniejącymi nawykami (np. z posiłkami)

3. **Ocena jakości suplementów**
   - Sprawdź certyfikaty (GMP, ISO)
   - Wybierz renomowanych producentów
   - Sprawdź datę ważności i warunki przechowywania

4. **Sprawdzenie interakcji**
   - Wprowadź wszystkie suplementy i leki do analizatora
   - Sprawdź interakcje z jedzeniem (np. wapń blokuje żelazo)
   - Rozważ przerwę między dawkami antagonistów

5. **Badania diagnostyczne**
   - Zrób badania krwi (witaminy, minerały, hormony)
   - Sprawdź markery stanu zapalnego
   - Konsultacja z lekarzem specjalistą

6. **Optymalizacja stylu życia**
   - Sen: 7-9 godzin dziennie
   - Dieta: zbilansowana, bogata w składniki odżywcze
   - Aktywność: regularny ruch
   - Stres: techniki redukcji stresu

**Case study - brak efektów omega-3**:
```
Problem: Po 6 tygodniach omega-3 brak poprawy koncentracji

Analiza:
1. Dawka: 1000mg zamiast rekomendowanych 2000mg
2. Jakość: suplement z dyskontu zamiast certyfikowanego
3. Dieta: dużo tłuszczów trans antagonizujących omega-3
4. Stres: wysoki kortyzol blokujący efekty

Rozwiązanie:
- Zwiększenie dawki do 2000mg
- Zmiana na suplement z certyfikatem IFOS
- Redukcja tłuszczów trans w diecie
- Techniki redukcji stresu

Efekt: Poprawa koncentracji po 3 tygodniach
```

---

### Efekty uboczne suplementacji

**Objawy**: Pojawienie się niepożądanych objawów po rozpoczęciu suplementacji

**Najczęstsze efekty uboczne**:

1. **Problemy żołądkowe**
   - Przyczyna: za wysokie dawki, niska jakość, pusty żołądek
   - Rozwiązanie: zmniejsz dawkę, zażywaj z jedzeniem, zmień formę suplementu

2. **Bezsenność**
   - Przyczyna: stymulanty (kofeina, guarana) zażywane wieczorem
   - Rozwiązanie: przesuń dawkę na rano, sprawdź interakcje

3. **Bóle głowy**
   - Przyczyna: zbyt szybkie zwiększanie dawek, niedobory współzależne
   - Rozwiązanie: zmniejsz dawkę, dodaj suplementy wspomagające

4. **Zmiany skórne**
   - Przyczyna: detoksykacja, alergia na składniki
   - Rozwiązanie: zmniejsz dawkę, sprawdź skład, konsultacja dermatologiczna

**Procedura postępowania**:

1. **Natychmiastowe działania**
   - Odstaw suplement na 3-5 dni
   - Obserwuj czy objawy ustępują
   - Prowadź dziennik objawów

2. **Identyfikacja przyczyny**
   - Sprawdź czy objaw pojawił się po konkretnym suplemencie
   - Analiza interakcji z innymi suplementami/lekami
   - Sprawdzenie jakości suplementu

3. **Testowanie**
   - Wprowadź suplementy pojedynczo
   - Zaczynaj od 25-50% dawki rekomendowanej
   - Obserwuj przez minimum 2 tygodnie

4. **Konsultacja specjalistyczna**
   - Jeśli objawy nie ustępują po odstawieniu
   - Przy objawach poważnych (ból w klatce, duszności)
   - Badania krwi/moczu

---

### Interakcje między suplementami

**Objawy**: Nieoczekiwane efekty po łączeniu suplementów

**Najczęstsze problematyczne kombinacje**:

1. **Wapń + Żelazo**
   - Problem: wapń blokuje wchłanianie żelaza
   - Rozwiązanie: zażywaj w odstępie 2 godzin

2. **Witamina C + Miedź**
   - Problem: witamina C zwiększa wchłanianie miedzi (toksyczność)
   - Rozwiązanie: monitoruj dawki, badania krwi

3. **Kofeina + L-tyrozyna**
   - Problem: nadmierna stymulacja, kołatanie serca
   - Rozwiązanie: zmniejsz dawkę kofeiny

**Narzędzie do analizy**:
- Użyj analizatora interakcji w aplikacji
- Wprowadź wszystkie suplementy i leki
- Sprawdź timing dawek
- Monitoruj objawy przez 2 tygodnie

---

## Problemy z danymi

### Utracone dane suplementacji

**Zapobieganie**:
1. **Regularne kopie zapasowe**
   - Eksportuj dane co miesiąc w ustawieniach
   - Przechowuj w bezpiecznym miejscu

2. **Synchronizacja**
   - Sprawdź czy dane synchronizują się poprawnie
   - Nie wylogowuj się podczas wprowadzania danych

3. **Odzyskiwanie**
   - Jeśli dane zniknęły - sprawdź ostatnią synchronizację
   - Skontaktuj się z supportem z datą ostatniej widocznej aktywności

---

### Nieprawidłowe obliczenia

**Objawy**: Kalkulator pokazuje dziwne wyniki

**Rozwiązania**:
1. **Sprawdź jednostkę miary** (mg vs mcg vs IU)
2. **Weryfikacja danych użytkownika** (wiek, waga)
3. **Porównanie z wiarygodnymi źródłami** (PubMed, lekarz)
4. **Raport błędu** do zespołu deweloperskiego

---

## Problemy z przeglądarką

### Problemy z wydajnością

**Rozwiązania**:
1. **Aktualizacja przeglądarki** do najnowszej wersji
2. **Włączenie sprzętowej akceleracji**
   - W Chrome: ustawienia > zaawansowane > system > akceleracja GPU
3. **Wyłączenie niepotrzebnych rozszerzeń**
4. **Czyszczenie pamięci podręcznej** regularnie

---

### Problemy z JavaScript

**Objawy**: Interaktywne elementy nie działają

**Rozwiązania**:
1. **Włącz JavaScript** w ustawieniach przeglądarki
2. **Wyłącz blokery reklam** (uBlock, AdBlock)
3. **Sprawdź w trybie incognito**
4. **Aktualizacja przeglądarki**

---

## Problemy z urządzeniami mobilnymi

### Aplikacja nie działa na telefonie

**Rozwiązania**:
1. **Aktualizacja systemu** do najnowszej wersji
2. **Sprawdzenie połączenia internetowe** (WiFi/mobile data)
3. **Czyszczenie pamięci podręcznej** w ustawieniach aplikacji
4. **Restart aplikacji** i telefonu

---

### Problemy z gestami dotykowymi

**Objawy**: Powiększanie/pomniejszanie nie działa

**Rozwiązania**:
1. **Sprawdź czy ekran reaguje** na inne gesty
2. **Aktualizacja aplikacji** do najnowszej wersji
3. **Restart aplikacji**
4. **Kontakt z supportem** jeśli problem sprzętowy

---

## Kontakt z supportem

### Kiedy kontaktować się z supportem:

1. **Problemy techniczne nierozwiązane powyższymi metodami**
2. **Błędy w danych** (nieprawidłowe informacje o suplementach)
3. **Problemy z płatnościami** (jeśli dotyczy)
4. **Sugestie ulepszeń** aplikacji
5. **Pytania o funkcje** nierozwiązane w FAQ

### Jak napisać skuteczne zgłoszenie:

1. **Tytuł** - krótki opis problemu
   - Zły: "Nie działa"
   - Dobry: "Graf wiedzy nie ładuje się w Chrome"

2. **Opis krok po kroku**
   - Co robiłeś przed wystąpieniem problemu
   - Jaki błąd dokładnie widzisz
   - Jakie rozwiązanie już próbowałeś

3. **Informacje systemowe**
   - Przeglądarka i wersja
   - System operacyjny
   - Urządzenie (desktop/mobile)
   - Szybkość internetu

4. **Zrzuty ekranu** - jeśli to możliwe

5. **ID użytkownika** - znajdziesz w ustawieniach konta

### Czas odpowiedzi:
- **Problemy krytyczne**: odpowiedź w ciągu 2 godzin
- **Problemy poważne**: odpowiedź w ciągu 24 godzin
- **Pytania ogólne**: odpowiedź w ciągu 48 godzin
- **Sugestie**: odpowiedź w ciągu 1 tygodnia

### Kontakt:
- **Email**: support@suplementor.pl
- **Formularz**: w aplikacji w sekcji "Pomoc"
- **Czat**: dostępny dla użytkowników premium
- **Telefon**: +48 123 456 789 (godziny pracy 9-17)

---

## Zapobieganie problemom

### Najlepsze praktyki:

1. **Regularne aktualizacje**
   - Przeglądarki, systemu, aplikacji
   - Sterowników karty graficznej

2. **Kopie zapasowe**
   - Eksportuj dane regularnie
   - Przechowuj w bezpiecznym miejscu

3. **Monitorowanie**
   - Obserwuj działanie aplikacji
   - Zgłaszaj błędy natychmiast

4. **Bezpieczeństwo**
   - Używaj silnych, unikalnych haseł
   - Włącz 2FA jeśli dostępne
   - Nie udostępniaj danych logowania

---

*Przewodniki będą aktualizowane wraz z nowymi wersjami aplikacji. Ostatnia aktualizacja: październik 2025*