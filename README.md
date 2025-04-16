# Intelligent Healthcare Assistant

A Next.js-based healthcare assistant application that provides health information and guidance to users. This AI-powered assistant can answer questions about common health issues, provide general medical information, and guide users toward appropriate healthcare resources.

## 🌟 Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- **Interactive Chat Interface**: Real-time conversation with intelligent health assistant
- **Role-Based Access Control**: Separate interfaces for patients, healthcare providers, and administrators
- **Personalized Responses**: Tailored answers based on user context and chat history
- **Comprehensive User Authentication**: Complete signup, signin, and profile management
- **PostgreSQL Database Integration**: Secure storage of user data, chat history, and blog content
- **OpenAI Integration**: Advanced responses for complex health queries
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Health Information Database**: Built-in responses for common health topics
- **Privacy-Focused**: Clear disclaimers and secure handling of sensitive information
- **JWT Authentication**: Secure token-based authentication system with HTTP-only cookies
- **Protected Routes**: Middleware-based route protection for secure access control
- **Doctor Verification System**: Administrative approval workflow for healthcare providers
- **Content Management System**: Blog creation and management for health information
- **Animated UI Components**: Modern, visually appealing interface with animated elements

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ismat-samadov/intelligent-healthcare-assistant.git
   cd intelligent-healthcare-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create an `.env.local` file in the root directory with the following variables:
   ```
   # PostgreSQL Database Configuration
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_NAME=your_db_name
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   
   # JWT Secret (Generate a strong random string)
   JWT_SECRET=your_jwt_secret_key_here
   
   # Admin Creation Key (For creating admin accounts)
   ADMIN_CREATION_KEY=your_secure_admin_key_here
   
   # OpenAI API Key (For advanced responses)
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Initialize the database:
   ```bash
   psql -U your_db_username -d your_db_name -f scripts/scripts.sql
   # or use npx ts-node scripts/init-db.ts if you've set up a TypeScript script
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
intelligent-healthcare-assistant/
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   │   ├── admin/     # Admin-specific endpoints
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── blog/      # Blog management endpoints
│   │   │   └── chat/      # Chat endpoint
│   │   ├── admin/         # Admin dashboard and management
│   │   ├── auth/          # Auth-related pages
│   │   ├── blog/          # Blog pages and post view
│   │   ├── chat/          # Chat interface page
│   │   ├── doctor/        # Doctor-specific pages
│   │   ├── privacy/       # Privacy policy page
│   │   ├── profile/       # User profile page
│   │   ├── terms/         # Terms of service page
│   │   ├── page.tsx       # Home page
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── admin/         # Admin components
│   │   ├── auth/          # Authentication components
│   │   ├── blog/          # Blog components
│   │   ├── doctor/        # Doctor-specific components
│   │   ├── ChatInterface.tsx   # Chat UI component
│   │   ├── ChatMessage.tsx     # Individual message component
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── PrivacyPolicy.tsx   # Privacy policy component
│   │   └── TermsOfService.tsx  # Terms of service component
│   ├── context/           # React context
│   │   └── AuthContext.tsx # Authentication context
│   ├── lib/               # Utility functions
│   │   ├── blog-db.ts     # Blog database operations
│   │   ├── chatbot.ts     # Chatbot logic
│   │   ├── db.ts          # Database connection
│   │   ├── edge-jwt.ts    # Edge-compatible JWT utilities
│   │   ├── initDB.ts      # Database initialization
│   │   ├── jwt.ts         # JWT utilities
│   │   └── user-db.ts     # User database operations
│   ├── middleware.ts      # Next.js middleware for auth protection
│   ├── styles/            # CSS styles
│   │   └── blog.css       # Blog-specific styles
│   └── types/             # TypeScript type definitions
│       ├── chat.ts        # Chat-related types
│       └── user.ts        # User and blog-related types
├── scripts/               # Utility scripts
│   ├── generate-password-hash.js # Password hashing utility
│   └── scripts.sql        # Database initialization SQL
├── .env.local             # Environment variables (create this file)
└── package.json
```

## 🔐 Authentication System

The application uses a JWT-based authentication system:

- **Sign Up**: Users can create a new account with name, email, password, and role (patient or doctor)
- **Sign In**: Existing users can sign in with email and password
- **Protected Routes**: Middleware automatically protects routes that require authentication
- **Role-Based Access**: Doctor-specific and admin-specific routes are protected from unauthorized users
- **User Profile**: Authenticated users can access their profile information
- **Secure Token Storage**: Authentication tokens are stored in both localStorage and HTTP-only cookies
- **JWT Verification**: Server-side verification of tokens for protected routes

## 💬 Chat Features

- **Healthcare Knowledge Base**: Built-in responses for common health topics
- **Context-Aware Suggestions**: Dynamically updated chat suggestions based on conversation
- **Conversation History**: For authenticated users, chat history is maintained in the database
- **Personalized Responses**: Users who are logged in receive personalized interactions
- **OpenAI Integration**: Advanced AI responses when built-in knowledge is insufficient
- **Health Disclaimers**: Clear healthcare disclaimers to ensure proper use of information

## 👨‍⚕️ Healthcare Provider Features

For users with the "doctor" role:

- **Doctor Dashboard**: Overview of patient statistics and activities
- **Provider Portal**: Centralized access to healthcare provider tools
- **Verification Process**: Admin-based verification of healthcare provider accounts
- **Role-Based UI**: Special navigation options and features for doctors

## 📝 Content Management

The application includes a blog system for healthcare content:

- **Blog Posts**: Create, edit, and publish health-related articles
- **Admin Dashboard**: Manage blog content through a user-friendly interface
- **Tags and Categories**: Organize posts by tags for easy navigation
- **Publishing Workflow**: Save drafts and publish when ready
- **Rich Text Content**: Support for HTML formatting in blog posts

## 🧠 AI Integration

The chatbot uses a combination of:

1. **Built-in Knowledge Base**: For fast responses to common health questions
2. **OpenAI API**: For more complex or nuanced health inquiries
3. **Personalization Layer**: Adapts responses based on user context and history

## 💽 Database Integration

The application uses PostgreSQL for data storage:

- **User Management**: Securely stores user information with encrypted passwords
- **Role-Based System**: Distinguishes between patients, doctors, and administrators
- **Chat History**: Logs conversation history for authenticated users
- **Blog Content**: Stores blog posts, tags, and publishing status
- **Connection Pool**: Efficient connection management for database operations

## 🔧 Customizing the Application

### Adding More Health Topics

To add more built-in responses to common health queries, edit the `healthcareKnowledgeBase` object in `src/lib/chatbot.ts`:

```typescript
const healthcareKnowledgeBase = {
  // Existing topics...
  'new-topic': 'Your response about the new health topic here.',
};
```

### Extending the Authentication System

To implement additional authentication features:

1. Add new fields to the user registration form in `src/components/auth/SignUpForm.tsx`
2. Update the database schema in `scripts/scripts.sql` to include new fields
3. Modify the user-related types in `src/types/user.ts`
4. Implement additional auth endpoints in `src/app/api/auth/`

### Customizing the UI

The application uses Tailwind CSS for styling. To customize the appearance:

1. Modify component files directly to change the Tailwind classes
2. Update global styles in `src/app/globals.css`
3. Add new component-specific styles when needed

## ⚠️ Health Information Disclaimer

This healthcare assistant is intended for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.