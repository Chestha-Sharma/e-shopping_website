import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const features = [
  { icon: '🚚', title: 'Free Delivery', text: 'On orders above ₹999' },
  { icon: '🔄', title: 'Easy Returns', text: '7-day return policy' },
  { icon: '🔒', title: 'Secure Payment', text: '100% safe checkout' },
  { icon: '🎧', title: '24/7 Support', text: 'We are here to help' },
];
const shopLinks = [
  { label: 'All Products', to: '/search' },
  { label: 'Beauty', to: '/search?category=Beauty' },
  { label: 'Fragrances', to: '/search?category=Fragrances' },
  { label: 'Furniture', to: '/search?category=Furniture' },
  { label: 'Groceries', to: '/search?category=Groceries' },
  { label: 'Home Decoration', to: '/search?category=Home%20Decoration' },
  { label: 'Kitchen Accessories', to: '/search?category=Kitchen%20Accessories' },
  { label: 'Laptops', to: '/search?category=Laptops' },
  { label: "Men's Shirts", to: '/search?category=Mens%20Shirts' },
  { label: "Men's Shoes", to: '/search?category=Mens%20Shoes' },
  { label: 'My Cart', to: '/cart' },
];

const accountLinks = [
  { label: 'Sign In', to: '/signin' },
  { label: 'Create Account', to: '/signup' },
  { label: 'My Profile', to: '/profile' },
  { label: 'Order History', to: '/orderhistory' },
];

const socials = [
  { label: 'Facebook', text: 'f', href: 'https://facebook.com' },
  { label: 'Instagram', text: 'in', href: 'https://instagram.com' },
  { label: 'Twitter', text: 'X', href: 'https://twitter.com' },
  { label: 'YouTube', text: '▶', href: 'https://youtube.com' },
];

const heading = {
  fontSize: 14,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 1,
  color: '#212529',
  paddingBottom: 8,
  marginBottom: 18,
  borderBottom: '2px solid #ffc107',
  display: 'inline-block',
};

const hoverCSS = `
  .ft-link { color: #495057; text-decoration: none; font-size: 14px; transition: all .2s; }
  .ft-link:hover { color: #d39e00; padding-left: 4px; }
  .ft-social { width: 36px; height: 36px; border-radius: 50%; background: #495057; color: #fff;
               display: flex; align-items: center; justify-content: center;
               font-weight: 700; font-size: 14px; text-decoration: none; transition: all .2s; }
  .ft-social:hover { background: #ffc107; color: #212529; transform: translateY(-3px); }
`;

function Footer() {
  const [email, setEmail] = useState('');

  const subscribeHandler = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer className="mt-5 text-start" style={{ backgroundColor: '#e9ecef', color: '#495057' }}>
      <style>{hoverCSS}</style>

      {/* Features strip */}
      <div style={{ backgroundColor: '#f1f3f5', borderBottom: '1px solid #ced4da' }}>
        <Container className="py-4">
          <Row xs={1} sm={2} lg={4} className="g-3">
            {features.map((f) => (
              <Col key={f.title} className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-white rounded-circle flex-shrink-0"
                  style={{ width: 48, height: 48, fontSize: 24, border: '1px solid #ced4da' }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="fw-semibold text-dark" style={{ fontSize: 14 }}>{f.title}</div>
                  <div className="text-secondary" style={{ fontSize: 12 }}>{f.text}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Main footer */}
      <Container className="py-5">
        <Row className="gy-4">
          {/* Brand */}
          <Col xs={12} lg={4}>
            <div className="fw-bold mb-3 text-dark" style={{ fontSize: 24, letterSpacing: 1 }}>
              E<span style={{ color: '#ffc107' }}>_</span>SHOPPING
            </div>
            <p className="mb-0 text-secondary" style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 360 }}>
              Your one-stop shop for quality products at the best prices. Fast
              delivery, secure payments and friendly support.
            </p>
            <div className="d-flex gap-2 mt-4">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                   aria-label={s.label} className="ft-social">
                  {s.text}
                </a>
              ))}
            </div>
          </Col>

          {/* Shop */}
          <Col xs={6} lg={2}>
            <div style={heading}>Shop</div>
            <ul className="list-unstyled m-0 d-flex flex-column gap-2">
              {shopLinks.map((l) => (
                <li key={l.label}><Link to={l.to} className="ft-link">{l.label}</Link></li>
              ))}
            </ul>
          </Col>

          {/* Account */}
          <Col xs={6} lg={2}>
            <div style={heading}>Account</div>
            <ul className="list-unstyled m-0 d-flex flex-column gap-2">
              {accountLinks.map((l) => (
                <li key={l.label}><Link to={l.to} className="ft-link">{l.label}</Link></li>
              ))}
            </ul>
          </Col>

          {/* Contact */}
          <Col xs={12} lg={4}>
            <div style={heading}>Contact Us</div>
            <ul className="list-unstyled m-0 d-flex flex-column gap-2" style={{ fontSize: 14 }}>
              <li className="d-flex gap-2"><span>📍</span><span>123, Main Market Road, Bhopal, Madhya Pradesh 462001</span></li>
              <li className="d-flex gap-2"><span>📞</span><a href="tel:+919876543210" className="ft-link">+91 98765 43210</a></li>
              <li className="d-flex gap-2"><span>✉️</span><a href="mailto:support@eshopping.com" className="ft-link">support@eshopping.com</a></li>
              <li className="d-flex gap-2"><span>🕒</span><span>Mon – Sat: 9:00 AM – 8:00 PM</span></li>
            </ul>

            <Form onSubmit={subscribeHandler} className="d-flex flex-column flex-sm-row gap-2 mt-4">
              <Form.Control
                type="email"
                size="sm"
                placeholder="Your email for offers"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="warning" size="sm" className="fw-semibold text-nowrap px-3">
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Bottom bar */}
      <div style={{ backgroundColor: '#dee2e6', fontSize: 13 }}>
        <Container className="py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <span>© {new Date().getFullYear()} E_SHOPPING. All rights reserved.</span>
          <span className="d-flex flex-wrap justify-content-center gap-4">
            <Link to="/" className="ft-link">Privacy Policy</Link>
            <Link to="/" className="ft-link">Terms of Service</Link>
            <Link to="/" className="ft-link">Refund Policy</Link>
          </span>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;