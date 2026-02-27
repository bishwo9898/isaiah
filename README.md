# Isaiah Calibre - Portfolio Website

A modern, dark-themed portfolio website for videographer Isaiah Calibre, built with Next.js and integrated with Cloudinary for seamless video delivery.

## Features

- **Hero Section**: Reduced-height hero with video background
- **Video Grid**: Dynamically loaded videos from Cloudinary with hover-to-play
- **Video Modal**: Click to play videos with full controls
- **Photos Tab**: Ready for photo grid implementation
- **Dark Theme**: Minimalist dark design with elegant typography

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Cloudinary account with videos uploaded

### Local Development

1. Clone the repository

```bash
git clone https://github.com/bishwo9898/isaiah.git
cd isaiah
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Cloudinary details:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get these values from your [Cloudinary Dashboard](https://console.cloudinary.com/console/).

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com/new)
3. In Vercel Project Settings → Environment Variables, add:
   - `CLOUDINARY_API_KEY` (keep it secret)
   - `CLOUDINARY_API_SECRET` (keep it secret)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (can be public)

4. Deploy!

**Important**: Make sure the API key and secret are set as **Secret** environment variables in Vercel, not as regular environment variables.

## Troubleshooting

### "Error: Failed to fetch videos" on Vercel

This usually means environment variables are missing. Check:

1. Vercel Project Settings → Environment Variables
2. Ensure both `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are set
3. Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches your actual cloud name
4. Redeploy after adding/fixing variables

### Videos not playing

- Ensure videos are uploaded to your Cloudinary account
- Check that your Cloudinary API credentials are correct
- Videos are accessed via Cloudinary's CDN for optimal performance

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Fonts**: Geist, Cormorant Garamond, Inter (from Google Fonts)
- **Media**: Cloudinary API for dynamic video delivery
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── api/videos/route.ts    # Cloudinary videos API endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Hero.tsx               # Hero section with video background
│   ├── Navbar.tsx             # Navigation bar
│   ├── VideoGrid.tsx          # Dynamic video grid component
│   └── WorkSection.tsx        # Work section with tabs
```

## License

All content and code are proprietary to Isaiah Calibre.
# isaiah
