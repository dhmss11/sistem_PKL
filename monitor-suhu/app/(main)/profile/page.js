'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FileUpload } from 'primereact/fileupload';
import { Badge } from 'primereact/badge';
import { useAuth } from '@/app/(auth)/context/authContext';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const { user, setUser, initialized, logout,  loading: authLoading} = useAuth();
  const redirectedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [originalUserInfo, setOriginalUserInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();  
   const handleLogout = async () => {
          try {
              setIsLoggingOut(true);
              
              const result = await logout();
              
              if (result.success) {
                  toast.current?.show({
                      severity: 'success',
                      summary: 'Logout Berhasil',
                      detail: result.message || 'Anda telah berhasil keluar dari sistem',
                      life: 3000
                  });
  
                  setTimeout(() => {
                      router.push('/auth/login');
                  }, 1000);
  
              } else {
                  throw new Error(result.error || 'Logout gagal');
              }
  
          } catch (error) {
              console.error('Logout error:', error);
              toast.current?.show({
                  severity: 'error',
                  summary: 'Logout Gagal',
                  detail: error.message || 'Terjadi kesalahan saat logout',
                  life: 5000
              });
              
              setTimeout(() => {
                  router.push('/auth/login');
              }, 2000);
              
          } finally {
              setIsLoggingOut(false);
          }
      };
  
      useEffect(() => {
          console.log('Dashboard useEffect:', { 
              initialized, 
              loading, 
              hasUser: !!user,
              redirected: redirectedRef.current 
          });
  
          if (initialized && !loading && !user && !redirectedRef.current) {
              redirectedRef.current = true;
              router.push('/auth/login');
          }
      }, [initialized, loading, user, router]);


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    if (user && !authLoading) {
      console.log('Initializing user data', user.username);
      setUserInfo(user);
      setOriginalUserInfo({ ...user });
      
      if (user.profile_image) {
        setProfileImage(user.profile_image);
      }
    }
  }, [user, authLoading]);

  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };

  const validateForm = () => {
    if (!userInfo.username?.trim()) {
      showToast('error', 'Validasi Error', 'Username tidak boleh kosong');
      return false;
    }
    
    if (!userInfo.email?.trim()) {
      showToast('error', 'Validasi Error', 'Email tidak boleh kosong');
      return false;
    }
    
    if (!isValidEmail(userInfo.email)) {
      showToast('error', 'Validasi Error', 'Format email tidak valid');
      return false;
    }
    
    if (userInfo.no_hp && !isValidPhone(userInfo.no_hp)) {
      showToast('error', 'Validasi Error', 'Format nomor telepon tidak valid');
      return false;
    }
    
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    confirmDialog({
      message: 'Apakah Anda yakin ingin menyimpan perubahan profil?',
      header: 'Konfirmasi',
      icon: 'pi pi-question-circle',
      acceptClassName: 'p-button-success',
      accept: async () => {
        try {
          setSaving(true);
          
          const payload = {
            id: userInfo.id,
            username: userInfo.username.trim(),
            email: userInfo.email.trim(),
            no_hp: userInfo.no_hp?.trim() || '',
            role: userInfo.role
          };

          const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const result = await response.json();

          if (response.ok && result.status === '00') {
            showToast('success', 'Berhasil', result.message || 'Profil berhasil diperbarui');
            setEditMode(false);
            setOriginalUserInfo({ ...userInfo });
            
            console.log('Updating user data in context');
            setUser(userInfo);
          } else {
            showToast('error', 'Error', result.message || 'Gagal memperbarui profil');
          }
        } catch (error) {
          console.error('Save error:', error);
          showToast('error', 'Error', 'Terjadi kesalahan saat menyimpan data');
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const handleCancelEdit = () => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin membatalkan perubahan?',
      header: 'Konfirmasi',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        setUserInfo({ ...originalUserInfo });
        setEditMode(false);
      }
    });
  };

  const handleImageUpload = (event) => {
    const file = event.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('error', 'Error', 'Ukuran file maksimal 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast('error', 'Error', 'File harus berupa gambar');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(userInfo) !== JSON.stringify(originalUserInfo);
  };

  const getRoleBadge = (role) => {
    const config = {
      superadmin: { severity: 'danger', icon: 'pi pi-crown' },
      admin: { severity: 'warning', icon: 'pi pi-shield' },
      user: { severity: 'info', icon: 'pi pi-user' }
    };
    return config[role] || config.user;
  };

  if (authLoading || !user) {
    return (
      <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        <p className="mt-3 text-600">
          {authLoading ? 'Memuat data autentikasi...' : 'Memuat data profil...'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="col-12">
        <div className="card">
          <div className="flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="m-0 text-900">Profil Pengguna</h3>
              <p className="text-600 mt-1">Kelola informasi profil dan keamanan akun Anda</p>
            </div>
            <div className="flex gap-2">
              {editMode && (
                <Button 
                  icon="pi pi-times" 
                  label="Batal" 
                  onClick={handleCancelEdit}
                  className="p-button-secondary" 
                  disabled={saving}
                />
              )}
              <Button 
                icon={editMode ? "pi pi-check" : "pi pi-pencil"}
                label={editMode ? "Simpan" : "Edit Profil"}
                onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                className={editMode ? "p-button-success" : "p-button-primary"}
                loading={saving}
                disabled={saving || (editMode && !hasChanges())}
              />
            </div>
          </div>

          <div className="grid">
            <div className="col-12 md:col-4">
              <Card className="h-full">
                <div className="flex flex-column align-items-center text-center">
                  <div className="relative mb-3">
                    <Avatar 
                      image={profileImage}
                      icon={!profileImage ? "pi pi-user" : null}
                      size="xlarge" 
                      shape="circle"
                      className="border-3 border-primary"
                      style={{ 
                        backgroundColor: !profileImage ? '#6366f1' : 'transparent',
                        color: 'white', 
                        width: '120px', 
                        height: '120px',
                        fontSize: '2rem'
                      }} 
                    />
                    {editMode && (
                      <div className="absolute" style={{ bottom: '0', right: '0' }}>
                        <FileUpload
                          ref={fileUploadRef}
                          mode="basic"
                          accept="image/*"
                          maxFileSize={2000000}
                          customUpload
                          uploadHandler={handleImageUpload}
                          chooseOptions={{
                            icon: 'pi pi-camera',
                            className: 'p-button-rounded p-button-sm p-button-primary'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <h4 className="m-0 mb-2 text-900">{userInfo.username}</h4>
                  
                  <Badge 
                    value={userInfo.role?.toUpperCase()} 
                    severity={getRoleBadge(userInfo.role).severity}
                    className="mb-3"
                  />

                  <div className="w-full">
                    <Divider />
                    <div className="flex justify-content-between mb-2">
                      <span className="font-semibold text-700">Email:</span>
                      <span className="text-sm text-900" style={{ wordBreak: 'break-all' }}>
                        {userInfo.email}
                      </span>
                    </div>
                    <div className="flex justify-content-between mb-2">
                      <span className="font-semibold text-700">Telepon:</span>
                      <span className="text-sm text-900">
                        {userInfo.no_hp || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-8">
              <Card title="Informasi Personal" className="h-full">
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <label htmlFor="username" className="block text-900 font-medium mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <InputText 
                      id="username"
                      value={userInfo.username || ''}
                      onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                      disabled={!editMode}
                      className="w-full"
                      placeholder="Masukkan username"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="email" className="block text-900 font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <InputText 
                      id="email"
                      value={userInfo.email || ''}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      disabled={!editMode}
                      className="w-full"
                      placeholder="nama@email.com"
                      type="email"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="no_hp" className="block text-900 font-medium mb-2">
                      No. Telepon
                    </label>
                    <InputText 
                      id="no_hp"
                      value={userInfo.no_hp}
                      onChange={(e) => setUserInfo({...userInfo, no_hp: e.target.value})}
                      disabled={!editMode}
                      className="w-full"
                     
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="role" className="block text-900 font-medium mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <InputText 
                      id="role"
                      value={userInfo.role}
                      onChange={(e) => setUserInfo({...userInfo, role: e.value})}
                      disabled
                      className="w-full"
                      placeholder="Pilih Role"
                      optionLabel="label"
                      optionValue="value"
                     
                    />
                  </div>
                </div>
                <div>
                     <Button
                      id="logout"
                      name="logout"
                      label={isLoggingOut ? 'Logging out...' : 'Logout'}
                      icon={isLoggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'}
                      className="p-button-danger mt-5"
                      loading={isLoggingOut}
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                        />
                </div>

                {hasChanges() && editMode && (
                  <div className="mt-4 p-3 border-1 border-orange-200 bg-orange-50 border-round">
                    <div className="flex align-items-center">
                      <i className="pi pi-info-circle text-orange-600 mr-2"></i>
                      <span className="text-orange-800 text-sm">
                        Anda memiliki perubahan yang belum disimpan
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;