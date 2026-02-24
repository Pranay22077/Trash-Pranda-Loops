import { Twitter, Github, MessageCircle } from 'lucide-react';

export function Footer() {
  const gameLinks = ['How to Play', 'Features', 'Leaderboard', 'Updates'];
  const resourceLinks = ['Documentation', 'API', 'GitHub', 'Report Bug'];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

  return (
    <footer id="about" className="bg-[var(--bg-primary)] border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-2xl">
                🦝
              </div>
              <span className="font-[var(--font-heading)] font-bold text-xl text-[var(--text-primary)]">
                Trash Panda Loops
              </span>
            </div>
            <p className="text-[var(--text-secondary)] mb-6">
              The ultimate raccoon heist game
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-elevated)] transition-all duration-300"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-elevated)] transition-all duration-300"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-elevated)] transition-all duration-300"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Game Column */}
          <div>
            <h3 className="font-[var(--font-heading)] font-semibold text-[var(--text-primary)] mb-4">
              Game
            </h3>
            <ul className="space-y-3">
              {gameLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-[var(--font-heading)] font-semibold text-[var(--text-primary)] mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-[var(--font-heading)] font-semibold text-[var(--text-primary)] mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © 2024 Trash Panda Loops. All rights reserved.
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            Made with ❤️ by Game Developers
          </p>
        </div>
      </div>
    </footer>
  );
}
