# 🏏 Match Watch - Cricket Dashboard Application

A modern, fully functional React + Supabase cricket dashboard application for tracking live cricket matches, scores, and favorite teams.

## Features

✨ **Live Cricket Scores** - Real-time updates for ongoing matches  
📅 **Match Schedule** - View upcoming and past matches  
⭐ **Favorite Teams** - Select and track your favorite cricket teams  
🔒 **Secure Authentication** - User signup and login with Supabase  
📊 **Match Details** - Detailed information about each match  
📱 **Responsive Design** - Works beautifully on all devices  
🎨 **Beautiful UI** - Clean, modern, and intuitive interface  

## Tech Stack

- **Frontend**: React 18 + React Router
- **Backend**: Supabase (Database + Authentication)
- **Styling**: CSS3 with responsive design
- **Build Tool**: Vite
- **API**: Cricket match data from CricketData API

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm or yarn
- A Supabase account (free tier available at https://supabase.com)

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd cricket-match
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### a. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Copy your project URL and API key

#### b. Set Up Database Tables

In your Supabase dashboard, go to SQL Editor and run this command:

```sql
-- Create favorite_teams table
CREATE TABLE favorite_teams (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, team_name)
);

-- Create index for faster queries
CREATE INDEX idx_favorite_teams_user_id ON favorite_teams(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE favorite_teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own favorite teams" ON favorite_teams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite teams" ON favorite_teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite teams" ON favorite_teams
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

To find these values:
1. Go to your Supabase proiect settings
2. Under "API" section, copy "Project URL" and "anon public" key

### 5. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Usage

### First Time Users

1. **Visit the Landing Page** - Learn about the app features
2. **Create an Account** - Click "Create Account" and sign up
3. **Select Favorite Teams** - Choose teams you want to follow
4. **View Dashboard** - See live matches and upcoming games
5. **Click on Matches** - View detailed match information

### Demo Credentials (Optional)

For testing without creating an account:
- **Email**: demo@example.com
- **Password**: demo123456

(Only works if you manually create this account in Supabase)

## Project Structure

```
cricket-match/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx          # Landing/home page
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # Signup page
│   │   ├── Dashboard.jsx        # Main dashboard with matches
│   │   ├── TeamPreferences.jsx   # Team selection page
│   │   ├── MatchDetails.jsx      # Detailed match view
│   │   └── *.css                # Page styles
│   ├── config/
│   │   ├── supabase.js          # Supabase configuration
│   │   └── cricketApi.js        # Cricket API integration
│   ├── App.jsx                  # Main app component with routing
│   ├── App.css                  # Global styles
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features in Detail

### Authentication
- Secure signup and login using Supabase Auth
- Password validation (minimum 6 characters)
- Session management and automatic redirect

### Favorite Teams
- Select from 13 major cricket teams
- Store preferences in Supabase database
- Quick access to team matches

### Match Display
- **Live Matches**: Real-time scores and updates
- **Upcoming Matches**: Scheduled matches for favorite teams
- **Past Matches**: Last 3 completed matches
- **Match Details**: Comprehensive match information

### Cricket Data
The app uses free cricket APIs for match data:
- Upcoming matches from cricketdata.com
- Completed matches from api.cricketdata.org
- Mock data for demonstration and fallback

## Customization

### Change Colors
Edit the gradient colors in CSS files:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Teams
Edit the teams list in `src/pages/TeamPreferences.jsx`:
```javascript
const [allTeams] = useState([
  'India',
  'Pakistan',
  // Add more teams...
])
```

### Update Cricket API
Replace API endpoints in `src/config/cricketApi.js` with your preferred service.

## Troubleshooting

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Supabase Connection Issues
1. Verify your `.env` file has correct credentials
2. Check internet connection
3. Ensure Supabase database tables are created
4. Check RLS policies allow your operations

### Authentication Errors
- Clear browser cookies and try again
- Check email is registered in Supabase
- Verify password is at least 6 characters

### Match Data Not Loading
1. Check internet connection
2. Cricket API might be temporarily down - mock data will be used
3. Verify your selected teams

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically

## API Integration

The app integrates with free cricket APIs:

**CricketData.com** - Used for upcoming and live match data
- Endpoint: `https://cricketdata.com/api/upcoming/`
- No authentication required

**Limited live features** - Real-time data updates every 30 seconds

For production with more features, consider:
- **RapidAPI Cricket APIs** - Professional cricket data
- **Cricket-Data.com** - Comprehensive statistics
- **Crickets Live** - Real-time score updates

## Future Enhancements

- 📱 Mobile app with React Native
- 🔔 Push notifications for match updates
- 💬 Live chat during matches
- 📊 Player statistics and analysis
- 🏆 Tournament tracking
- ⚙️ Advanced filtering and sorting

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review component documentation in code
3. Check Supabase documentation at https://supabase.com/docs

## Credits

- Built with React and Supabase
- Cricket data from CricketData APIs
- Icons and emojis for better UX

---

**Enjoy tracking your favorite cricket matches with Match Watch!** 🏏
