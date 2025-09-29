// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiPost } from '../api/api';
import emailjs from '@emailjs/browser';

// Inicializar EmailJS con tu public key
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nueva contraseña
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* 📩 Paso 1: Solicitar código y enviar email desde FRONTEND */
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // 1. Solicitar código al backend
      const res = await apiPost('auth/forgot-password', { 
        email: formData.email 
      });
      
      // 🔥 Manejo de usuario inexistente
      if (res.success) {
        // 2. Enviar email directamente desde el frontend
        const templateParams = {
          email: formData.email,
          user_name: res.userName || formData.email.split('@')[0],
          reset_code: res.code,
          app_name: import.meta.env.VITE_FROM_NAME
        };

        console.log('📤 Enviando email con parámetros:', templateParams);

        const emailResult = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams
        );

        console.log('✅ EmailJS response:', emailResult);

        if (emailResult.status === 200) {
          setMessage('Código de recuperación enviado a tu email ✅');
          setStep(2);
        } else {
          setError('Error al enviar el email. Intenta nuevamente.');
        }
      } else {
        setError(res.msg || 'Error al generar código de recuperación');
      }
    } catch (err) {
      console.error('❌ Error completo:', err);
      // 🔥 Manejo de error 404 específicamente
      if (err.response?.status === 404) {
        setError('Usuario inexistente. Código no enviado.');
      } else {
        setError('Error de conexión. Verifica tu conexión a internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* 🔒 Paso 2: Verificar código */
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await apiPost('auth/verify-code', {
        email: formData.email,
        code: formData.code
      });

      if (res.success) {
        setMessage('Código verificado correctamente ✅');
        setStep(3);
      } else {
        setError(res.msg || 'Código inválido');
      }
    } catch (err) {
      // 🔥 Manejo de error 404 específicamente
      if (err.response?.status === 404) {
        setError('Usuario no encontrado');
      } else {
        setError('Error al verificar código');
      }
    } finally {
      setLoading(false);
    }
  };

  /* 🔑 Paso 3: Resetear contraseña */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const res = await apiPost('auth/reset-password', {
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword
      });

      if (res.success) {
        setMessage('Contraseña actualizada correctamente. Redirigiendo... ✅');
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        setError(res.msg || 'Error al actualizar contraseña');
      }
    } catch (err) {
      setError('Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                {step === 1 && 'Recuperar Contraseña'}
                {step === 2 && 'Verificar Código'}
                {step === 3 && 'Nueva Contraseña'}
              </h4>
            </div>
            <div className="card-body">
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Paso 1: Ingresar email */}
              {step === 1 && (
                <form onSubmit={handleSendCode}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <small className="form-text text-muted">
                      Te enviaremos un código de verificación a tu email.
                    </small>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Código'}
                  </button>
                </form>
              )}

              {/* Paso 2: Ingresar código */}
              {step === 2 && (
                <form onSubmit={handleVerifyCode}>
                  <div className="mb-3">
                    <label className="form-label">Código de Verificación</label>
                    <input
                      type="text"
                      className="form-control"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      maxLength="6"
                      required
                    />
                    <small className="form-text text-muted">
                      Ingresa el código de 6 dígitos que recibiste en tu email.
                    </small>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Verificando...' : 'Verificar Código'}
                  </button>
                </form>
              )}

              {/* Paso 3: Nueva contraseña */}
              {step === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <label className="form-label">Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      minLength="6"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmar Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength="6"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </form>
              )}

              <div className="text-center mt-3">
                <Link to="/">Volver al Inicio</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;