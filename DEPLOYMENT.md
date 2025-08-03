# Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/avatar-voting-pwa)

### Option 2: Manual Deployment

1. **Fork/Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd avatar-voting-pwa
   ```

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## Environment Variables Setup

### Required Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

#### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

#### Optional API Keys
- `HEYGEN_API_KEY` - HeyGen API key for video generation
- `HEYGEN_API_URL` - HeyGen API URL (default: https://api.heygen.com/v2)
- `OPENAI_API_KEY` - OpenAI API key for dynamic script generation

#### App Configuration
- `NEXT_PUBLIC_APP_URL` - Your deployed app URL (e.g., https://your-app.vercel.app)

## Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the query to create tables and sample data

### 3. Configure Storage (Optional)
If you want to upload custom avatar images:
1. Go to Storage in Supabase dashboard
2. Create a bucket named `avatars`
3. Set appropriate policies for public access

## Demo Mode

The app includes a demo mode that works without any configuration:
- Uses local storage for votes
- Includes sample avatar data
- Perfect for testing and development

## Production Checklist

- [ ] Supabase project created and configured
- [ ] Environment variables set in Vercel
- [ ] Database schema deployed
- [ ] Custom domain configured (optional)
- [ ] PWA icons updated with your branding
- [ ] Analytics configured (optional)

## Monitoring

### Performance
- Use Vercel Analytics for performance monitoring
- Monitor Core Web Vitals in production

### Errors
- Check Vercel Function logs for API errors
- Monitor Supabase logs for database issues

## Scaling Considerations

### Database
- Monitor Supabase usage and upgrade plan if needed
- Consider database indexing for large datasets

### API Limits
- HeyGen API has rate limits - monitor usage
- OpenAI API has rate limits - implement caching if needed

### CDN
- Vercel automatically handles CDN for static assets
- Consider image optimization for avatar images

## Security

### Environment Variables
- Never commit API keys to version control
- Use Vercel's environment variable encryption

### Database Security
- Row Level Security (RLS) is enabled by default
- Review and customize policies as needed

### CORS
- Configured for your domain in Next.js config
- Update for custom domains

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Check environment variables are set correctly
   - Verify Supabase project is active

2. **Images Not Loading**
   - Check image URLs are accessible
   - Verify Next.js image domains configuration

3. **PWA Not Installing**
   - Ensure HTTPS is enabled (automatic on Vercel)
   - Check manifest.json is accessible

4. **API Errors**
   - Check Vercel function logs
   - Verify API keys are valid

### Support

- Check the README.md for detailed documentation
- Review Supabase documentation for database issues
- Check Vercel documentation for deployment issues