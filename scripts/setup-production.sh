#!/bin/bash

# Bad & Boujee Hair - Production Setup Script
# Run this script to prepare for production deployment

echo "🚀 Setting up Bad & Boujee Hair for Production..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run database migrations (if DATABASE_URL is set)
if [ ! -z "$DATABASE_URL" ]; then
    echo "🔄 Running database migrations..."
    npx prisma migrate deploy
    
    echo "🌱 Seeding database..."
    npm run db:seed
else
    echo "⚠️ DATABASE_URL not set - skipping migrations"
fi

# Build the application
echo "🏗️ Building application..."
npm run build

# Create logs directory
mkdir -p logs

echo "✅ Production setup complete!"
echo ""
echo "🔥 NEXT STEPS:"
echo "1. Set environment variables on your hosting platform"
echo "2. Deploy to Vercel/Railway/Render"
echo "3. Configure custom domain"
echo "4. Set up Stripe webhooks"
echo "5. Configure email service"
echo ""
echo "🚀 Ready to launch!"