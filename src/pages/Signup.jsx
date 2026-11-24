import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AuthService } from '../services/api';

const fieldGroups = [
  {
    title: 'Personal Information',
    fields: [
      { name: 'name', label: 'Full Name', placeholder: 'Enter your full name', autoComplete: 'name' },
      { name: 'fatherName', label: "Father's Name", placeholder: "Enter your father's name", autoComplete: 'off' },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', autoComplete: 'bday' }
    ]
  },
  {
    title: 'Address Information',
    fields: [
      { name: 'village', label: 'Village', placeholder: 'Enter your village' },
      { name: 'postOffice', label: 'Post Office', placeholder: 'Enter your post office' },
      { name: 'block', label: 'Block', placeholder: 'Enter your block' },
      { name: 'policeStation', label: 'Police Station (Thana)', placeholder: 'Enter your police station' },
      { name: 'tehsil', label: 'Tehsil', placeholder: 'Enter your tehsil' },
      { name: 'district', label: 'District (Jila)', placeholder: 'Enter your district' },
      { name: 'pinCode', label: 'PIN Code', placeholder: '6-digit PIN code', inputMode: 'numeric', maxLength: 6 },
      { name: 'shopAddress', label: 'Shop Address', placeholder: 'Enter your complete shop address' }
    ]
  },
  {
    title: 'Contact Information',
    fields: [
      { name: 'mobile', label: 'Mobile Number', placeholder: '10-digit mobile number', inputMode: 'numeric', maxLength: 10 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' }
    ]
  },
  {
    title: 'Bank Information',
    fields: [
      { name: 'bankName', label: 'Bank Name', placeholder: 'Enter your bank name' },
      { name: 'bankBranch', label: 'Bank Branch (Sakha)', placeholder: 'Enter your bank branch' },
      { name: 'ifscCode', label: 'IFSC Code', placeholder: 'e.g. ABCD0123456', maxLength: 11 }
    ]
  },
  {
    title: 'Nominee Information',
    fields: [
      { name: 'nomineeName', label: 'Nominee Name', placeholder: 'Enter nominee name' },
      { name: 'nomineeRelationship', label: 'Nominee Relationship', placeholder: 'e.g. Parent, spouse, sibling' }
    ]
  }
];

const initialForm = {
  name: '', fatherName: '', dateOfBirth: '', village: '', postOffice: '', block: '',
  policeStation: '', tehsil: '', district: '', pinCode: '', shopAddress: '',
  mobile: '', email: '', bankName: '', bankBranch: '', ifscCode: '',
  nomineeName: '', nomineeRelationship: '', password: ''
};

const Signup = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: name === 'ifscCode' ? value.toUpperCase() : value }));
    setErrors((current) => {
      if (!current[name] && !current.general) return current;
      const next = { ...current, [name]: '' };
      delete next.general;
      return next;
    });
  };

  const validate = () => {
    const next = {};
    for (const [name, value] of Object.entries(formData)) {
      if (typeof value !== 'string' || !value.trim()) next[name] = t('Required field');
    }
    if (formData.name.trim().length < 2) next.name = t('Full name must be at least 2 characters.');
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) next.email = t('Enter a valid email address.');
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile.trim())) next.mobile = t('Enter a valid 10-digit mobile number.');
    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode.trim())) next.pinCode = t('PIN code must be 6 digits.');
    if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.trim())) next.ifscCode = t('Enter a valid IFSC code.');
    if (formData.dateOfBirth && new Date(`${formData.dateOfBirth}T00:00:00`) > new Date()) {
      next.dateOfBirth = t('Date of birth cannot be in the future.');
    }
    if (formData.password.length < 8) next.password = t('Password must be at least 8 characters.');
    if (new TextEncoder().encode(formData.password).length > 72) next.password = t('Password must be no more than 72 bytes.');
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      const { data } = await AuthService.register(formData);
      if (!data.success || !data.token || !data.user) {
        setErrors({ general: t(data.message || 'Registration failed. Please try again.') });
        return;
      }
      login(data.user, data.token);
      navigate('/account', { replace: true });
    } catch (requestError) {
      setErrors({
        general: t(requestError.response?.data?.message || 'Unable to connect to the server. Please try again later.')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const maxBirthDate = new Date().toISOString().slice(0, 10);

  return (
    <main className="mbmm-auth-page mbmm-signup-page">
      <section className="mbmm-registration-card" aria-labelledby="mbmm-signup-title">
        <header className="mbmm-registration-header">
          <img src="/mbmm-logo.webp" alt="Meri Bike Mera Mistri" />
          <div>
            <span className="mbmm-auth-eyebrow">{t('Retailer Registration')}</span>
            <h1 id="mbmm-signup-title">{t('Create your account')}</h1>
            <p>{t('Complete your details to create a retailer account.')}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          {errors.general && <div className="mbmm-auth-error" role="alert">{errors.general}</div>}
          {fieldGroups.map((group) => (
            <fieldset className="mbmm-registration-section" key={group.title}>
              <legend>{t(group.title)}</legend>
              <div className="mbmm-registration-grid">
                {group.fields.map((field) => (
                  <label className="mbmm-auth-field" key={field.name}>
                    <span>{t(field.label)} <b aria-hidden="true">*</b></span>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={updateField}
                      placeholder={t(field.placeholder || field.label)}
                      autoComplete={field.autoComplete}
                      inputMode={field.inputMode}
                      maxLength={field.maxLength}
                      max={field.type === 'date' ? maxBirthDate : undefined}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                      required
                    />
                    {errors[field.name] && <small id={`${field.name}-error`} className="mbmm-field-error">{errors[field.name]}</small>}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <fieldset className="mbmm-registration-section">
            <legend>{t('Account Security')}</legend>
            <label className="mbmm-auth-field mbmm-password-field">
              <span>{t('Password')} <b aria-hidden="true">*</b></span>
              <span className="mbmm-auth-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={updateField}
                  placeholder={t('Password')}
                  autoComplete="new-password"
                  maxLength={72}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  required
                />
                <button
                  className="mbmm-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={t(showPassword ? 'Hide password' : 'Show password')}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
              {errors.password && <small id="password-error" className="mbmm-field-error">{errors.password}</small>}
            </label>
          </fieldset>

          <button className="mbmm-auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? <><FaSpinner className="mbmm-auth-spinner" /> {t('Creating account...')}</> : t('Create account')}
          </button>
          <p className="mbmm-auth-switch">
            {t('Already have an account?')} <Link to="/login">{t('Login here')}</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Signup;
