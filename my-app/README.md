# 🔑 API Manager

A modern, full-stack web application for managing API keys with comprehensive validation, usage tracking, and security features.

## 🎯 What is API Manager?

API Manager is a centralized dashboard that provides organizations and developers with a complete solution for:

- **API Key Management**: Create, read, update, and delete API keys with detailed metadata
- **Validation & Testing**: Secure playground environment for testing API key validity
- **Usage Monitoring**: Track usage patterns, set limits, and monitor access
- **Permission Control**: Role-based access with read/write/admin permissions
- **Modern UI/UX**: Dark/light mode, responsive design, and accessibility features

## 🚀 Key Features

- ✅ **Full CRUD Operations** for API key management
- ✅ **Secure API Key Generation** with unique `rig-` prefixed keys
- ✅ **Real-time Validation** through integrated testing playground
- ✅ **Usage Analytics** with monthly limits and tracking
- ✅ **Permission System** (read/write/admin access levels)
- ✅ **Modern UI** with dark/light mode and keyboard shortcuts
- ✅ **Supabase Integration** for secure, scalable backend
- ✅ **Responsive Design** optimized for all devices

## 📚 Documentation

For detailed information about the application:

- **[📖 Complete Documentation](./API_MANAGER_DOCUMENTATION.md)** - Full app overview, use cases, and features
- **[🏗️ Technical Architecture](./TECHNICAL_ARCHITECTURE.md)** - In-depth technical implementation details
- **[🔧 Component Structure](./COMPONENT_STRUCTURE.md)** - Code organization and architecture
- **[🗄️ Supabase Setup](./SUPABASE_SETUP.md)** - Database configuration guide

## 🏃‍♂️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup
1. Create a Supabase project
2. Run the SQL schema from `UPDATED_SCHEMA.sql`
3. Configure Row Level Security policies

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎮 Usage

### Main Dashboard (`/api-keys`)
- View all API keys with usage statistics
- Create new keys with custom permissions
- Edit existing key properties
- Delete unused keys
- Test Supabase connection

### API Playground (`/playground`)
- Enter API keys for validation
- Secure testing environment
- Real-time validation feedback

### Keyboard Shortcuts
- `Ctrl+N`: Create new API key
- `Ctrl+D`: Toggle dark mode
- `T`: Test connection
- `S`: Toggle sidebar
- `?`: Show all shortcuts

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.5 with React 19.1.0
- **Styling**: Tailwind CSS v4 with dark/light mode
- **Backend**: Supabase (PostgreSQL + API)
- **State Management**: Custom React hooks
- **Deployment**: Vercel-ready

## 🔐 Security Features

- **Row Level Security** (RLS) enabled database
- **Unique API key constraints** at database level
- **Secure key generation** with cryptographic randomness
- **Input validation** on client and server
- **Environment variable protection** for sensitive data

## 🎯 Use Cases

### For API Providers
- Manage customer API keys
- Track usage and enforce limits
- Control access permissions

### For Development Teams
- Centralized key management
- Team collaboration features
- Usage monitoring and analytics

### For Individual Developers
- Personal API key organization
- Testing and validation tools
- Learning API security concepts

## 📈 Future Enhancements

- **Authentication**: User accounts with Supabase Auth
- **Team Management**: Multi-user organizations
- **Advanced Analytics**: Usage patterns and insights
- **Rate Limiting**: API call rate controls
- **Webhooks**: Integration capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review the browser console for errors
3. Verify Supabase configuration
4. Ensure database schema is properly set up

## 📄 License

This project is built with Next.js and uses the MIT license framework.
