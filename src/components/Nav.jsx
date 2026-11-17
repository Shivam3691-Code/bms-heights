import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Logo from './Logo.jsx';
import { NAV_LINKS } from '../config/project.js';
import { scrollToId } from '../lib/motion.js';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Highlight the section currently in view.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="nav__inner">
        <a href="#home" className="nav__logo" onClick={(e) => go(e, 'home')} aria-label="BMS Heights — back to top">
          <Logo inverse={!scrolled && !open} compact />
        </a>

        <nav aria-label="Primary" className="nav__links">
          <ul>
            {NAV_LINKS.slice(0, -1).map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => go(e, id)}
                  className={`nav__link ${active === id ? 'is-active' : ''}`}
                  aria-current={active === id ? 'true' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className="btn btn--gold btn--sm nav__cta" onClick={(e) => go(e, 'contact')} data-cursor>
          Enquire <ArrowUpRight size={15} aria-hidden="true" />
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <ul>
          {NAV_LINKS.map(({ id, label }, i) => (
            <li key={id} style={{ '--i': i }}>
              <a href={`#${id}`} onClick={(e) => go(e, id)}>
                <span className="mobile-menu__num">{String(i + 1).padStart(2, '0')}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mobile-menu__foot">Studio · 1 BHK · 2 BHK — Greater Noida</p>
      </div>
    </header>
  );
}
