import "./footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="container">
        <div className="footerTop">
          <div className="footerBrand">
            <p className="footerLogo">
              Converge<span> 2026</span>
            </p>
            <p className="footerTagline">
              September 24–25, 2026 • San Francisco, CA
            </p>
          </div>

          <div className="footerCol">
            <p className="footerColTitle">Tracks</p>
            <ul className="footerLinks">
              <li>
                <a href="#" data-track="design">
                  Design Track
                </a>
              </li>
              <li>
                <a href="#" data-track="engineering">
                  Engineering Track
                </a>
              </li>
              <li>
                <a href="#" data-track="product">
                  Product Track
                </a>
              </li>
            </ul>
          </div>

          <div className="footerCol">
            <p className="footerColTitle">Event</p>
            <ul className="footerLinks">
              <li>
                <a href="#">Venue &amp; Travel</a>
              </li>
              <li>
                <a href="#">Speakers</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>

          <div className="footerCol">
            <p className="footerColTitle">Contact</p>
            <ul className="footerLinks">
              <li>
                <a href="mailto:akunwatachidiebere721@gmail.com">hello@converge2026.dev</a>
              </li>
              <li>
                <a href="#">Code of Conduct</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footerBottom">
          <p>© {year} Converge. All rights reserved.</p>
          <div className="footerSocial">
            <a href="#" aria-label="Converge on X">
              X
            </a>
            <a href="#" aria-label="Converge on LinkedIn">
              LinkedIn
            </a>
            <a href="#" aria-label="Converge on YouTube">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}