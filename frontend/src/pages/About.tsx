import { motion } from 'framer-motion';
import { Github, Database, Code, Film, Brain, Star, Layers } from 'lucide-react';

const moodSystem = [
  { mood: '😊 Happy', genres: 'Comedy (10), Adventure (8), Family (8), Animation (8), Fantasy (7)' },
  { mood: '😢 Sad', genres: 'Drama (10), Romance (9), Biography (7), Family (6)' },
  { mood: '🤩 Excited', genres: 'Action (10), Thriller (9), Adventure (9), Sci-Fi (8), Crime (7)' },
  { mood: '😌 Relaxed', genres: 'Family (10), Comedy (9), Animation (8), Documentary (7)' },
  { mood: '❤️ Romantic', genres: 'Romance (10), Drama (8), Comedy (6)' },
  { mood: '😱 Scared', genres: 'Horror (10), Thriller (9), Mystery (9), Crime (7)' },
  { mood: '🤔 Curious', genres: 'Mystery (10), Documentary (9), Sci-Fi (8), History (7)' },
  { mood: '💪 Motivated', genres: 'Biography (10), Sport (10), History (8), Drama (8)' },
  { mood: '🥺 Emotional', genres: 'Drama (10), Romance (9), Family (8), Biography (8)' },
  { mood: '🧭 Adventurous', genres: 'Adventure (10), Fantasy (9), Action (8), Sci-Fi (8)' },
  { mood: '🌀 Mind-Bending', genres: 'Sci-Fi (10), Mystery (9), Thriller (8), Fantasy (7)' },
  { mood: '🕰️ Nostalgic', genres: 'Family (10), Drama (8), Comedy (7), Animation (7)' },
];

