'use client';

/* Migrated from the legacy src/content/quote.html fragment. */

import { useState, type FormEvent } from 'react';

export function QuoteContent() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formData, // multipart — supports file uploads
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
      <main className="quote-page relative isolate overflow-x-clip">



          <section className="quote-hero">

              <div className="quote-hero-image">
                  <img
                      src="/assets/images/optimized/quote/quote-hero-desktop.webp"
                      srcSet="/assets/images/optimized/quote/quote-hero-mobile.webp 700w, /assets/images/optimized/quote/quote-hero-desktop.webp 1600w"
                      sizes="100vw"
                      alt=""
                      width="1536"
                      height="1024"
                      decoding="async"
                      fetchPriority="high"
                  />
              </div>

              <div className="quote-hero-overlay"></div>

              <div className="quote-hero-content">

                  <div className="quote-container">

                      <div className="quote-label">
                          <span></span>
                          REQUEST A QUOTE
                      </div>

                      <h1>
                          Tell us what<br />
                          you need.
                          <span>
                              We&apos;ll engineer<br />
                              the right solution.
                          </span>
                      </h1>

                      <p>
                          Share your project requirements with our engineering
                          team and we&apos;ll review your request and prepare
                          a quotation tailored to your needs.
                      </p>

                  </div>

              </div>

          </section>




          <section className="quote-section">

              <div className="quote-container">

                  <div className="quote-card">

                      {/* FORM HEADER */}


                      <div className="quote-card-header">

                          <div>
                              <span className="quote-card-label">
                                  REQUEST A QUOTE
                              </span>

                              <h2 id="quote-form-heading">
                                  Tell us about your project
                              </h2>

                              <p>
                                  Give us the details you have and our engineering
                                  team will take it from there.
                              </p>
                          </div>

                      </div>


                      {status === 'success' && (
                          <div className="contact-form-status contact-form-success" role="status">
                              <strong>✓ Quote request sent successfully!</strong>
                              <p>Our engineering team will review your request and contact you with the next steps.</p>
                          </div>
                      )}

                      {status === 'error' && (
                          <div className="contact-form-status contact-form-error" role="alert">
                              <strong>✕ {errorMsg}</strong>
                          </div>
                      )}

                      {status !== 'success' && (

                      <form className="quote-form" onSubmit={handleSubmit} encType="multipart/form-data" aria-labelledby="quote-form-heading">

                          <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                              <label htmlFor="quote-website">Website</label>
                              <input id="quote-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                          </div>

                          {/* ROW 1 */}

                          <div className="quote-form-row">

                              <div className="quote-field">

                                  <label htmlFor="quote-name">
                                      Your Name
                                  </label>

                                  <input id="quote-name" type="text" name="name" placeholder="Your full name" autoComplete="name" required={true} defaultValue="" />


                              </div>


                              <div className="quote-field">

                                  <label htmlFor="quote-company">
                                      Company Name
                                  </label>

                                  <input id="quote-company" type="text" name="company" placeholder="Your company name" autoComplete="organization" defaultValue="" />


                              </div>

                          </div>


                          {/* ROW 2 */}

                          <div className="quote-form-row">

                              <div className="quote-field">

                                  <label htmlFor="quote-email">
                                      Email Address
                                  </label>

                                  <input id="quote-email" type="email" name="email" placeholder="your@email.com" autoComplete="email" required={true} defaultValue="" />


                              </div>


                              <div className="quote-field">

                                  <label htmlFor="quote-phone">
                                      Phone Number
                                  </label>

                                  <input id="quote-phone" type="tel" name="phone" placeholder="+20 100 000 0000" autoComplete="tel" defaultValue="" />


                              </div>

                          </div>


                          {/* PROJECT / PRODUCT */}

                          <div className="quote-field">

                              <label htmlFor="quote-project">
                                  Project / Product
                              </label>

                              <input id="quote-project" type="text" name="project" placeholder="What are you looking to manufacture?" required={true} defaultValue="" />


                          </div>


                          {/* REQUIREMENTS */}

                          <div className="quote-field">

                              <label htmlFor="quote-requirements">
                                  Tell us about your requirements
                              </label>

                              <textarea id="quote-requirements" name="requirements" placeholder="Tell us anything you know about the project — dimensions, material, quantity, application, drawings, or any other requirements..." required={true}></textarea>


                          </div>


                          {/* FILE UPLOAD */}

                          <div className="quote-field">

                              <label id="quote-files-label">
                                  Upload Files
                                  <span className="quote-optional">
                                      OPTIONAL
                                  </span>
                              </label>

                              <label htmlFor="quote-files" className="quote-upload" id="quote-files-instructions">

                                  <div className="quote-upload-icon" aria-hidden="true">
                                      +
                                  </div>

                                  <div className="quote-upload-text">

                                      <strong id="quote-files-title">
                                          Add drawings, CAD files or images
                                      </strong>

                                      <span id="quote-files-description">
                                          Accepted: JPG/JPEG, PNG, PDF, DWG, DXF,
                                          STEP/STP and IGES/IGS. Maximum 5 files,
                                          10 MiB each and 25 MiB total.
                                      </span>

                                      <span id="quote-files-status" className="quote-file-selection-status" role="status" hidden={true}></span>

                                  </div>

                              </label>

                              <input id="quote-files" className="quote-file-input" type="file" name="files[]" aria-labelledby="quote-files-label quote-files-instructions" multiple={true} accept=".jpg,.jpeg,.png,.pdf,.dwg,.dxf,.step,.stp,.iges,.igs" aria-describedby="quote-files-label quote-files-instructions" />


                          </div>


                          {/* SUBMIT */}

                          <div className="quote-submit-area">

                              <div className="quote-submit-note">
                                  Our engineering team will review your request
                                  and contact you with the next steps.
                              </div>

                              <button type="submit" className="quote-submit" disabled={status === 'sending'}>

                                  <span>
                                      {status === 'sending' ? 'SENDING...' : 'REQUEST QUOTATION'}
                                  </span>

                                  <span className="quote-submit-arrow" aria-hidden="true">
                                      {status === 'sending' ? '⟳' : '→'}
                                  </span>

                              </button>

                          </div>

                      </form>

                      )}

                  </div>

              </div>

          </section>

      </main>
    </>
  );
}
