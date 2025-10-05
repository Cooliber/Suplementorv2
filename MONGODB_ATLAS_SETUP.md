# MongoDB Atlas Setup Guide for Suplementor

## ❌ Current Issue: Authentication Failed

The database integration is complete, but we're getting an authentication error when trying to connect to MongoDB Atlas:

```
MongoServerError: bad auth : Authentication failed.
```

This means one of the following needs to be fixed in your MongoDB Atlas account:

## 🔧 Required MongoDB Atlas Configuration

### Step 1: Create Database User

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your cluster: **suplementor.oh5dsia**
4. Click **Database Access** in the left sidebar
5. Click **Add New Database User**
6. Configure the user:
   - **Authentication Method**: Password
   - **Username**: `xbow123_db_user`
   - **Password**: `ocoOT1H6ausj9zsP` (or create a new one)
   - **Database User Privileges**: Select **Atlas admin** or **Read and write to any database**
7. Click **Add User**

### Step 2: Whitelist IP Address

1. In MongoDB Atlas, click **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Choose one of:
   - **Add Current IP Address** (if you're on a static IP)
   - **Allow Access from Anywhere** (0.0.0.0/0) - easier for development
4. Click **Confirm**

**Note**: It may take 1-2 minutes for the IP whitelist to take effect.

### Step 3: Get Correct Connection String

1. In MongoDB Atlas, click **Database** in the left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Select:
   - **Driver**: Node.js
   - **Version**: 6.7 or later
5. Copy the connection string

It should look like:
```
mongodb+srv://xbow123_db_user:<password>@suplementor.oh5dsia.mongodb.net/?retryWrites=true&w=majority&appName=suplementor
```

6. Replace `<password>` with your actual password: `ocoOT1H6ausj9zsP`

### Step 4: Update .env File

Update your `.env` file with the correct connection string:

```env
MONGODB_URI="mongodb+srv://xbow123_db_user:ocoOT1H6ausj9zsP@suplementor.oh5dsia.mongodb.net/?retryWrites=true&w=majority&appName=suplementor"
```

**Important**: If your password contains special characters, URL-encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`
- `%` → `%25`

Your password `ocoOT1H6ausj9zsP` doesn't contain special characters, so no encoding needed.

## ✅ Verify Connection

After completing the above steps, test the connection:

```bash
pnpm exec tsx src/lib/db/check-database.ts
```

Expected output:
```
🔍 Checking MongoDB connection...

🔌 Connecting to MongoDB for Supplement Education Platform...
✅ Connected to MongoDB Atlas
📊 Database: test

📦 Total supplements in database: 0

⚠️  No supplements found. Run: pnpm db:seed
```

## 🌱 Seed the Database

Once connection is successful, run the seed script:

```bash
pnpm db:seed
```

Expected output:
```
╔════════════════════════════════════════════════════════════╗
║   Suplementor Database Seeding - Polish Education Platform ║
╚════════════════════════════════════════════════════════════╝

🌱 Starting comprehensive supplement seeding...
✅ Successfully seeded: 27
📊 Total supplements in database: 27

╔════════════════════════════════════════════════════════════╗
║   🚀 Database seeding completed successfully!              ║
╚════════════════════════════════════════════════════════════╝
```

## 🔍 Verify Seeded Data

Check that data was seeded correctly:

```bash
pnpm exec tsx src/lib/db/check-database.ts
```

Expected output:
```
🔍 Checking MongoDB connection...

✅ Connected to MongoDB Atlas
📊 Database: suplementor_education

📦 Total supplements in database: 27

📋 Sample supplements:
  • Kwasy tłuszczowe Omega-3 (Omega-3 Fatty Acids)
    Category: ESSENTIAL_FATTY_ACID, Evidence: STRONG
  • Magnez (Magnesium)
    Category: MINERAL, Evidence: STRONG
  • Witamina D3 (Vitamin D3)
    Category: VITAMIN, Evidence: STRONG
  ...

📊 Category distribution:
  • NOOTROPIC: 12 supplements
  • VITAMIN: 5 supplements
  • MINERAL: 4 supplements
  ...

✅ Database check complete!
```

## 🚀 Start Development Server

Once data is seeded, start the Next.js development server:

```bash
pnpm dev
```

The application will now use the MongoDB database instead of static data files.

## 🔧 Troubleshooting

### Issue: "Authentication failed"
**Solution**: 
1. Verify database user exists in MongoDB Atlas
2. Check username and password are correct
3. Ensure user has proper permissions (Atlas admin or Read/write)

### Issue: "Connection timeout"
**Solution**:
1. Check IP address is whitelisted in Network Access
2. Try whitelisting 0.0.0.0/0 (allow from anywhere)
3. Wait 1-2 minutes after adding IP address

### Issue: "Database not found"
**Solution**:
- MongoDB Atlas creates databases automatically when you first write data
- The database name will be taken from the connection string
- After seeding, the database will be created

### Issue: "No supplements found after seeding"
**Solution**:
1. Check seed script output for errors
2. Verify connection string includes correct database name
3. Run check script to see actual database name being used

## 📝 Alternative: Use Local MongoDB

If MongoDB Atlas continues to have issues, you can use local MongoDB:

### Install MongoDB Locally

**Windows**:
1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. Start MongoDB: `mongod --dbpath C:\data\db`

**Mac**:
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux**:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Update .env for Local MongoDB

```env
MONGODB_URI="mongodb://localhost:27017/suplementor"
```

### Test Local Connection

```bash
pnpm exec tsx src/lib/db/check-database.ts
```

### Seed Local Database

```bash
pnpm db:seed
```

## 📞 Next Steps

1. **Fix MongoDB Atlas authentication** (follow steps above)
2. **Verify connection** with check script
3. **Seed database** with supplement data
4. **Start development server** and test application
5. **Update UI components** to use database queries instead of static data

## 📚 Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [T3 Stack Documentation](https://create.t3.gg/)

---

**Current Status**: Database integration code is 100% complete. Waiting for MongoDB Atlas authentication to be configured.

**Estimated Time**: 5-10 minutes to configure MongoDB Atlas properly.

