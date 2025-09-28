'use client';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/gradient.css';
import { useAuth } from '../../context/authContext.js';
import Link from 'next/link';


const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, checkAuth } = useAuth();

  // Reset form setiap kali halaman render pertama kali
  useEffect(() => {
    setEmailOrUsername('');
    setPassword('');
    if (user) router.push('/');
  }, [user, router]);

  const login = async (emailOrUsername, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
        credentials: 'include',
      });

      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (error) {
      return { ok: false, status: 500, data: { message: 'Gagal terhubung ke server: ' + error.message } };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await login(emailOrUsername, password);

      if (result.ok && result.status === 200) {
        setMessage('Login berhasil!');
        // Reset form otomatis setelah login sukses
        setEmailOrUsername('');
        setPassword('');

        setTimeout(async () => {
          await checkAuth();
          setTimeout(() => router.push('/'), 500);
        }, 1000);
      } else {
        setMessage(result.data.message || `Login gagal (${result.status})`);
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

if (user) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animated-gradient-bg w-full h-full flex items-center justify-center">
        <div className="card w-96 bg-white rounded-2xl shadow-2xl p-6 min-h-40 flex flex-col items-center justify-center">
          <p className="text-gray-700 font-medium">Already logged in, redirecting...</p>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animated-gradient-bg w-full h-full flex items-center justify-center">

        {/* Kartu */}
        <div className="card w-96 bg-white rounded-2xl shadow-2xl p-6 min-h-72">
          <div className="flex flex-col items-center">


            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full">
            {/* Title */}
              {message && (
              <div
                className={`p-3 rounded-lg text-center mb-4 w-full ${
                  message.includes('berhasil')
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {message}
              </div>
            )}
            <h3 className="text-lg text-center font-semibold mb-4">Sign in to your account</h3>

              <div className="mb-4 w-full">
                <label htmlFor="emailOrUsername" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <InputText
                  id="emailOrUsername"
                  type="text"
                  className="w-full"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Masukkan email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4 w-full">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <InputText
                  id="password"
                  type="password"
                  className="w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                />
              </div>

              <div className="w-full">
                <Button
                  label={loading ? 'Logging...' : 'Login'}
                  className="w-full"
                  type="submit"
                  loading={loading}
                  disabled={loading}
                />
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
