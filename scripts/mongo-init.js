// MongoDB initialization script for Suplementor development database

// Switch to development database
db = db.getSiblingDB('suplementor_dev');

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('supplements');
db.createCollection('brain_regions');
db.createCollection('tracking');
db.createCollection('audit_logs');
db.createCollection('consent_records');

// Create indexes for performance and GDPR compliance
db.users.createIndex({ "userId": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.supplements.createIndex({ "name": 1 });
db.supplements.createIndex({ "category": 1 });
db.supplements.createIndex({ "polishName": 1 });

db.brain_regions.createIndex({ "id": 1 }, { unique: true });
db.brain_regions.createIndex({ "name": 1 });
db.brain_regions.createIndex({ "functions": 1 });

db.tracking.createIndex({ "userId": 1 });
db.tracking.createIndex({ "supplementName": 1 });
db.tracking.createIndex({ "date": 1 });
db.tracking.createIndex({ "userId": 1, "date": 1 });

db.audit_logs.createIndex({ "userId": 1 });
db.audit_logs.createIndex({ "timestamp": 1 });
db.audit_logs.createIndex({ "eventType": 1 });
db.audit_logs.createIndex({ "gdprRelevant": 1 });
db.audit_logs.createIndex({ "hipaaRelevant": 1 });

db.consent_records.createIndex({ "userId": 1 });
db.consent_records.createIndex({ "consentType": 1 });
db.consent_records.createIndex({ "granted": 1 });
db.consent_records.createIndex({ "expiresAt": 1 });

// Insert sample development data
db.users.insertMany([
    {
        userId: "dev_user_1",
        email: "dev@example.com",
        name: "Development User",
        preferences: {
            locale: "pl",
            notifications: true,
            theme: "light"
        },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        userId: "test_user_1",
        email: "test@example.com",
        name: "Test User",
        preferences: {
            locale: "en",
            notifications: false,
            theme: "dark"
        },
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Insert sample supplements data
db.supplements.insertMany([
    {
        name: "Vitamin D3",
        polishName: "Witamina D3",
        category: "Witaminy",
        description: "Essential vitamin for bone health and immune system",
        benefits: ["Zdrowie kości", "Układ odpornościowy", "Nastrój"],
        dosage: "2000 IU",
        timing: "Raz dziennie",
        price: "od 3,99 €",
        skład: {
            activeIngredient: "Cholecalciferol",
            concentration: "2000 IU",
            form: "Kapsułki miękkie",
            additional: ["Oliwa z oliwek", "Witamina E"]
        },
        neuroEffects: ["Poprawa nastroju", "Funkcje poznawcze", "Zdrowie mózgu"],
        warnings: ["Nie przekraczać zalecanej dawki", "Konsultacja z lekarzem"],
        source: "Swiss Herbal EU",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Omega-3",
        polishName: "Omega-3",
        category: "Kwasy tłuszczowe",
        description: "Essential fatty acids for brain health",
        benefits: ["Zdrowie mózgu", "Funkcje poznawcze", "Zdrowie serca"],
        dosage: "1000mg",
        timing: "Raz dziennie",
        price: "od 12,99 €",
        skład: {
            activeIngredient: "EPA + DHA",
            concentration: "1000mg",
            form: "Kapsułki",
            additional: ["Witamina E"]
        },
        neuroEffects: ["Poprawa pamięci", "Koncentracja", "Neuroprotekcja"],
        warnings: ["Osoby przyjmujące leki rozrzedzające krew powinny skonsultować się z lekarzem"],
        source: "Nordic Naturals EU",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Insert sample brain regions data
db.brain_regions.insertMany([
    {
        id: "frontal_lobe",
        name: "Frontal Lobe",
        polishName: "Płat czołowy",
        functions: ["Executive functions", "Decision making", "Personality"],
        functionsPolish: ["Funkcje wykonawcze", "Podejmowanie decyzji", "Osobowość"],
        description: "The frontal lobe is responsible for executive functions, decision making, and personality expression.",
        descriptionPolish: "Płat czołowy odpowiada za funkcje wykonawcze, podejmowanie decyzji i ekspresję osobowości.",
        color: "#FF6B6B",
        position: { x: 0, y: 0, z: 0 },
        size: { width: 100, height: 80, depth: 60 },
        createdAt: new Date()
    },
    {
        id: "hippocampus",
        name: "Hippocampus",
        polishName: "Hipokamp",
        functions: ["Memory formation", "Learning", "Spatial navigation"],
        functionsPolish: ["Tworzenie pamięci", "Uczenie się", "Nawigacja przestrzenna"],
        description: "The hippocampus plays a crucial role in memory formation and spatial navigation.",
        descriptionPolish: "Hipokamp odgrywa kluczową rolę w tworzeniu pamięci i nawigacji przestrzennej.",
        color: "#4ECDC4",
        position: { x: 0, y: -20, z: -10 },
        size: { width: 30, height: 20, depth: 25 },
        createdAt: new Date()
    }
]);

// Insert sample tracking data
db.tracking.insertMany([
    {
        userId: "dev_user_1",
        supplementName: "Vitamin D3",
        dosage: "2000 IU",
        frequency: "Daily",
        date: new Date(),
        mood: 8,
        energy: 7,
        notes: "Feeling good after taking vitamin D3",
        createdAt: new Date()
    },
    {
        userId: "dev_user_1",
        supplementName: "Omega-3",
        dosage: "1000mg",
        frequency: "Daily",
        date: new Date(),
        mood: 7,
        energy: 8,
        notes: "Better focus today",
        createdAt: new Date()
    }
]);

// Insert sample consent records
db.consent_records.insertMany([
    {
        userId: "dev_user_1",
        consentType: "necessary",
        granted: true,
        grantedAt: new Date(),
        version: "1.0",
        purpose: "Basic app functionality",
        createdAt: new Date()
    },
    {
        userId: "dev_user_1",
        consentType: "analytics",
        granted: true,
        grantedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        version: "1.0",
        purpose: "Usage analytics and improvements",
        createdAt: new Date()
    },
    {
        userId: "test_user_1",
        consentType: "necessary",
        granted: true,
        grantedAt: new Date(),
        version: "1.0",
        purpose: "Basic app functionality",
        createdAt: new Date()
    }
]);

// Insert sample audit logs
db.audit_logs.insertMany([
    {
        userId: "dev_user_1",
        eventType: "data_access",
        action: "read",
        resource: "supplement_tracking",
        details: { supplementName: "Vitamin D3" },
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 (Development)",
        gdprRelevant: true,
        hipaaRelevant: false,
        timestamp: new Date()
    },
    {
        userId: "dev_user_1",
        eventType: "consent_change",
        action: "granted",
        resource: "analytics_consent",
        details: { consentType: "analytics" },
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 (Development)",
        gdprRelevant: true,
        hipaaRelevant: false,
        timestamp: new Date()
    }
]);

print("✅ Suplementor MongoDB development database initialized successfully!");
print("📊 Collections created: users, supplements, brain_regions, tracking, audit_logs, consent_records");
print("🔍 Indexes created for optimal performance and GDPR compliance");
print("🧪 Sample data inserted for development and testing");