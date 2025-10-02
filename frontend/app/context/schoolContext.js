'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SchoolContext = createContext();

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

export const SchoolProvider = ({ children }) => {
  const [schoolSettings, setSchoolSettings] = useState({
    school_name: 'SISTEM MONITORING MAGANG',
    school_abbreviation: 'SMM',
    school_address: '',
    school_phone: '',
    school_email: '',
    school_logo_url: '',
    website: '',
    kepala_sekolah: '',
    npsn: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchoolSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setSchoolSettings(data.data);
        }
        setError(null);
      } else if (response.status === 401) {
        // User not authenticated, use default values
        console.log('User not authenticated, using default school settings');
        setError(null);
      } else {
        console.error('Failed to fetch school settings:', response.status);
        setError('Failed to fetch school settings');
      }
    } catch (err) {
      console.error('Error fetching school settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSchoolSettings = (newSettings) => {
    setSchoolSettings(newSettings);
  };

  useEffect(() => {
    fetchSchoolSettings();
  }, []);

  const value = {
    schoolSettings,
    loading,
    error,
    fetchSchoolSettings,
    updateSchoolSettings
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
};
