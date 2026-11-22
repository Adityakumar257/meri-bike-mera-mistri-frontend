import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, BadgeCheck, FileImage, PackageCheck, Phone, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";
import { EnquiryService } from "../services/api";
import "../components/layout/MotorcycleStorefront.css";

const initialForm = { name: "", email: "", phone: "", message: "" };

function BulkOrder() {
  const location = useLocation();
  const [formData, setFormData] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(location.state?.uploadedListName || "");
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const selectFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Please choose a file smaller than 10 MB.");
      event.target.value = "";
      return;
    }
    setSelectedFile(file.name);
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();
    setLoading(true);
    const message = selectedFile
      ? `${formData.message.trim()}\nParts list selected: ${selectedFile}`
      : formData.message.trim();

    try {
      await EnquiryService.createBulkOrder({ ...formData, message });
      toast.success("Your bulk order enquiry has been sent.");
      setFormData(initialForm);
      setSelectedFile("");
      if (fileInput.current) fileInput.current.value = "";
    } catch (error) {
      console.error("Bulk order enquiry failed:", error);
      toast.error(error.message || "Unable to send your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mbmm-bulk-page">
      <div className="mbmm-bulk-page-inner">
        <div className="mbmm-bulk-page-heading">
          <span><PackageCheck size={16} /> WHOLESALE &amp; RETAILER ENQUIRIES</span>
          <h1>Quick Bulk Order</h1>
          <p>Share your parts requirement and our team will get back to you with a quotation.</p>
        </div>

        <div className="mbmm-bulk-page-grid">
          <aside className="mbmm-bulk-page-aside">
            <div className="mbmm-bulk-page-card">
              <span className="mbmm-bulk-page-icon"><BadgeCheck size={25} /></span>
              <h2>Parts for every ride</h2>
              <p>Tell us what you need for your shop, workshop or fleet. We’ll help you source the right two-wheeler spares.</p>
              <ul>
                <li><BadgeCheck size={16} /> Genuine and OEM options</li>
                <li><PackageCheck size={16} /> Bulk pricing for retailers</li>
                <li><ArrowRight size={16} /> Pan-India delivery support</li>
              </ul>
            </div>
            <div className="mbmm-bulk-page-contact">
              <strong>Prefer to speak with us?</strong>
              <a href="tel:+918506911777"><Phone size={16} /> +91 85069 11777</a>
              <a href="https://wa.me/918506911777" target="_blank" rel="noreferrer">WhatsApp our team <ArrowRight size={15} /></a>
            </div>
          </aside>

          <form className="mbmm-bulk-form" onSubmit={submitEnquiry}>
            <h2>Request a quotation</h2>
            <p>Share your contact details and the parts you’re looking for.</p>
            <div className="mbmm-bulk-form-fields">
              <label>
                Your name *
                <input name="name" value={formData.name} onChange={updateForm} placeholder="Enter your name" required />
              </label>
              <label>
                Email address *
                <input name="email" type="email" value={formData.email} onChange={updateForm} placeholder="you@business.com" required />
              </label>
              <label>
                Phone number *
                <input name="phone" type="tel" value={formData.phone} onChange={updateForm} placeholder="+91" required />
              </label>
              <label className="mbmm-bulk-message">
                Parts and quantity required *
                <textarea name="message" rows="5" value={formData.message} onChange={updateForm} placeholder="List the parts, bike models and approximate quantities you need..." required />
              </label>
            </div>
            <div className="mbmm-bulk-file-row">
              <input ref={fileInput} type="file" accept=".xlsx,.xls,.csv,.pdf,image/*" onChange={selectFile} hidden />
              <button type="button" className="mbmm-bulk-file-button" onClick={() => fileInput.current?.click()}>
                <UploadCloud size={18} /> Choose Excel or photo
              </button>
              <span className="mbmm-bulk-file-status">
                {selectedFile ? <><FileImage size={15} /> {selectedFile}</> : "Optional · up to 10 MB"}
              </span>
            </div>
            {selectedFile && <p className="mbmm-bulk-file-note">The selected filename will be included with your enquiry. To share the original list, you can also send it to us on WhatsApp.</p>}
            <button type="submit" className="mbmm-button mbmm-button-red mbmm-bulk-submit" disabled={loading}>
              {loading ? "Sending enquiry..." : "Get my quotation"} {!loading && <ArrowRight size={17} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BulkOrder;
