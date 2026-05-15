# AI Pulse

Your real-time AI news aggregator. Stay up to date with the latest developments in artificial intelligence, machine learning, and emerging AI technologies -- all in one place.

## Features

- **Multi-source aggregation** - Pulls news from 8+ RSS feeds and NewsAPI
- **Smart categorization** - Automatically classifies articles into AI subcategories
- **Trending detection** - Highlights breaking and trending AI stories
- **Real-time updates** - Auto-refreshes every 5 minutes
- **Responsive design** - Works on desktop, tablet, and mobile
- **Dark mode** - Toggle between light and dark themes
- **Search & filter** - Find articles by keyword or category
- **Reading time estimates** - Know how long each article takes to read

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **RSS Parsing:** rss-parser
- **Date Formatting:** date-fns
- **Deployment:** Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ai-pulse.git
cd ai-pulse
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env.local
```

4. Add your API keys (see [API Keys](#api-keys) below)

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Keys

### NewsAPI (Optional but Recommended)

1. Go to [https://newsapi.org/register](https://newsapi.org/register)
2. Create a free account
3. Copy your API key
4. Add it to `.env.local`:

```
NEWS_API_KEY=your_api_key_here
```

Note: The app works without a NewsAPI key by relying solely on RSS feeds, but adding one provides more comprehensive coverage.

## RSS Sources

AI Pulse aggregates from these sources:

| Source | Category |
|--------|----------|
| Google News AI | General |
| TechCrunch AI | Business |
| The Verge AI | General |
| MIT Technology Review | Research |
| VentureBeat AI | Business |
| ArXiv AI | Research |
| Wired AI | General |
| Ars Technica | General |

## Categories

Articles are automatically classified into:

- Machine Learning
- Large Language Models
- Computer Vision
- Robotics
- AI Ethics
- Generative AI
- Neural Networks
- AI Research
- AI Business
- AI Tools

## API Endpoints

### GET /api/news

Fetches aggregated news articles.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| category | string | all | Filter by category slug |
| search | string | - | Search in title/description |
| limit | number | 50 | Max articles to return |
| offset | number | 0 | Pagination offset |

**Example:**

```
GET /api/news?category=llms&limit=10&offset=0
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in the Vercel dashboard
5. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Docker

```bash
npm run build
npm start
```

## Screenshots

*Coming soon*

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
