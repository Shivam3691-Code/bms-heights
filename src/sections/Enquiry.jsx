import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, Phone, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import Img from '../components/Img.jsx';
import { SectionHeading } from '../components/Ui.jsx';
import { PROJECT } from '../config/project.js';

const PREFERENCES = ['Studio', '1 BHK', '2 BHK Type 1', '2 BHK Type 2'];
const EMPTY = { name: '', phone: '', email: '', preference: '', message: '', consent: false, company: '' };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  const digits = v.phone.replace(/[^\d]/g, '');
  if (!digits) e.phone = 'Please enter your phone number.';
  else if (!/^(?:91)?[6-9]\d{9}$/.test(digits) && !(digits.length >= 8 && digits.length <= 15 && v.phone.trim().startsWith('+')))
    e.phone = 'Enter a valid 10-digit Indian mobile number, or an international number starting with +.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (!v.preference) e.preference = 'Please choose an apartment preference.';
  if (v.message.length > 1000) e.message = 'Please keep your message under 1000 characters.';
  if (!v.consent) e.consent = 'Please confirm we may contact you.';
  return e;
}

/** POSTs JSON to PROJECT.enquiryEndpoint when configured. Returns 'sent' | 'offline'. */
async function submitEnquiry(payload) {
  if (!PROJECT.enquiryEndpoint) return 'offline';
  const res = await fetch(PROJECT.enquiryEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return 'sent';
}

export default function Enquiry() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | offline | error
  const formRef = useRef(null);

  // Prefill from "Enquire about this apartment" buttons.
  useEffect(() => {
    const onPrefill = (e) => {
      const pref = e.detail?.preference;
      if (pref) setValues((v) => ({ ...v, preference: pref }));
      setTimeout(() => formRef.current?.querySelector('#f-name')?.focus({ preventScroll: true }), 900);
    };
    window.addEventListener('bms:prefill', onPrefill);
    return () => window.removeEventListener('bms:prefill', onPrefill);
  }, []);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const next = { ...values, [k]: val };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.company) return; // honeypot
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true, preference: true, message: true, consent: true });
    if (Object.keys(errs).length) {
      formRef.current.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    setStatus('sending');
    const payload = {
      project: PROJECT.name,
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      preference: values.preference,
      message: values.message.trim(),
      submittedAt: new Date().toISOString(),
    };
    try {
      setStatus(await submitEnquiry(payload));
    } catch {
      setStatus('error');
    }
  };

  const mailto = `mailto:${PROJECT.contact.email}?subject=${encodeURIComponent(
    `BMS Heights enquiry${values.preference ? ` — ${values.preference}` : ''}`,
  )}&body=${encodeURIComponent(
    `Name: ${values.name}\nPhone: ${values.phone}\nEmail: ${values.email}\nPreference: ${values.preference}\n\n${values.message}`,
  )}`;

  const field = (k) => ({
    id: `f-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    onBlur: blur(k),
    'aria-invalid': touched[k] && errors[k] ? 'true' : 'false',
    'aria-describedby': touched[k] && errors[k] ? `f-${k}-err` : undefined,
  });
  const err = (k) =>
    touched[k] && errors[k] ? (
      <span className="field__error" id={`f-${k}-err`}>
        {errors[k]}
      </span>
    ) : null;

  const waText = encodeURIComponent('Hello, I would like to know more about BMS Heights, Greater Noida.');

  return (
    <section id="contact" className="section enquiry" aria-labelledby="enq-title">
      <div className="enquiry__bg" aria-hidden="true">
        <div data-parallax="-10">
          <Img name="facadeEvening" sizes="100vw" width={2000} tag={false} />
        </div>
      </div>
      <div className="container enquiry__grid">
        <div className="enquiry__intro">
          <SectionHeading index="09" eyebrow="Enquire" id="enq-title" inverse lines={['Your new address', 'starts here.']} />
          <p className="lead" data-reveal>
            Share a few details and the SKD Developers team will get back to you about availability, pricing and site visits.
          </p>
          <ul className="contact-list" data-reveal>
            <li>
              <Mail size={18} aria-hidden="true" />
              <a href={`mailto:${PROJECT.contact.email}`}>{PROJECT.contact.email}</a>
            </li>
            <li>
              <Phone size={18} aria-hidden="true" />
              {PROJECT.contact.phone ? (
                <a href={`tel:${PROJECT.contact.phone}`}>{PROJECT.contact.phone}</a>
              ) : (
                <span className="muted">Sales number to be announced</span>
              )}
            </li>
            <li>
              <MessageCircle size={18} aria-hidden="true" />
              {PROJECT.contact.whatsapp ? (
                <a href={`https://wa.me/${PROJECT.contact.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
                  Enquire on WhatsApp
                </a>
              ) : (
                <span className="muted">WhatsApp enquiries — number to be announced</span>
              )}
            </li>
          </ul>
        </div>

        <form className="form" ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-note" data-reveal>
          {status === 'sent' || status === 'offline' ? (
            <div className="form__done" role="status">
              <CheckCircle2 size={36} aria-hidden="true" />
              {status === 'sent' ? (
                <>
                  <h3>Thank you, {values.name.split(' ')[0]}.</h3>
                  <p>Your request has been received. Our team will call you back shortly.</p>
                </>
              ) : (
                <>
                  <h3>Almost there, {values.name.split(' ')[0]}.</h3>
                  <p>
                    Your details look good, but online submission isn&rsquo;t connected yet — nothing has been sent. Please
                    send them to our team by email to request your call back.
                  </p>
                  <a className="btn btn--gold" href={mailto}>
                    <Mail size={16} aria-hidden="true" /> Send by email
                  </a>
                </>
              )}
              <button type="button" className="btn btn--line" onClick={() => { setStatus('idle'); setValues(EMPTY); setTouched({}); setErrors({}); }}>
                Start a new enquiry
              </button>
            </div>
          ) : (
            <>
              <div className="form__row">
                <div className="field">
                  <label htmlFor="f-name">Full name</label>
                  <input type="text" autoComplete="name" required {...field('name')} />
                  {err('name')}
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Phone number</label>
                  <input type="tel" inputMode="tel" autoComplete="tel" required {...field('phone')} />
                  {err('phone')}
                </div>
              </div>
              <div className="form__row">
                <div className="field">
                  <label htmlFor="f-email">Email address</label>
                  <input type="email" autoComplete="email" required {...field('email')} />
                  {err('email')}
                </div>
                <div className="field">
                  <label htmlFor="f-preference">Apartment preference</label>
                  <select required {...field('preference')}>
                    <option value="" disabled>
                      Select a residence
                    </option>
                    {PREFERENCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {err('preference')}
                </div>
              </div>
              <div className="field">
                <label htmlFor="f-message">
                  Message <span className="muted">(optional)</span>
                </label>
                <textarea rows={3} maxLength={1000} {...field('message')} />
                {err('message')}
              </div>
              <div className="field field--hp" aria-hidden="true">
                <label htmlFor="f-company">Company</label>
                <input id="f-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set('company')} />
              </div>
              <div className="field field--check">
                <input type="checkbox" id="f-consent" checked={values.consent} onChange={set('consent')} onBlur={blur('consent')} aria-invalid={touched.consent && errors.consent ? 'true' : 'false'} aria-describedby={touched.consent && errors.consent ? 'f-consent-err' : undefined} />
                <label htmlFor="f-consent">I agree to be contacted by SKD Developers about BMS Heights.</label>
                {err('consent')}
              </div>

              {status === 'error' && (
                <p className="form__alert" role="alert">
                  <AlertCircle size={16} aria-hidden="true" /> We couldn&rsquo;t send your request. Please try again or email{' '}
                  <a href={mailto}>{PROJECT.contact.email}</a>.
                </p>
              )}

              <button type="submit" className="btn btn--gold btn--block" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Request a call back'} <ArrowRight size={16} aria-hidden="true" />
              </button>
              <p className="fineprint" id="form-note">
                Your details are used only to respond to this enquiry.
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
