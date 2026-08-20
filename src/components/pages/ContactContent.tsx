'use client';

/* Migrated from the legacy src/content/contact.html fragment. */

import { useState, type FormEvent } from 'react';

export function ContactContent() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus('error');
        setErrorMsg(json.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  }

  return (
    <>
      <main className="contact-page relative isolate overflow-x-clip">



          <section className="contact-hero">

              <div className="contact-hero-image">
                  <img
                      src="/assets/images/optimized/contact/contact-hero-desktop.webp"
                      srcSet="/assets/images/optimized/contact/contact-hero-mobile.webp 700w, /assets/images/optimized/contact/contact-hero-desktop.webp 1600w"
                      sizes="100vw"
                      alt=""
                      width="1600"
                      height="1067"
                      decoding="async"
                      fetchPriority="high"
                  />
              </div>

              <div className="contact-hero-overlay"></div>

              <div className="contact-hero-glow contact-hero-glow-a"></div>
              <div className="contact-hero-glow contact-hero-glow-b"></div>


              <div className="contact-container contact-hero-content">

                  <div className="contact-intro">

                      <div className="contact-label">
                          <span></span>
                          CONTACT US
                      </div>


                      <div className="contact-heading-row">

                          <h1>
                              Get in<br />
                              <span>
                                  Touch<span className="contact-period">.</span>
                              </span>
                          </h1>


                          <div className="contact-intro-divider"></div>


                          <p>
                              We are here to answer your questions,<br />
                              discuss your projects, and provide<br />
                              the best engineering solutions for your<br />
                              business.
                          </p>

                      </div>

                  </div>

              </div>

          </section>





          <section className="contact-content">

              <div className="contact-container contact-grid">




                  <article className="contact-card contact-information">

                      <h2>
                          Contact Information
                      </h2>


                      <div className="contact-info-list">


                          {/* ADDRESS */}

                          <div className="contact-info-item">

                              <a className="contact-icon contact-icon-btn" href="https://maps.app.goo.gl/em1TghayvmybhTAb7" target="_blank" rel="noopener noreferrer" aria-label="Open Abdelhamid Engineering Industries location in Google Maps">

                                  <svg viewBox="0 0 24 24">

                                      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />

                                      <circle cx="12" cy="9" r="2.4" />

                                  </svg>

                              </a>


                              <div className="contact-info-copy">

                                  <h3>
                                      Address
                                  </h3>

                                  <p>
                                      <a 
                                          href="https://maps.app.goo.gl/em1TghayvmybhTAb7" 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          style={{ color: 'inherit', textDecoration: 'none' }}
                                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                      >
                                          Industrial Zone C5, Plot # 1 &amp; 2,<br />
                                          P.O. Box: 167, Tenth of Ramadan City,<br />
                                          Egypt.
                                      </a>
                                  </p>

                              </div>

                          </div>



                          {/* TELEPHONE */}

                          <div className="contact-info-item">

                              <div className="contact-icon" aria-hidden="true">

                                  <svg viewBox="0 0 24 24">

                                      <path d="M7.2 3.8 4.8 5.4c-.8.5-1.1 1.5-.7 2.4 2.5 5.8 6.3 9.6 12.1 12.1.9.4 1.9.1 2.4-.7l1.6-2.4c.4-.6.2-1.5-.4-1.9l-3.4-2.2c-.6-.4-1.4-.3-1.9.2l-1.4 1.4c-2.3-1.2-4.1-3-5.3-5.3l1.4-1.4c.5-.5.6-1.3.2-1.9L9.1 4.2c-.4-.6-1.3-.8-1.9-.4Z" />

                                  </svg>

                              </div>


                              <div className="contact-info-copy">

                                  <h3>
                                      Tel
                                  </h3>

                                  <p>
                                      +20 55 44 88 524&nbsp;&nbsp;,&nbsp;&nbsp;
                                      +20 55 44 88 525
                                  </p>

                              </div>

                          </div>



                          {/* MOBILE */}

                          <div className="contact-info-item">

                              <div className="contact-icon" aria-hidden="true">

                                  <svg viewBox="0 0 24 24">

                                      <rect x="7" y="2.8" width="10" height="18.4" rx="2" />

                                      <path d="M10 5h4" />

                                      <circle cx="12" cy="18.1" r=".8" />

                                  </svg>

                              </div>


                              <div className="contact-info-copy">

                                  <h3>
                                      Mobile
                                  </h3>

                                  <p>
                                      +20 100 148 57 88
                                  </p>

                              </div>

                          </div>



                          {/* FAX */}

                          <div className="contact-info-item">

                              <div className="contact-icon" aria-hidden="true">

                                  <svg viewBox="0 0 24 24">

                                      <path d="M6 3.5h8l4 4V20.5H6z" />

                                      <path d="M14 3.5v4h4" />

                                      <path d="M9 12h6M9 15h6M9 18h4" />

                                  </svg>

                              </div>


                              <div className="contact-info-copy">

                                  <h3>
                                      Fax
                                  </h3>

                                  <p>
                                      +20 55 44 88 523
                                  </p>

                              </div>

                          </div>



                          {/* EMAIL */}

                          <div className="contact-info-item">

                              <div className="contact-icon" aria-hidden="true">

                                  <svg viewBox="0 0 24 24">

                                      <rect x="3" y="5" width="18" height="14" rx="2" />

                                      <path d="m4.5 7 7.5 6 7.5-6" />

                                  </svg>

                              </div>


                              <div className="contact-info-copy">

                                  <h3>
                                      Email
                                  </h3>

                                  <p>

                                      <a href="mailto:info@abdelhamid.co">
                                          info@abdelhamid.co
                                      </a>

                                  </p>

                              </div>

                          </div>


                      </div>

                  </article>





                  <article className="contact-card contact-message">


                      {/* Decorative Ripple */}

                      <div className="contact-ripples" aria-hidden="true">

                          <span className="ripple ripple-1"></span>

                          <span className="ripple ripple-2"></span>

                          <span className="ripple ripple-3"></span>

                          <span className="ripple ripple-4"></span>

                          <span className="ripple-dot"></span>

                      </div>


                      <h2 id="contact-form-heading">
                          Send Us a Message
                      </h2>



                      {status === 'success' && (
                          <div className="contact-form-status contact-form-success" role="status">
                              <strong>✓ Message sent successfully!</strong>
                              <p>Thank you for reaching out. We will get back to you shortly.</p>
                          </div>
                      )}

                      {status === 'error' && (
                          <div className="contact-form-status contact-form-error" role="alert">
                              <strong>✕ {errorMsg}</strong>
                          </div>
                      )}

                      {status !== 'success' && (
                      <form className="contact-form" onSubmit={handleSubmit} aria-labelledby="contact-form-heading">

                          <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                              <label htmlFor="contact-website">Website</label>
                              <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                          </div>


                          {/* NAME + COMPANY */}

                          <div className="contact-form-row">

                              <label htmlFor="contact-full-name">

                                  <span className="sr-only">
                                      Full Name
                                  </span>

                                  <input id="contact-full-name" type="text" name="full_name" placeholder="Full Name" autoComplete="name" defaultValue="" required={true} />


                              </label>


                              <label htmlFor="contact-company-name">

                                  <span className="sr-only">
                                      Company Name
                                  </span>

                                  <input id="contact-company-name" type="text" name="company_name" placeholder="Company Name" autoComplete="organization" defaultValue="" />


                              </label>

                          </div>



                          {/* EMAIL + PHONE */}

                          <div className="contact-form-row">

                              <label htmlFor="contact-email">

                                  <span className="sr-only">
                                      Email Address
                                  </span>

                                  <input id="contact-email" type="email" name="email" placeholder="Email Address" autoComplete="email" defaultValue="" required={true} />


                              </label>


                              <label htmlFor="contact-phone">

                                  <span className="sr-only">
                                      Phone Number
                                  </span>

                                  <input id="contact-phone" type="tel" name="phone" placeholder="Phone Number" autoComplete="tel" defaultValue="" />


                              </label>

                          </div>



                          {/* SUBJECT */}

                          <label htmlFor="contact-subject">

                              <span className="sr-only">
                                  Subject
                              </span>

                              <input id="contact-subject" type="text" name="subject" placeholder="Subject" defaultValue="" required={true} />


                          </label>



                          {/* MESSAGE */}

                          <label htmlFor="contact-message">

                              <span className="sr-only">
                                  Your Message
                              </span>

                              <textarea id="contact-message" name="message" placeholder="Your Message" required={true}></textarea>


                          </label>



                          {/* SUBMIT */}

                          <button type="submit" className="contact-submit" disabled={status === 'sending'}>

                              <span>
                                  {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                              </span>

                              <span className="contact-submit-arrow" aria-hidden="true">
                                  {status === 'sending' ? '⟳' : '→'}
                              </span>

                          </button>


                      </form>
                      )}

                  </article>


              </div>

          </section>

      </main>
    </>
  );
}
