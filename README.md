# Goals Vision Board

A Next.js application where users create personalized year-ahead goals through a flexible mixed-format canvas (images + rich text). Users provide contact info and optionally pay to receive their goals via email one year later.

## Features

- **Interactive Canvas**: Drag-and-drop interface for creating vision boards
- **Mixed Content**: Combine images and text blocks
- **Goal Categorization**: Organize goals by category (Health, Career, Relationships, etc.)
- **Image Upload**: Store images using Cloudflare R2
- **Payment Integration**: PIX payment via Abacate Pay for email reminders
- **Email Reminders**: Receive your goals via email one year later (using Resend)
- **Export Options**: Download your vision board as PNG or PDF

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **File Storage**: Cloudflare R2
- **Email**: Resend
- **Payment**: Abacate Pay (PIX)

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn
- PostgreSQL database
- Cloudflare R2 account
- Resend account
- Abacate Pay account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd goals
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Database
DATABASE_URL=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Abacate Pay
ABACATE_PAY_API_KEY=
ABACATE_PAY_WEBHOOK_SECRET=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── create/            # Goal creation canvas
│   ├── preview/           # Preview page
│   ├── payment/[id]/      # Payment page
│   └── api/               # API routes
├── components/            # React components
│   ├── canvas/           # Canvas-related components
│   ├── forms/            # Form components
│   ├── payment/          # Payment components
│   ├── shared/           # Shared components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and clients
├── types/                 # TypeScript type definitions
└── emails/               # React Email templates
```

## Development Roadmap

- [x] Project setup and basic structure
- [x] Canvas editor with drag-and-drop
- [x] Image upload to Cloudflare R2
- [x] Goal categorization system
- [x] Export functionality (PNG/PDF)
- [x] Contact form and submission
- [x] Payment integration (Abacate Pay)
- [x] Email system (Resend + scheduled jobs)
- [x] Landing page
- [x] Mobile optimization

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Setup

Use Vercel Postgres or any PostgreSQL provider:

```bash
# The database tables will be created automatically on first use
# Make sure to set DATABASE_URL in your environment variables
```

### Scheduled Email Job

Set up a cron job to send emails daily. In Vercel:

1. Create a cron job in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-emails",
      "schedule": "0 9 * * *"
    }
  ]
}
```

2. Or use an external service like Cron-job.org to call:
   - URL: `https://yourdomain.com/api/cron/send-emails`
   - Method: GET
   - Header: `Authorization: Bearer YOUR_CRON_SECRET`
   - Schedule: Daily at 9 AM

### Cloudflare R2 Setup

1. Create an R2 bucket in Cloudflare dashboard
2. Enable public access for the bucket
3. Generate API credentials
4. Add environment variables

### Abacate Pay Setup

1. Sign up at https://abacatepay.com
2. Get your API key from the dashboard
3. Set up webhook URL: `https://yourdomain.com/api/webhooks/abacate-pay`
4. Add API key to environment variables

### Resend Setup

1. Sign up at https://resend.com
2. Verify your domain
3. Get your API key
4. Add to environment variables

## API Routes

- `POST /api/upload` - Upload image to R2
- `POST /api/submissions` - Create goal submission
- `POST /api/payment/create-qr` - Generate PIX QR code
- `GET /api/payment/status` - Check payment status
- `POST /api/webhooks/abacate-pay` - Payment webhook
- `GET /api/cron/send-emails` - Send scheduled emails (protected)

## License

MIT