const techStack = [
  { name: 'React 18', desc: 'Frontend UI library', emoji: '⚛️', category: 'Frontend' },
  { name: 'Vite', desc: 'Build tool & dev server', emoji: '⚡', category: 'Frontend' },
  { name: 'Tailwind CSS v3', desc: 'Utility-first CSS', emoji: '🎨', category: 'Frontend' },
  { name: 'Framer Motion', desc: 'Animation library', emoji: '🎭', category: 'Frontend' },
  { name: 'Zustand', desc: 'Lightweight state mgmt', emoji: '🐻', category: 'Frontend' },
  { name: 'React Router v6', desc: 'Client-side routing', emoji: '🔀', category: 'Frontend' },
  { name: 'FastAPI', desc: 'Python web framework', emoji: '🚀', category: 'Backend' },
  { name: 'MongoDB Atlas', desc: 'Cloud NoSQL database', emoji: '🍃', category: 'Backend' },
  { name: 'Motor', desc: 'Async MongoDB driver', emoji: '🔌', category: 'Backend' },
  { name: 'Pandas / NumPy', desc: 'Data processing', emoji: '📊', category: 'Backend' },
  { name: 'TMDb API', desc: 'Posters & metadata', emoji: '🎞️', category: 'Data' },
  { name: 'IMDb Datasets', desc: 'Ratings & title data', emoji: '⭐', category: 'Data' },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function About() {
  const githubUrl =
    import.meta.env.VITE_GITHUB_URL ||
    'https://github.com/yourusername/moodcorn';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 space-y-20">

        {/* Hero */}
        <motion.section {...fadeIn} className="text-center">
          <h1
            className="text-4xl md:text-5xl font-black mb-4"
            style={{
              background: 'linear-gradient(90deg, #B8960C, #D4AF37, #E8C94A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            About MoodCorn
          </h1>
          <div className="section-divider mt-4" />
          <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            A mood-based recommendation platform for movies, TV series, and
            anime — built with transparent, explainable, rule-based scoring.
          </p>
        </motion.section>

        {/* What is MoodCorn */}
        <motion.section {...fadeIn} className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <Film size={24} className="text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-white">What is MoodCorn?</h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              MoodCorn is a content discovery platform that matches you with
              movies, TV series, and anime based on how you feel right now.{' '}
              <strong className="text-white">No accounts. No tracking. No subscription.</strong>
            </p>
            <p>
              Instead of relying on black-box machine learning, MoodCorn uses a{' '}
              <strong className="text-white">
                transparent, deterministic scoring engine
              </strong>{' '}
              that you can fully understand. Every recommendation includes a
              clear explanation of why it was suggested, your match percentage,
              and a per-mood compatibility breakdown.
            </p>
            <p>
              Data is sourced from{' '}
              <strong className="text-white">IMDb</strong> (ratings, titles,
              genres) and enriched with posters and overviews from{' '}
              <strong className="text-white">
                The Movie Database (TMDb)
              </strong>
              .
            </p>
          </div>
        </motion.section>

        {/* How the Engine Works */}
        <motion.section {...fadeIn}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <Brain size={24} className="text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              How the Recommendation Engine Works
            </h2>
          </div>
          <div className="glass-card p-8 space-y-6">
            <p className="text-text-muted">
              MoodCorn uses a deterministic weighted scoring formula. Every
              title receives a score based on five factors, and the top 20
              highest-scoring titles are returned as your recommendations.
            </p>

            {/* Formula */}
            <div
              className="p-6 rounded-2xl font-mono text-sm overflow-x-auto"
              style={{
                background: '#0D0D0D',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
            >
              <p className="text-gold font-bold mb-3 font-sans text-base">
                Final Score Formula
              </p>
              <div className="space-y-1 text-white">
                <p>
                  FinalScore ={' '}
                  <span className="text-gold">(MoodScore × 0.45)</span>
                </p>
                <p>
                  {'           '}+{' '}
                  <span className="text-blue-400">(GenreScore × 0.25)</span>
                </p>
                <p>
                  {'           '}+{' '}
                  <span className="text-green-400">(RatingScore × 0.15)</span>
                </p>
                <p>
                  {'           '}+{' '}
                  <span className="text-purple-400">
                    (PopularityScore × 0.10)
                  </span>
                </p>
                <p>
                  {'           '}+{' '}
                  <span className="text-pink-400">(RecencyScore × 0.05)</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: 'Mood Score (45%)',
                  color: 'text-gold',
                  desc: "How well the title's genres match your selected mood(s) based on predefined genre weight tables.",
                },
                {
                  label: 'Genre Score (25%)',
                  color: 'text-blue-400',
                  desc: 'Direct match to your selected genre preference. 1.0 if matched, 0.5 if no genre selected (neutral).',
                },
                {
                  label: 'Rating Score (15%)',
                  color: 'text-green-400',
                  desc: 'Normalized IMDb average rating on a 1–10 scale.',
                },
                {
                  label: 'Popularity Score (10%)',
                  color: 'text-purple-400',
                  desc: 'Normalized IMDb vote count using logarithmic scale to avoid extreme bias toward blockbusters.',
                },
                {
                  label: 'Recency Score (5%)',
                  color: 'text-pink-400',
                  desc: 'How recent the title is, normalized across the 1970–2025 range.',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className={`font-semibold mb-1 ${item.color}`}>
                    {item.label}
                  </p>
                  <p className="text-text-muted text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-text-muted text-sm">
              The engine fetches up to{' '}
              <strong className="text-white">3,000 candidate titles</strong>{' '}
              from MongoDB (pre-filtered by your type and filter selections),
              scores each one in Python, and returns the{' '}
              <strong className="text-white">top 20</strong> sorted by Final
              Score.
            </p>
          </div>
        </motion.section>

        {/* Mood System */}
        <motion.section {...fadeIn}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <Star size={24} className="text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-white">Mood System</h2>
          </div>
          <p className="text-text-muted mb-6">
            Each mood maps to specific genres with influence weights (shown in
            parentheses, max 10):
          </p>
          <div
            className="overflow-auto rounded-2xl"
            style={{ border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    borderBottom: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  <th className="text-left px-6 py-4 text-gold font-semibold">
                    Mood
                  </th>
                  <th className="text-left px-6 py-4 text-gold font-semibold">
                    Genre Weights
                  </th>
                </tr>
              </thead>
              <tbody>
                {moodSystem.map((row, i) => (
                  <tr
                    key={row.mood}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background:
                        i % 2 === 0
                          ? 'rgba(255,255,255,0.01)'
                          : 'transparent',
                    }}
                  >
                    <td className="px-6 py-4 text-white font-medium whitespace-nowrap">
                      {row.mood}
                    </td>
                    <td className="px-6 py-4 text-text-muted">{row.genres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section {...fadeIn}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <Layers size={24} className="text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-white">Technology Stack</h2>
          </div>

          {(['Frontend', 'Backend', 'Data'] as const).map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {techStack
                  .filter((t) => t.category === category)
                  .map((tech) => (
                    <motion.div
                      key={tech.name}
                      whileHover={{ y: -2 }}
                      className="glass-card p-4 transition-all duration-200 hover:border-gold/40"
                    >
                      <div className="text-3xl mb-2">{tech.emoji}</div>
                      <p className="font-semibold text-white text-sm">
                        {tech.name}
                      </p>
                      <p className="text-text-muted text-xs mt-1">
                        {tech.desc}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </motion.section>

        {/* IMDb Attribution */}
        <motion.section {...fadeIn} className="glass-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <Database size={22} className="text-gold" />
            </div>
            <h2 className="text-xl font-bold text-white">Data Attribution</h2>
          </div>
          <div className="text-text-muted text-sm leading-relaxed space-y-3">
            <p>
              Title data, ratings, and genre information are sourced from the{' '}
              <a
                href="https://datasets.imdbws.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                IMDb Non-Commercial Datasets
              </a>
              . This information is used for non-commercial, educational
              purposes in accordance with{' '}
              <a
                href="https://www.imdb.com/interfaces/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                IMDb's terms and conditions
              </a>
              .
            </p>
            <p>
              Poster images, backdrops, and overviews are provided by{' '}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                The Movie Database (TMDb)
              </a>
              . MoodCorn is not endorsed or certified by TMDb.
            </p>
            <div
              className="flex items-start gap-3 p-4 rounded-xl mt-4"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <span className="text-gold text-lg mt-0.5">ℹ️</span>
              <p className="text-text-muted text-sm">
                MoodCorn stores a curated subset of top 50,000 IMDb titles in
                MongoDB Atlas. No user data is collected or stored. Posters are
                served directly from TMDb CDN.
              </p>
            </div>
          </div>
        </motion.section>

        {/* GitHub */}
        <motion.section {...fadeIn} className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <Code size={24} className="text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-white">Open Source</h2>
          </div>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">
            MoodCorn is open source. Browse the code, report issues, star the
            repo, or contribute.
          </p>
          <motion.a
            id="github-link-about"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 btn-cta"
          >
            <Github size={22} />
            View on GitHub
          </motion.a>
        </motion.section>

      </div>
    </div>
  );
}
