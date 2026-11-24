import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  ChevronDown,
  Headset,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { LanguageSwitcher, useLanguage } from "../../contexts/LanguageContext";
import { searchPath } from "../../utils/storeRoutes";
import "./MotorcycleStorefront.css";

const bikeBrands = ["Hero", "Honda", "Bajaj", "TVS", "Yamaha", "Suzuki", "Royal Enfield"];

const toSearchUrl = searchPath;

function Header() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (query) {
      navigate(toSearchUrl(query));
      setMobileOpen(false);
    }
  };

  const closeMenus = () => {
    setOpenMenu("");
    setMobileOpen(false);
  };

  const renderDropdown = (label, items) => (
    <div
      className={`mbmm-nav-item ${openMenu === label ? "is-open" : ""}`}
      onMouseEnter={() => setOpenMenu(label)}
      onMouseLeave={() => setOpenMenu("")}
    >
      <button
        className="mbmm-nav-trigger"
        type="button"
        aria-expanded={openMenu === label}
        onClick={() => setOpenMenu(openMenu === label ? "" : label)}
      >
        {t(label)}
        <ChevronDown size={14} />
      </button>
      <div className="mbmm-dropdown">
        {items.map((item) => {
          const href = toSearchUrl(item);
          return (
            <Link key={item} to={href} onClick={closeMenus}>
              {t(item)}
            </Link>
          );
        })}
        <Link className="mbmm-dropdown-all" to="/category/all" onClick={closeMenus}>
          {t('Browse all parts')}
        </Link>
      </div>
    </div>
  );

  return (
    <header className="mbmm-header">
      <div className="mbmm-topbar">
        <div className="mbmm-topbar-inner">
          <span><BadgeCheck size={14} /> {t('100% Genuine & OEM Spare Parts')}</span>
          <span>{t('All India Delivery')}</span>
          <span>{t('MOQ: 5 PCS Minimum')}</span>
          <a href="tel:+918506911777">+91 85069 11777</a>
          <a href="https://wa.me/918506911777" target="_blank" rel="noreferrer"><Headset size={14} /> {t('WhatsApp Support')}</a>
          <Link to="/signup">{t('Become a Retailer')} <i /> {t('Register')}</Link>
        </div>
      </div>

      <div className="mbmm-mainbar">
        <div className="mbmm-mainbar-inner">
          <Link to="/" className="mbmm-logo" aria-label="Meri Bike Mera Mistri home" onClick={closeMenus}>
            <img className="mbmm-official-logo" src="/mbmm-logo.webp" alt="Meri Bike Mera Mistri — Bike Parts, Accessories & More" />
          </Link>

          <form className="mbmm-search" onSubmit={submitSearch} role="search">
            <input
              aria-label={t('Search spare parts')}
              placeholder={t('Search by Part Number, Part Name or Bike Model...')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" aria-label="Search"><Search size={20} /></button>
          </form>

          <div className="mbmm-header-actions">
            <LanguageSwitcher className="mbmm-header-language" />
            <Link className="mbmm-action-button mbmm-login" to={isAuthenticated ? "/account" : "/login"}>
              <UserRound size={17} /> {isAuthenticated ? t('My Account') : t('Retailer Login')}
            </Link>
            {!isAuthenticated ? (
              <Link className="mbmm-action-button mbmm-bulk" to="/bulkorder">{t('Bulk Order')}</Link>
            ) : (
              <button className="mbmm-action-button mbmm-login" type="button" onClick={logout}>{t('Sign out')}</button>
            )}
            <Link className="mbmm-cart" to="/cart" aria-label={`Cart, ${getCartCount()} items`}>
              <ShoppingCart size={26} />
              <span>{getCartCount()}</span>
            </Link>
          </div>

          <button
            type="button"
            className="mbmm-mobile-toggle"
            aria-label={t(mobileOpen ? "Close menu" : "Open menu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <form className="mbmm-search mbmm-mobile-search" onSubmit={submitSearch} role="search">
          <input
            aria-label={t('Search spare parts')}
            placeholder={t('Search parts, brands or bike model...')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit" aria-label="Search"><Search size={19} /></button>
        </form>
      </div>

      <nav className={`mbmm-navigation ${mobileOpen ? "is-mobile-open" : ""}`} aria-label="Main navigation">
        <div className="mbmm-navigation-inner">
          <Link className="mbmm-home-link" to="/" onClick={closeMenus}>{t('Home')}</Link>
          {renderDropdown("Shop by Bike Brand", bikeBrands)}
          {renderDropdown("Engine Parts", ["Piston Kit", "Cylinder Kit", "Crankshaft", "Engine Valves"])}
          {renderDropdown("Brake & Clutch", ["Brake Shoe", "Brake Disc", "Clutch Plate", "Clutch Cable"])}
          {renderDropdown("Electricals", ["Battery", "Spark Plug", "Wiring Harness", "Indicators"])}
          {renderDropdown("Body & Lights", ["Headlight", "Tail Light", "Mirrors", "Body Panels"])}
          {renderDropdown("Lubricants & Oils", ["Engine Oil", "Chain Lubricant", "Brake Fluid"])}
          {renderDropdown("Tools & Garage Equipments", ["Mechanic Tools", "Workshop Equipment", "Safety Gear"])}
          <div className="mbmm-mobile-links">
            <Link to="/signup" onClick={closeMenus}>{t('Become a Retailer')}</Link>
            <Link to="/bulkorder" onClick={closeMenus}>{t('Bulk Order')}</Link>
            {isAuthenticated && <button type="button" onClick={() => { logout(); closeMenus(); }}>{t('Sign out')}</button>}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
