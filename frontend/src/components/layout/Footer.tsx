import { Film, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  const githubUrl =
    import.meta.env.VITE_GITHUB_URL ||
    'https://github.com/yourusername/moodcorn';

  return (
    <footer className="border-t border-white/5 bg-bg-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Film size={20} className="text-gold" />
            <span
              className="font-bold text-lg"
              style={{
                background: 'linear-gradient(90deg, #B8960C, #D4AF37, #E8C94A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MoodCorn
            </span>
            <span className="text-text-muted text-sm ml-1">&copy; {year}</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link
              to="/"
              className="hover:text-gold transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-gold transition-colors duration-200"
            >
              About
            </Link>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200"
            >
              <Github size={14} />
              GitHub
            </a>
          </div>

          {/* Attribution */}
          <p className="text-text-muted text-xs text-center">
            Data from{' '}
            <a
              href="https://datasets.imdbws.com"
              className="text-gold/80 hover:text-gold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              IMDb
            </a>{' '}
            &{' '}
            <a
              href="https://www.themoviedb.org"
              className="text-gold/80 hover:text-gold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TMDb
            </a>
            . Not affiliated with either.
          </p>
        </div>
      </div>
    </footer>
  );
}
