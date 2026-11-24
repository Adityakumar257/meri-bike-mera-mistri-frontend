import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../contexts/LanguageContext";
import { searchPath } from "../../utils/storeRoutes";
import "./MotorcycleStorefront.css";

const supportLinks = [
  ["Retailer Registration", "/signup"],
  ["GST & Billing Info", "/terms"],
  ["Shipping Policy", "/shipping-policy"],
  ["Return Policy", "/return"],
  ["Bulk Order Terms", "/bulkorder"],
];

const categoryLinks = [
  ["Engine & Transmission", searchPath("engine")],
  ["Brakes & Suspension", searchPath("brakes")],
  ["Filters & Oils", searchPath("filters")],
  ["Electricals & Batteries", searchPath("battery")],
  ["Two-Wheeler Accessories", searchPath("accessories")],
];

function Footer() {
  const [email, setEmail] = useState("");
  const { t } = useLanguage();

  const subscribe = (event) => {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!address) return;

    let subscribers;
    try {
      subscribers = JSON.parse(localStorage.getItem("mbmm_newsletter") || "[]");
      if (!Array.isArray(subscribers)) throw new Error("Stored newsletter list is invalid");
    } catch (error) {
      console.error("Could not read newsletter subscriptions:", error);
      toast.error(t("Unable to save your subscription. Please try again."));
      return;
    }

    if (subscribers.includes(address)) {
      toast.success(t("You’re already subscribed for updates."));
      return;
    }

    try {
      localStorage.setItem("mbmm_newsletter", JSON.stringify([...subscribers, address]));
    } catch (error) {
      console.error("Could not save newsletter subscription:", error);
      toast.error(t("Unable to save your subscription. Please try again."));
      return;
    }

    setEmail("");
    toast.success(t("Thanks! Your email is saved for the latest deals."));
  };

  return (
    <footer className="mbmm-footer">
      <div className="mbmm-footer-main">
        <div className="mbmm-footer-company">
          <Link to="/" className="mbmm-logo mbmm-footer-logo">
            <img className="mbmm-official-logo mbmm-footer-official-logo" src="/mbmm-logo.webp" alt="Meri Bike Mera Mistri — Bike Parts, Accessories & More" />
          </Link>
          <p>{t("Genuine two-wheeler spare parts, delivered to your doorstep. Ride better with parts you can trust.")}</p>
          <ul className="mbmm-contact-list">
            <li><MapPin size={16} /><span>Vardhman International, House No. D252, Sushant Lok II, Golf Course Road, Gurgaon - 122011, Haryana, India</span></li>
            <li><Phone size={16} /><a href="tel:+918506911777">+91 85069 11777</a></li>
            <li><Mail size={16} /><a href="mailto:brainytoys9@gmail.com">brainytoys9@gmail.com</a></li>
          </ul>
          <div className="mbmm-socials" aria-label="Social media">
            <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer"><Facebook size={16} /></a>
            <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram size={16} /></a>
            <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noreferrer"><Youtube size={16} /></a>
            <a href="https://wa.me/918506911777" aria-label="WhatsApp" target="_blank" rel="noreferrer"><span>WA</span></a>
          </div>
        </div>

        <div className="mbmm-footer-column">
          <h3>{t('Retailer Support')}</h3>
          {supportLinks.map(([label, path]) => <Link key={label} to={path}>{t(label)}</Link>)}
        </div>

        <div className="mbmm-footer-column">
          <h3>{t('Quick Categories')}</h3>
          {categoryLinks.map(([label, path]) => <Link key={label} to={path}>{t(label)}</Link>)}
        </div>

        <div className="mbmm-footer-column mbmm-payments">
          <h3>{t('Download & Pay')}</h3>
          <Link to="/category/all">{t('Download Price List')}</Link>
          <Link to="/category/all">{t('Download Catalog')}</Link>
          <p>{t('Secure payment options')}</p>
          <div className="mbmm-payment-badges" aria-label="Accepted payment methods">
            <span>UPI</span><span>VISA</span><span>Mastercard</span><span>RuPay</span>
          </div>
        </div>

        <div className="mbmm-footer-column mbmm-newsletter">
          <h3>{t('Subscribe for Updates')}</h3>
          <p>{t('Get the latest deals, new arrivals and offers in your inbox.')}</p>
          <form onSubmit={subscribe}>
            <label className="sr-only" htmlFor="mbmm-newsletter-email">{t('Your email address')}</label>
            <input id="mbmm-newsletter-email" type="email" placeholder={t('Enter your email')} value={email} onChange={(event) => setEmail(event.target.value)} required />
            <button type="submit">{t('Subscribe')}</button>
          </form>
        </div>
      </div>
      <div className="mbmm-footer-bottom">
        <span>© {new Date().getFullYear()} Meri Bike Mera Mistri. {t('All rights reserved.')}</span>
        <span>{t('Made for riders, mechanics & retailers.')}</span>
      </div>
    </footer>
  );
}

export default Footer;
