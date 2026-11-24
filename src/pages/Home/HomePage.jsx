import { createElement, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileImage,
  Handshake,
  Headphones,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../contexts/LanguageContext";
import "../../components/layout/MotorcycleStorefront.css";
import { categoryPath, searchPath } from "../../utils/storeRoutes";

const brands = ["Hero", "Honda", "Bajaj", "TVS", "Yamaha", "Suzuki", "Royal Enfield"];

const categories = [
  { name: "Piston Kit", image: "photo-1486262715619-67b85e0b08d3", search: "piston kit" },
  { name: "Clutch Plate", image: "photo-1487754180451-c456f719a1fc", search: "clutch plate" },
  { name: "Brake Shoe", image: "photo-1558981806-ec527fa84c39", search: "brake shoe" },
  { name: "Chain Sprocket", image: "photo-1558981403-c5f9899a28bc", search: "chain sprocket" },
  { name: "Filters", image: "photo-1619642751034-765dfdf7c58e", search: "filter" },
  { name: "Headlight", image: "photo-1503376780353-7e6692767b70", search: "headlight" },
  { name: "Battery", image: "photo-1621905251918-48416bd8575a", search: "bike battery" },
  { name: "Engine Oil", image: "photo-1486262715619-67b85e0b08d3", search: "engine oil" },
];

const products = [
  { name: "Spark Plug", price: "₹250", image: "photo-1486262715619-67b85e0b08d3", meta: "For smoother starts" },
  { name: "Brake Disc", price: "₹850", image: "photo-1558981806-ec527fa84c39", meta: "Reliable stopping power" },
  { name: "Air Filter", price: "₹320", image: "photo-1619642751034-765dfdf7c58e", meta: "Clean airflow, better ride" },
  { name: "Chain Kit", price: "₹1,250", image: "photo-1558981403-c5f9899a28bc", meta: "Built for long rides" },
  { name: "Clutch Plate", price: "₹780", image: "photo-1487754180451-c456f719a1fc", meta: "Smooth gear changes" },
  { name: "Bike Battery", price: "₹1,850", image: "photo-1621905251918-48416bd8575a", meta: "Dependable power" },
];

const heroSlides = [
  {
    kicker: "THE PARTS YOU TRUST",
    title: "Ride better.\nLive better.",
    text: "Genuine bike parts at the right price, delivered across India.",
    image: "photo-1558981806-ec527fa84c39",
    action: "Shop spare parts",
  },
  {
    kicker: "BUILT FOR EVERY RIDE",
    title: "Your bike.\nOur best parts.",
    text: "Find the right fit for your bike from brands that keep you moving.",
    image: "photo-1486262715619-67b85e0b08d3",
    action: "Explore parts",
  },
  {
    kicker: "RETAILER & WORKSHOP DEALS",
    title: "More parts.\nBetter margins.",
    text: "Stock up with special bulk pricing and dependable dispatch.",
    image: "photo-1487754180451-c456f719a1fc",
    action: "Order in bulk",
    bulk: true,
  },
];

const features = [
  { title: "100% Genuine Parts", detail: "Quality checked for peace of mind", Icon: ShieldCheck },
  { title: "Direct from Manufacturer", detail: "Trusted sourcing, better value", Icon: Handshake },
  { title: "48 Hr Dispatch", detail: "Quick processing on stocked items", Icon: Truck },
  { title: "Easy Return Policy", detail: "Simple support when you need it", Icon: RefreshCw },
  { title: "Special B2B Discount", detail: "Better rates for every retailer", Icon: CircleDollarSign },
];

const trustedBrands = ["BOSCH", "EXIDE", "Castrol", "MINDA", "ENDURANCE", "LUMAX", "NGK"];
const fallbackImage = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80";

const imageUrl = (id, width = 900, height = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=85`;
const searchUrl = searchPath;

function PartImage({ id, alt, className = "", hero = false, priority = false }) {
  const height = hero ? 1080 : 720;
  const widths = hero ? [768, 1280, 1920] : [480, 800, 1200];
  return (
    <img
      className={className}
      src={imageUrl(id, hero ? 1920 : 900, height)}
      srcSet={widths.map((width) => `${imageUrl(id, width, height)} ${width}w`).join(", ")}
      sizes={hero ? "100vw" : "(max-width: 640px) 85vw, (max-width: 1100px) 40vw, 280px"}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallbackImage;
      }}
    />
  );
}

function SectionHeading({ title, subtitle, link }) {
  const { t } = useLanguage();
  return (
    <div className="mbmm-section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {link && <Link to={link}>{t('View all')} <ArrowRight size={15} /></Link>}
    </div>
  );
}

function HorizontalControls({ onPrevious, onNext, label }) {
  const { t } = useLanguage();
  return (
    <div className="mbmm-slider-controls">
      <button type="button" onClick={onPrevious} aria-label={`${t('Previous')} ${label}`}><ChevronLeft size={18} /></button>
      <button type="button" onClick={onNext} aria-label={`${t('Next')} ${label}`}><ChevronRight size={18} /></button>
    </div>
  );
}

function HomePage() {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const brandRail = useRef(null);
  const categoryRail = useRef(null);
  const productRail = useRef(null);
  const uploadInput = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  const scrollRail = (rail, direction) => {
    rail.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  const findPart = (event) => {
    event.preventDefault();
    const query = [brand, model, category].filter(Boolean).join(" ");
    navigate(searchUrl(query));
  };

  const selectUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("Please choose a file smaller than 10 MB."));
      event.target.value = "";
      return;
    }
    setUploadFile(file);
    toast.success(t("Your list is ready to attach to a bulk enquiry."));
  };

  const activeHero = heroSlides[activeSlide];

  return (
    <div className="mbmm-storefront">
      <section className="mbmm-hero" aria-label="Featured offers">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`mbmm-hero-slide ${index === activeSlide ? "is-active" : ""}`}
            aria-hidden={index !== activeSlide}
          >
            <PartImage id={slide.image} alt={t("Motorcycle and spare parts")} className="mbmm-hero-image" hero priority={index === activeSlide} />
            <div className="mbmm-hero-shade" />
          </div>
        ))}
        <div className="mbmm-hero-content">
          <img className="mbmm-hero-brand-logo" src="/mbmm-logo.webp" alt="Meri Bike Mera Mistri" />
          <span className="mbmm-hero-kicker">{t(activeHero.kicker)}</span>
          <h1>{t(activeHero.title).split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{t(activeHero.text)}</p>
          <Link className="mbmm-button mbmm-button-red" to={activeHero.bulk ? "/bulkorder" : "/category/all"}>
            {t(activeHero.action)}<ArrowRight size={17} />
          </Link>
        </div>
        <Link className="mbmm-hero-bulk-note" to="/bulkorder">
          <span>{t('RETAILER SPECIAL')}</span>
          <strong>{t('Bulk order\n& save more').split("\n").map((line) => <span key={line}>{line}<br /></span>)}</strong>
          <em>{t('Explore deals')} <ArrowRight size={14} /></em>
        </Link>
        <button className="mbmm-hero-arrow mbmm-hero-prev" type="button" aria-label={t('Previous banner')} onClick={() => moveSlide(-1)}><ArrowLeft size={19} /></button>
        <button className="mbmm-hero-arrow mbmm-hero-next" type="button" aria-label={t('Next banner')} onClick={() => moveSlide(1)}><ArrowRight size={19} /></button>
        <div className="mbmm-hero-dots">
          {heroSlides.map((slide, index) => (
            <button key={slide.title} type="button" aria-label={`${t('Show banner')} ${index + 1}`} aria-current={index === activeSlide} onClick={() => setActiveSlide(index)} />
          ))}
        </div>
      </section>

      <div className="mbmm-page-content">
        <section className="mbmm-find-promo">
          <form className="mbmm-find-card" onSubmit={findPart}>
            <h2><Search size={19} /> {t('Find your part')}</h2>
            <label>
              <span>{t('Select Bike Brand')}</span>
              <select value={brand} onChange={(event) => { setBrand(event.target.value); setModel(""); }}>
                <option value="">{t('Choose a brand')}</option>
                {brands.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>{t('Select Bike Model')}</span>
              <select value={model} onChange={(event) => setModel(event.target.value)}>
                <option value="">{t('Choose a model')}</option>
                {(brand ? [`${brand} Splendor`, `${brand} Shine`, `${brand} 125`, `${brand} Classic`] : ["Splendor Plus", "Shine 125", "Pulsar 150", "Apache RTR"]).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>{t('Select Part Category')}</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">{t('Choose a category')}</option>
                {categories.map((item) => <option key={item.name} value={item.name}>{t(item.name)}</option>)}
              </select>
            </label>
            <button type="submit" className="mbmm-button mbmm-button-red"><Search size={17} /> {t('Search parts')}</button>
          </form>

          <Link className="mbmm-promo-banner" to={searchUrl("two wheeler spare parts")}>
            <PartImage id="photo-1486262715619-67b85e0b08d3" alt="Motorcycle components and workshop" />
            <span className="mbmm-promo-copy">
              <strong>Two-wheeler<br />spare parts</strong>
              <em>For every ride.<br />For every rider.</em>
            </span>
            <span className="mbmm-promo-tag">Parts that<br />keep you moving</span>
          </Link>
        </section>

        <section className="mbmm-section mbmm-brands-section">
          <SectionHeading title={t("Shop by Bike Brand")} subtitle={t("Find the right fit for your ride")} />
          <HorizontalControls label={t("brands")} onPrevious={() => scrollRail(brandRail, -1)} onNext={() => scrollRail(brandRail, 1)} />
          <div className="mbmm-brand-rail" ref={brandRail}>
            {brands.map((item, index) => (
              <Link className={`mbmm-brand-card mbmm-brand-${index}`} key={item} to={searchUrl(item)}>
                <span className="mbmm-brand-mark">{item === "Royal Enfield" ? "RE" : item.slice(0, 1)}</span>
                <strong>{item}</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="mbmm-section">
          <SectionHeading title={t("Shop by Part Category")} subtitle={t("Quality parts for every mile")} link={categoryPath("all")} />
          <HorizontalControls label={t("categories")} onPrevious={() => scrollRail(categoryRail, -1)} onNext={() => scrollRail(categoryRail, 1)} />
          <div className="mbmm-category-rail" ref={categoryRail}>
            {categories.map((item) => (
              <Link className="mbmm-category-card" key={item.name} to={searchUrl(item.search)}>
                <span className="mbmm-category-image"><PartImage id={item.image} alt={item.name} /></span>
                <strong>{t(item.name)}</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="mbmm-section mbmm-deals-section">
          <SectionHeading title={t("Fast-moving & Bulk Deals")} subtitle={t("Popular picks for retailers and workshops")} link={categoryPath("all")} />
          <HorizontalControls label={t("products")} onPrevious={() => scrollRail(productRail, -1)} onNext={() => scrollRail(productRail, 1)} />
          <div className="mbmm-product-rail" ref={productRail}>
            {products.map((item) => (
              <article className="mbmm-product-card" key={item.name}>
                <Link to={searchUrl(item.name)} className="mbmm-product-image">
                  <PartImage id={item.image} alt={item.name} />
                  <span>{t("Popular")}</span>
                </Link>
                <div className="mbmm-product-copy">
                  <Link to={searchUrl(item.name)} className="mbmm-product-name">{t(item.name)}</Link>
                  <span className="mbmm-product-meta">{t(item.meta)}</span>
                  <strong className="mbmm-product-price">{t('MRP')} {item.price}</strong>
                  <Link to="/login" className="mbmm-wholesale-button">{t("Login to view wholesale price")}</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mbmm-promo-row">
          <div className="mbmm-bulk-panel">
            <div className="mbmm-bulk-icon"><ClipboardList size={46} /><FileImage size={26} /></div>
            <div className="mbmm-bulk-copy">
              <span>{t("FOR RETAILERS & WORKSHOPS")}</span>
              <h2>{t("Quick Bulk Order")}</h2>
              <p>{t("Upload your list (Excel / Photo)")}<br />{t("and get an instant quotation.")}</p>
              {uploadFile && <small className="mbmm-upload-name"><CheckCircle2 size={14} /> {uploadFile.name}</small>}
              <div className="mbmm-bulk-actions">
                <input ref={uploadInput} type="file" accept=".xlsx,.xls,.csv,.pdf,image/*" onChange={selectUpload} hidden />
                <button className="mbmm-button mbmm-button-red" type="button" onClick={() => uploadFile ? navigate("/bulkorder", { state: { uploadedListName: uploadFile.name } }) : uploadInput.current?.click()}>
                  {uploadFile ? t("Continue to quote") : t("Upload your list")} <ArrowRight size={15} />
                </button>
                <Link to="/bulkorder">{t("Get a quote without a file")}</Link>
              </div>
            </div>
          </div>

          <div className="mbmm-why-panel">
            <div className="mbmm-why-heading">
              <span>{t("THE MERI BIKE PROMISE")}</span>
              <h2>{t("Why choose us?")}</h2>
            </div>
            <div className="mbmm-feature-grid">
              {features.map((feature) => (
                <div className="mbmm-feature" key={feature.title}>
                  <span>{createElement(feature.Icon, { size: 22 })}</span>
                  <strong>{t(feature.title)}</strong>
                  <small>{t(feature.detail)}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mbmm-trusted-section">
          <div className="mbmm-trusted-title"><BadgeCheck size={17} /> {t("Trusted Brands")}</div>
          <div className="mbmm-trusted-logos">
            {trustedBrands.map((name, index) => <span className={`mbmm-trusted-logo mbmm-trusted-${index}`} key={name}>{name}</span>)}
          </div>
        </section>

        <section className="mbmm-last-callout">
          <div className="mbmm-last-callout-icon"><Headphones size={27} /></div>
          <div>
            <strong>{t("Need help finding the right part?")}</strong>
            <span>{t("Our team is here to help you get back on the road.")}</span>
          </div>
          <a href="https://wa.me/918506911777" target="_blank" rel="noreferrer">{t("Chat with our team")} <ArrowRight size={16} /></a>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
