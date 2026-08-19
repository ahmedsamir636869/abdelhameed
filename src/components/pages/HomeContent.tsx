/* Migrated from the legacy src/content/home.html fragment. */

import { SiteLink } from '@/components/SiteLink';

export function HomeContent() {
  return (
    <>
      <main className="relative isolate overflow-x-clip">




          <section className="hero">

              {/* Background */}
              <div className="hero-background">

                  <img src="/assets/images/optimized/home/hero-desktop.webp" alt="" width="1600" height="944" loading="eager" fetchPriority="high" />

              </div>


              {/* Dark Overlay */}
              <div className="hero-overlay"></div>


              {/* Ambient Light */}
              <div className="hero-light hero-light-1"></div>
              <div className="hero-light hero-light-2"></div>


              {/* Content */}
              <div className="container">

                  <div className="hero-content">

                      <span className="hero-badge glass">
                          Since 1988 • Precision Engineering
                      </span>


                      <h1>
                          Engineering Excellence
                          <br />
                          Built for <span>Industry.</span>
                      </h1>


                      <p>

                          Abdelhamid Engineering Industries specializes in precision wire and metal components for household appliances, retail displays, and industrial applications, backed by advanced manufacturing capabilities and decades of experience.

                      </p>


                      <div className="hero-buttons">

                          <SiteLink href="products.php" className="btn btn-primary">

                              Explore Products

                          </SiteLink>

                      </div>

                  </div>

                  <div className="hero-stats">


                  {/* 01 — Experience */}

                  <div className="hero-stat glass">

                      <h2>
                          38+
                      </h2>

                      <span>
                          Years of Experience
                      </span>

                  </div>


                  {/* 02 — Projects */}

                  <div className="hero-stat glass">

                      <h2>
                          1000+
                      </h2>

                      <span>
                          Industrial Projects
                      </span>

                  </div>


                  {/* 03 — Countries */}

                  <div className="hero-stat glass">

                      <h2>
                          18
                      </h2>

                      <span>
                          Countries Served
                      </span>

                  </div>


                  {/* 04 — Project Value */}

                  <div className="hero-stat glass">

                      <h2>
                          $5M+
                      </h2>

                      <span>
                          Annual Turnover
                      </span>

                  </div>


                  {/* 05 — Regional Position */}

                  <div className="hero-stat glass">

                      <h2>
                          #Top 1
                      </h2>

                      <span>
                          Africa &amp; Middle East
                      </span>

                  </div>

                  </div>

              </div>

          </section>






          <section className="about-section">

              <div className="container">

                  <div className="about-grid">




                      <div className="about-content">

                          <span className="section-label">
                              About ABD-ELHAMID
                          </span>


                          <h2 className="about-title">

                              Engineering built

                              <span>
                                  around industry.
                              </span>

                          </h2>


                          <p className="about-description">

                              ABD-ELHAMID is a family-owned industrial
                              manufacturer with a legacy spanning more
                              than three decades. From our beginnings
                              in 1988 to our present 10,000 m² facility,
                              we have continuously evolved our
                              manufacturing capabilities to meet the
                              demands of modern industry.

                          </p>


                          <p className="about-description">

                              Our expertise covers a wide range of
                              precision wire components for household
                              appliances, retail and supermarket systems,
                              and specialized industrial applications.
                              With a production capacity exceeding
                              4,000 tons annually and a team of more than
                              200 qualified professionals, we combine
                              advanced facilities, consistent quality,
                              and dependable delivery to serve leading
                              manufacturers in Egypt and neighboring
                              markets.

                          </p>


                          <SiteLink href="about.php" className="about-link">

                              Discover Our Story

                              <span>
                                  →
                              </span>

                          </SiteLink>

                      </div>





                      <div className="about-visual">


                          {/* Main Glass Card */}

                          <div className="about-glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

                              <div className="about-card-number" style={{ width: '100%', textAlign: 'center', margin: '0' }}>
                                  38+
                              </div>


                              <div className="about-card-title" style={{ width: '100%', textAlign: 'center', margin: '0' }}>
                                  Years
                              </div>

                          </div>


                          {/* Decorative Orbits */}

                          <div className="about-orbit about-orbit-1"></div>

                          <div className="about-orbit about-orbit-2"></div>


                          {/* Small Glass Card */}

                          <div className="about-side-card">

                              <span>
                                  EST.
                              </span>

                              <strong>
                                  1988
                              </strong>

                              <small>
                                  Industrial Excellence
                              </small>

                          </div>

                      </div>

                  </div>

              </div>

          </section>






          <section className="capabilities-section">

              <div className="container">




                  <div className="capabilities-header">


                      <div>

                          <span className="section-label">
                              Our Capabilities
                          </span>


                          <h2 className="capabilities-title">

                              Engineered

                              <span>
                                  for industry.
                              </span>

                          </h2>

                      </div>

                      <div className="capabilities-intro">

                          <p>
                              From a first sketch to repeatable production, we build
                              precision wire solutions for the places people live,
                              shop, and work.
                          </p>

                          <SiteLink href="products.php#product-categories" className="capabilities-link">
                              Explore all products
                          </SiteLink>

                      </div>

                  </div>






                  <div className="capabilities-grid">




                      <SiteLink href="products.php#product-categories" className="capability-card capability-wire">

                          <img src="/assets/images/optimized/home-capabilities/wire-components-desktop.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" className="capability-image"  srcSet="/assets/images/optimized/home-capabilities/wire-components-mobile.webp 800w, /assets/images/optimized/home-capabilities/wire-components-desktop.webp 1600w" sizes="(max-width: 700px) 100vw, 50vw" />


                          <div className="capability-overlay"></div>


                          <div className="capability-number">
                              01
                          </div>


                          <div className="capability-content">

                              <span className="capability-category">
                                  PRECISION MANUFACTURING
                              </span>


                              <h3>
                                  Wire Components
                              </h3>


                              <p>
                                  Precision-formed wire components
                                  manufactured for demanding
                                  industrial applications.
                              </p>

                          </div>


                          <span className="capability-arrow" aria-hidden="true">
                              →
                          </span>

                      </SiteLink>






                      <SiteLink href="products.php#product-categories" className="capability-card capability-appliance">

                          <img src="/assets/images/optimized/home-capabilities/appliance-components-desktop.webp" alt="" width="1588" height="991" loading="lazy" decoding="async" className="capability-image"  srcSet="/assets/images/optimized/home-capabilities/appliance-components-mobile.webp 800w, /assets/images/optimized/home-capabilities/appliance-components-desktop.webp 1600w" sizes="(max-width: 700px) 100vw, 50vw" />


                          <div className="capability-overlay"></div>


                          <div className="capability-number">
                              02
                          </div>


                          <div className="capability-content">

                              <span className="capability-category">
                                  HOUSEHOLD APPLIANCES
                              </span>


                              <h3>
                                  Appliance Components
                              </h3>


                              <p>
                                  Engineered wire solutions designed
                                  for household appliance manufacturers.
                              </p>

                          </div>


                          <span className="capability-arrow" aria-hidden="true">
                              →
                          </span>

                      </SiteLink>






                      <SiteLink href="products.php#product-categories" className="capability-card capability-retail">

                          <img src="/assets/images/optimized/home-capabilities/retail-systems-desktop.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" className="capability-image"  srcSet="/assets/images/optimized/home-capabilities/retail-systems-mobile.webp 800w, /assets/images/optimized/home-capabilities/retail-systems-desktop.webp 1600w" sizes="(max-width: 700px) 100vw, 50vw" />


                          <div className="capability-overlay"></div>


                          <div className="capability-number">
                              03
                          </div>


                          <div className="capability-content">

                              <span className="capability-category">
                                  RETAIL &amp; SUPERMARKETS
                              </span>


                              <h3>
                                  Display &amp; Store Systems
                              </h3>


                              <p>
                                  Durable wire solutions for retail,
                                  supermarket, and display environments.
                              </p>

                          </div>


                          <span className="capability-arrow" aria-hidden="true">
                              →
                          </span>

                      </SiteLink>






                      <SiteLink href="products.php#product-categories" className="capability-card capability-custom">

                          <img src="/assets/images/optimized/home-capabilities/custom-industrial-desktop.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" className="capability-image"  srcSet="/assets/images/optimized/home-capabilities/custom-industrial-mobile.webp 800w, /assets/images/optimized/home-capabilities/custom-industrial-desktop.webp 1600w" sizes="(max-width: 700px) 100vw, 50vw" />


                          <div className="capability-overlay"></div>


                          <div className="capability-number">
                              04
                          </div>


                          <div className="capability-content">

                              <span className="capability-category">
                                  INDUSTRIAL APPLICATIONS
                              </span>


                              <h3>
                                  Custom Industrial Solutions
                              </h3>


                              <p>
                                  Specialized components engineered
                                  around specific production requirements.
                              </p>

                          </div>


                          <span className="capability-arrow" aria-hidden="true">
                              →
                          </span>

                      </SiteLink>


                  </div>

                  <div className="capabilities-swipe-hint" aria-hidden="true">
                      <span>Swipe to explore</span>
                      <span className="capabilities-swipe-track">
                          <span></span>
                      </span>
                  </div>

              </div>

          </section>


      </main>
    </>
  );
}
