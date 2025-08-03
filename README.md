# Avatar Voting PWA

A fully anonymous, swipe-based voting Progressive Web App (PWA) built with Next.js 15, Supabase, and HeyGen API integration. Users can swipe right (👍 upvote) or left (👎 downvote) on AI avatars with personalized scripts and optional video content.

## 🚀 Features

- **Anonymous Voting**: No login required, uses device-based identification
- **Swipe Interface**: Smooth swipe gestures with Framer Motion animations
- **Personality Filters**: Filter avatars by personality types (funny, serious, quirky, techy, diva, hacker)
- **Real-time Leaderboard**: See top-voted avatars with approval ratings
- **PWA Support**: Installable on mobile devices with offline capabilities
- **HeyGen Integration**: AI-generated scripts and optional video content
- **Prefetching**: Smooth experience with preloaded content

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for images
- **AI Integration**: HeyGen API for video generation
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- HeyGen API account (optional)
- OpenAI API key (optional, for dynamic script generation)

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd avatar-voting-pwa
npm install
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# HeyGen API Configuration (Optional)
HEYGEN_API_KEY=your_heygen_api_key
HEYGEN_API_URL=https://api.heygen.com/v2

# OpenAI API (Optional - for dynamic script generation)
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL schema from `supabase-schema.sql`:

```sql
-- Copy and paste the contents of supabase-schema.sql
-- This will create the tables, indexes, policies, and sample data
```

4. Enable Row Level Security (RLS) policies are already included in the schema

### 4. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Production Deployment

#### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

The app is optimized for Vercel deployment with proper configuration.

## 📱 PWA Features

The app includes full PWA support:

- **Installable**: Users can install the app on their devices
- **Offline Ready**: Basic functionality works offline
- **App-like Experience**: Fullscreen mode on mobile devices
- **Push Notifications**: Ready for future notification features

## 🎯 Usage

### For Users

1. **Voting**: Swipe right (👍) to upvote or left (👎) to downvote avatars
2. **Filtering**: Use personality filters to see specific types of avatars
3. **Leaderboard**: Check the leaderboard to see top-voted avatars
4. **Anonymous**: No account needed, votes are tied to your device

### For Developers

#### Adding New Avatars

You can add avatars through the Supabase dashboard or create an admin interface:

```sql
INSERT INTO niranjan_avatars (image_url, voice_type, persona_tag, script) 
VALUES ('image_url', 'voice_type', 'persona_tag', 'script_text');
```

#### API Endpoints

- `GET /api/avatars` - Fetch avatars with optional persona filter
- `POST /api/vote` - Submit a vote
- `GET /api/leaderboard` - Get leaderboard data
- `POST /api/generate-script` - Generate AI scripts

## 🔒 Privacy & Security

- **Anonymous Voting**: No personal data collected
- **Device-based**: Uses localStorage for device identification
- **Row Level Security**: Supabase RLS policies protect data
- **Rate Limiting**: Prevents spam voting (one vote per avatar per device)

## 🎨 Customization

### Personality Types

Edit the personality types in `src/types/index.ts`:

```typescript
export type PersonaTag = 'funny' | 'serious' | 'quirky' | 'techy' | 'diva' | 'hacker';
```

### Script Prompts

Customize script prompts in `src/lib/heygen.ts`:

```typescript
export const SCRIPT_PROMPTS: Record<PersonaTag, string[]> = {
  // Add your custom prompts here
};
```

### Styling

The app uses TailwindCSS. Customize the theme in `tailwind.config.js` and component styles.

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection**: Ensure your Supabase URL and keys are correct
2. **CORS Issues**: Check your Supabase project settings for allowed origins
3. **Image Loading**: Ensure image URLs are accessible and CORS-enabled
4. **PWA Installation**: Test on HTTPS (required for PWA features)

### Development Tips

- Use browser dev tools to test PWA features
- Check Network tab for API call issues
- Use Supabase dashboard to monitor database activity
- Test swipe gestures on actual mobile devices

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review Supabase and HeyGen documentation
3. Open an issue on GitHub

---

Built with ❤️ using Next.js 15, Supabase, and HeyGen API
