# Magnus Opus Hydraskript - AI eBook Generator

An advanced AI-powered eBook generation platform built with Next.js, featuring multi-format export, payment processing, and intelligent content creation.

## 🚀 Features

- **AI-Powered Content Generation**: Create full-length eBooks (90-150+ pages) using advanced LLM models
- **Multi-Format Export**: PDF, EPUB, DOCX, and Audiobook generation
- **Payment Integration**: Stripe-powered subscription and credit system
- **Image Generation**: AI-generated cover art and illustrations via FAL.ai
- **Queue System**: BullMQ-based background job processing
- **Modern UI**: Built with Next.js 14, TypeScript, and TailwindCSS

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier available)
- Redis instance (Upstash free tier recommended)
- FFmpeg (for audiobook generation)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/C-Jay69/magnus_opus_hydraskript_1412.git
cd magnus_opus_hydraskript_1412
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (2-3 minutes)
3. Go to **Settings** → **Database** and copy your connection string
4. Go to **Settings** → **API** and copy your project URL and keys

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your actual values:

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (get your own from respective services)
OPENROUTER_API_KEY="sk-or-v1-..."
FAL_AI_API_KEY="..."
STRIPE_SECRET_KEY="sk_test_..."

# Redis (use Upstash free tier: https://upstash.com)
REDIS_URL="redis://default:your-password@your-redis-url:6379"
```

### 5. Set Up the Database

Run Prisma migrations to create your database schema:

```bash
npx prisma generate
npx prisma db push
```

### 6. Create an Admin User (Optional)

You can create an admin user using Prisma Studio:

```bash
npx prisma studio
```

Or create one programmatically using the helper functions in `lib/auth.ts`.

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   └── ui/               # Reusable UI components
├── lib/                   # Business logic
│   ├── auth.ts           # Authentication with bcrypt
│   ├── llm.ts            # LLM integration
│   ├── payment.ts        # Stripe integration
│   ├── export.ts         # Multi-format export
│   ├── images.ts         # AI image generation
│   └── queue.ts          # Background job queue
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema file
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Sessions**: Secure session management with NextAuth
- **Security Headers**: XSS, clickjacking, and MIME-sniffing protection
- **Environment Validation**: All secrets managed via environment variables
- **Rate Limiting**: Configurable API rate limits

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env`
4. Deploy!

### Deploy with Docker

```bash
# Build the image
docker build -t magnus-opus .

# Run the container
docker run -p 3000:3000 --env-file .env magnus-opus
```

## 🧪 Testing

```bash
# Run type checking
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📚 API Documentation

### Authentication

- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out

### Payment

- `POST /api/payment/create-subscription` - Create a subscription
- `POST /api/payment/purchase-credits` - Purchase credit pack
- `GET /api/payment/get-subscription` - Get user subscription

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com)
- Payments by [Stripe](https://stripe.com)
- AI by [OpenRouter](https://openrouter.ai) and [FAL.ai](https://fal.ai)
