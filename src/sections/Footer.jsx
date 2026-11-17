import { ArrowUp, Mail, Globe, MapPin } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { NAV_LINKS, PROJECT } from '../config/project.js';
import { scrollToId } from '../lib/motion.js';

export default function Footer() {
  const go = (e, id) => {
    e.preventDefault();
    scrollToId(id);
  };
  const year = new Date().getFullYear();

  return (
    <footer className="footer is-dark">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo inverse />
            <p className="footer__tag">{PROJECT.tagline}.</p>
          </div>
          <a href="#home" className="footer__top-btn" onClick={(e) => go(e, 'home')}>
            Back to top <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="footer__cols">
          <nav aria-label="Footer">
            <h2 className="kicker">Navigate</h2>
            <ul>
              {NAV_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => go(e, id)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="kicker">The Project</h2>
            <ul>
              <li>Studio apartments</li>
              <li>1 BHK apartments</li>
              <li>2 BHK Type 01 — 1120 Sq. Ft.</li>
              <li>2 BHK Type 02 — 1090 Sq. Ft.</li>
            </ul>
          </div>

          <div>
            <h2 className="kicker">Visit</h2>
            <address className="footer__address">
              <MapPin size={16} aria-hidden="true" />
              <span>
                {PROJECT.address.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
            </address>
          </div>

          <div>
            <h2 className="kicker">Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${PROJECT.contact.email}`}>
                  <Mail size={15} aria-hidden="true" /> {PROJECT.contact.email}
                </a>
              </li>
              <li>
                <a href={PROJECT.contact.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Globe size={15} aria-hidden="true" /> {PROJECT.contact.website}
                </a>
              </li>
            </ul>
            <ul className="footer__social" aria-label="Social media">
              {PROJECT.social.map((s) =>
                s.href ? (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ) : (
                  <li key={s.label}>
                    <span className="footer__social-ph" title="Link coming soon">
                      {s.label}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="footer__giant" aria-hidden="true">
          BMS Heights
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {PROJECT.developer}. All rights reserved.
          </p>
          <p className="footer__legal">
            <a href="#privacy" onClick={(e) => e.preventDefault()} aria-disabled="true" title="Privacy policy to be published">
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <span>Images are illustrative. Plans are conceptual. Specifications as listed in the project brochure.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
