import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaSpinner, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AuthService } from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(location.state?.message || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !password) {
      setError(t('Name and password are required.'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const { data } = await AuthService.login({ name: name.trim(), password });
      if (!data.success || !data.token || !data.user) {
        setError(t(data.message || 'Invalid name or password.'));
        return;
      }

      login(data.user, data.token);
      const returnPath = typeof location.state?.from === 'string'
        ? location.state.from
        : location.state?.from?.pathname || localStorage.getItem('redirectPath') || '/account';
      localStorage.removeItem('redirectPath');
      navigate(returnPath, { replace: true });
    } catch (requestError) {
      setError(t(requestError.response?.data?.message || 'Unable to connect to the server. Please try again later.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mbmm-auth-page">
      <section className="mbmm-auth-card" aria-labelledby="mbmm-login-title">
        <div className="mbmm-auth-intro">
          <img src="/mbmm-logo.webp" alt="Meri Bike Mera Mistri" />
          <p>{t('Genuine two-wheeler spare parts, delivered to your doorstep. Ride better with parts you can trust.')}</p>
        </div>
        <form className="mbmm-auth-form" onSubmit={handleSubmit} noValidate>
          <span className="mbmm-auth-eyebrow">{t('Customer Login')}</span>
          <h1 id="mbmm-login-title">{t('Welcome back')}</h1>
          <p className="mbmm-auth-subtitle">{t('Sign in to continue')}</p>

          {error && <div className="mbmm-auth-error" role="alert">{error}</div>}

          <label className="mbmm-auth-field">
            <span>{t('Name')} <b aria-hidden="true">*</b></span>
            <span className="mbmm-auth-input-wrap">
              <FaUser aria-hidden="true" />
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t('Enter your registered name')}
                required
              />
            </span>
          </label>

          <label className="mbmm-auth-field">
            <span>{t('Password')} <b aria-hidden="true">*</b></span>
            <span className="mbmm-auth-input-wrap">
              <FaLock aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('Password')}
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

          <Link className="mbmm-auth-forgot" to="/forgot-password">{t('Forgot Password?')}</Link>
          <button className="mbmm-auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? <><FaSpinner className="mbmm-auth-spinner" /> {t('Signing in...')}</> : t('Sign in')}
          </button>
          <p className="mbmm-auth-switch">
            {t('Don’t have an account?')} <Link to="/signup">{t('Register here')}</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
