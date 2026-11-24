import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { AuthService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ResetPassword = () => {
  const { token } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
      setError(t('Password must be at least 8 characters and no more than 72 bytes.'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await AuthService.resetPassword({ token, newPassword: password });
      navigate('/login', { replace: true, state: { message: t('Password reset successful. You can now sign in.') } });
    } catch (requestError) {
      setError(t(requestError.response?.data?.message || 'Unable to reset password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mbmm-auth-page">
      <section className="mbmm-auth-card" aria-labelledby="mbmm-reset-title">
        <div className="mbmm-auth-intro">
          <img src="/mbmm-logo.webp" alt="Meri Bike Mera Mistri" />
          <p>{t('Set a new password for your account.')}</p>
        </div>
        <form className="mbmm-auth-form" onSubmit={submit} noValidate>
          <span className="mbmm-auth-eyebrow">{t('Account Security')}</span>
          <h1 id="mbmm-reset-title">{t('Reset password')}</h1>
          <p className="mbmm-auth-subtitle">{t('Choose a new password with at least 8 characters.')}</p>
          {error && <div className="mbmm-auth-error" role="alert">{error}</div>}
          <label className="mbmm-auth-field">
            <span>{t('Password')} <b aria-hidden="true">*</b></span>
            <span className="mbmm-auth-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                maxLength={72}
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
          </label>
          <button className="mbmm-auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? <><FaSpinner className="mbmm-auth-spinner" /> {t('Saving...')}</> : t('Reset password')}
          </button>
          <p className="mbmm-auth-switch"><Link to="/login">{t('Back to Login')}</Link></p>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
