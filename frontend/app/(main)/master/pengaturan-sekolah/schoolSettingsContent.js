'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Panel } from 'primereact/panel';
import ToastNotifier from '@/app/components/ToastNotifier';

export const dynamic = "force-dynamic";

const defaultForm = {
  school_name: '',
  school_abbreviation: '',
  school_address: '',
  school_phone: '',
  school_email: '',
  school_logo_url: '',
  website: '',
  kepala_sekolah: '',
  npsn: '',
};

const SchoolSettingsContent = () => {
  const toastRef = useRef(null);
  const fileUploadRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [originalData, setOriginalData] = useState(defaultForm);

  const fetchSchoolSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/school', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();

      if (res.ok && json.data) {
        const data = json.data;
        setForm(data);
        setOriginalData(data);
      } else if (res.status === 401) {
        toastRef.current?.showToast('99', 'Sesi Anda telah berakhir. Silakan login kembali.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        toastRef.current?.showToast('99', json.message || 'Gagal memuat data pengaturan sekolah');
      }
    } catch (err) {
      console.error('Error fetch school settings:', err);
      toastRef.current?.showToast('99', 'Gagal memuat data pengaturan sekolah');
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!form.school_name) {
      toastRef.current?.showToast('99', 'Nama sekolah wajib diisi');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/school', {
        method: 'PUT',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (res.ok) {
        toastRef.current?.showToast('00', json.message || 'Pengaturan sekolah berhasil diperbarui');
        setOriginalData(form);
        setIsEditing(false);
        await fetchSchoolSettings();
      } else if (res.status === 401) {
        toastRef.current?.showToast('99', 'Sesi Anda telah berakhir. Silakan login kembali.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        toastRef.current?.showToast('99', json.message || 'Gagal memperbarui pengaturan sekolah');
        console.error('Server response:', json);
      }
    } catch (error) {
      toastRef.current?.showToast('99', 'Gagal memperbarui pengaturan sekolah');
      console.error('Submit error:', error);
    }

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setForm(originalData);
    setIsEditing(false);
  };

  const handleLogoUpload = (event) => {
    const file = event.files[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, school_logo_url: logoUrl }));
      toastRef.current?.showToast('00', 'Logo berhasil dipilih');
    }
  };

  useEffect(() => {
    fetchSchoolSettings();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sekolah</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <i className="pi pi-info-circle text-blue-500"></i>
                <h3 className="text-lg font-semibold">Informasi Sekolah</h3>
              </div>
              {!isEditing && (
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  className="p-button-text"
                  onClick={() => setIsEditing(true)}
                />
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {/* Logo Upload */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <i className="pi pi-image text-gray-600"></i>
                  <label className="text-sm font-medium">Logo Sekolah</label>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                  {form.school_logo_url ? (
                    <Image 
                      src={form.school_logo_url} 
                      alt="Logo Sekolah" 
                      width="80" 
                      height="80"
                      className="rounded-lg border"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <i className="pi pi-image text-gray-400 text-2xl"></i>
                    </div>
                  )}
                  {isEditing && (
                    <FileUpload
                      ref={fileUploadRef}
                      mode="basic"
                      name="logo"
                      accept="image/*"
                      maxFileSize={1000000}
                      onSelect={handleLogoUpload}
                      chooseLabel="Pilih Logo"
                      className="p-button-sm"
                    />
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="pi pi-building text-gray-600"></i>
                    <label htmlFor="school_name" className="text-sm font-medium">
                      Nama Sekolah/Instansi
                    </label>
                  </div>
                  <InputText
                    id="school_name"
                    name="school_name"
                    value={form.school_name}
                    onChange={handleChange}
                    className="w-full"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="pi pi-map-marker text-gray-600"></i>
                    <label htmlFor="school_address" className="text-sm font-medium">
                      Alamat Lengkap
                    </label>
                  </div>
                  <InputTextarea
                    id="school_address"
                    name="school_address"
                    value={form.school_address}
                    onChange={handleChange}
                    className="w-full"
                    rows={3}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <i className="pi pi-phone text-gray-600"></i>
                      <label htmlFor="school_phone" className="text-sm font-medium">
                        Telepon
                      </label>
                    </div>
                    <InputText
                      id="school_phone"
                      name="school_phone"
                      value={form.school_phone}
                      onChange={handleChange}
                      className="w-full"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <i className="pi pi-envelope text-gray-600"></i>
                      <label htmlFor="school_email" className="text-sm font-medium">
                        Email
                      </label>
                    </div>
                    <InputText
                      id="school_email"
                      name="school_email"
                      value={form.school_email}
                      onChange={handleChange}
                      type="email"
                      className="w-full"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="pi pi-globe text-gray-600"></i>
                    <label htmlFor="website" className="text-sm font-medium">
                      Website
                    </label>
                  </div>
                  <InputText
                    id="website"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    className="w-full"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="pi pi-user text-gray-600"></i>
                    <label htmlFor="kepala_sekolah" className="text-sm font-medium">
                      Kepala Sekolah
                    </label>
                  </div>
                  <InputText
                    id="kepala_sekolah"
                    name="kepala_sekolah"
                    value={form.kepala_sekolah}
                    onChange={handleChange}
                    className="w-full"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="pi pi-hashtag text-gray-600"></i>
                    <label htmlFor="npsn" className="text-sm font-medium">
                      NPSN (Nomor Pokok Sekolah Nasional)
                    </label>
                  </div>
                  <InputText
                    id="npsn"
                    name="npsn"
                    value={form.npsn}
                    onChange={handleChange}
                    className="w-full"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <Button
                    type="submit"
                    label="Simpan"
                    icon="pi pi-save"
                    severity="success"
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    label="Batal"
                    icon="pi pi-times"
                    severity="secondary"
                    onClick={handleCancel}
                    className="flex-1"
                  />
                </div>
              )}
            </form>

            <div className="mt-4 text-xs text-gray-500">
              Terakhir diperbarui: 1 Januari 2024 pukul 07:00
            </div>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-eye text-blue-500"></i>
              <h3 className="text-lg font-semibold">Preview Tampilan</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Pratinjau bagaimana informasi sekolah akan ditampilkan
            </p>

            {/* Dashboard Header Preview */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <i className="pi pi-desktop text-gray-600"></i>
                <h4 className="font-medium">Dashboard Header</h4>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  {form.school_logo_url ? (
                    <Image 
                      src={form.school_logo_url} 
                      alt="Logo" 
                      width="40" 
                      height="40"
                      className="rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                      <span className="text-xs">Logo</span>
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold text-gray-800">
                      {form.school_name || 'SMK Negeri 1 Surabaya'}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Sistem Informasi Magang
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Rapor/Sertifikat Preview */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <i className="pi pi-file-pdf text-gray-600"></i>
                <h4 className="font-medium">Header Rapor/Sertifikat</h4>
              </div>
              <div className="p-6 bg-white border-2 rounded-lg text-center">
                {form.school_logo_url && (
                  <div className="flex justify-center mb-4">
                    <Image 
                      src={form.school_logo_url} 
                      alt="Logo" 
                      width="60" 
                      height="60"
                      className="rounded"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {form.school_name || 'SMK Negeri 1 Surabaya'}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {form.school_address || 'Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252'}
                </p>
                <div className="flex justify-center gap-4 text-xs text-gray-500 mb-3">
                  {form.school_phone && <span>Telp: {form.school_phone}</span>}
                  {form.school_email && <span>Email: {form.school_email}</span>}
                </div>
                {form.website && (
                  <p className="text-xs text-gray-500 mb-3">
                    Web: {form.website}
                  </p>
                )}
                <Divider />
                <p className="text-base font-semibold text-gray-700">
                  SERTIFIKAT MAGANG
                </p>
              </div>
            </div>

            {/* Dokumen Cetak Preview */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="pi pi-print text-gray-600"></i>
                <h4 className="font-medium">Dokumen Cetak</h4>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border text-sm">
                <div className="flex items-start gap-3">
                  {form.school_logo_url ? (
                    <Image 
                      src={form.school_logo_url} 
                      alt="Logo" 
                      width="32" 
                      height="32"
                      className="rounded mt-1"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center mt-1">
                      <span className="text-xs">Logo</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">
                      {form.school_name || 'SMK Negeri 1 Surabaya'}
                    </h5>
                    <p className="text-xs text-gray-600 mb-1">
                      NPSN: {form.npsn || '20567890'}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {form.school_address || 'Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252'}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {form.school_phone && `📞 ${form.school_phone}`} {form.school_email && `📧 ${form.school_email}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      ✋ Kepala Sekolah: {form.kepala_sekolah || 'Drs. H. Sutrisno, M.Pd'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default SchoolSettingsContent;