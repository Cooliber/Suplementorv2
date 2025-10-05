# Suplementor - Polish Supplement Education Platform

Comprehensive Polish educational app for neuroregulation and supplements, built with Next.js 15, MongoDB, and tRPC.

## 🚀 Features

- **Comprehensive Supplement Database**: 21+ supplement profiles with Polish translations
- **Knowledge Graph Visualization**: Interactive 3D brain models and supplement relationships
- **Evidence-Based Information**: Research studies and clinical applications
- **Polish Localization**: Complete Polish language support with medical terminology
- **Interaction Analysis**: Safety profiling and supplement interaction warnings
- **Personalized Recommendations**: AI-powered supplement suggestions based on user goals

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.8+
- **Database**: MongoDB with Mongoose ODM
- **API**: tRPC for type-safe API calls
- **Authentication**: NextAuth.js
- **UI**: Tailwind CSS 4+ with shadcn/ui components
- **3D Visualization**: Three.js with React Three Fiber
- **Validation**: Zod schemas
- **Testing**: Vitest with comprehensive coverage

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd suplementor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # MongoDB Configuration
   MONGODB_URI="mongodb://localhost:27017/suplementor"
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/suplementor
   
   # NextAuth.js Configuration
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

5. **Seed the database**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Structure

### Collections

- **supplements**: Complete supplement profiles with Polish translations
- **knowledgeNodes**: Knowledge graph nodes for 3D visualization
- **knowledgeRelationships**: Relationships between knowledge entities
- **users**: User accounts and preferences
- **sessions**: Authentication sessions

### Key Features

- **Flexible Schema**: JSON fields for complex nested data
- **Polish Localization**: All user-facing content in Polish
- **Evidence Tracking**: Research studies and evidence levels
- **Graph Analytics**: Centrality and importance scoring
- **Full-Text Search**: MongoDB text indexes for search functionality

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test categories
npm run test:supplements
npm run test:knowledge
npm run test:api
npm run test:components
```

## 📚 API Documentation

### Supplement Endpoints

- `supplement.getAll` - Get all supplements with filtering
- `supplement.getById` - Get supplement details by ID
- `supplement.search` - Full-text search supplements
- `supplement.getInteractions` - Analyze supplement interactions
- `supplement.getRecommendations` - Get personalized recommendations

### Knowledge Graph Endpoints

- `knowledge.getGraph` - Get knowledge graph data
- `knowledge.getNode` - Get specific knowledge node
- `knowledge.getRelatedNodes` - Get related nodes by depth
- `knowledge.searchKnowledge` - Search knowledge base
- `knowledge.getLearningPath` - Generate learning paths

## 🌍 Polish Localization

All content includes comprehensive Polish translations:

- **Medical Terminology**: Official Polish medical dictionary terms
- **Supplement Names**: Both Polish and scientific names
- **Descriptions**: Complete Polish descriptions for all content
- **UI Elements**: All interface elements in Polish
- **Character Support**: Full support for Polish diacritics (ą, ć, ę, ł, ń, ó, ś, ź, ż)

## 🔒 Security

- **Input Validation**: Zod schemas for all data
- **Authentication**: Secure NextAuth.js implementation
- **Environment Variables**: Sensitive data in environment variables
- **Type Safety**: Strict TypeScript configuration

## 📈 Performance

- **Database Indexing**: Optimized MongoDB indexes
- **Caching**: Connection pooling and query optimization
- **Bundle Optimization**: Code splitting and lazy loading
- **3D Optimization**: Level-of-detail for complex models

## 🚀 Deployment

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/suplementor"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Include Polish translations for all user-facing content
- Write comprehensive tests with >80% coverage
- Use conventional commit messages
- Ensure all linting passes

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database (development only)

# Testing
npm run test         # Run all tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Polish Medical Dictionary for terminology
- Research studies from PubMed and medical journals
- Open source community for tools and libraries
- Medical professionals for content validation

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**Suplementor** - Empowering Polish users with evidence-based supplement education and personalized recommendations.
