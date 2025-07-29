'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ToastNotifier from '@/app/components/ToastNotifier';

const GudangPage = () => {
  const toastRef = useRef(null);
  const searchParams = useSearchParams();
  const jenisQuery = searchParams.get('keterangan');

  const [gudang, setGudang] = useState([]);
  const [keteranganOptions, setKeteranganOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedGudang, setSelectedGudang] = useState(null);
  const [form, setForm] = useState({
    KODE : '',
    nama: '',
    alamat: '',
    KETERANGAN: '',
  });

  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!jenisQuery) {
      setIsLocked(true);
      toastRef.current?.showToast('99', 'Halaman dikunci, tidak ada jenis gudang');
    } else {
      setIsLocked(false);
      fetchGudang();
    }

    fetchKeteranganOptions();
  }, [jenisQuery]);

  const fetchKeteranganOptions = async () => {
    try {
      const res = await fetch(`/api/golonganstock/keterangan/${encodeURIComponent(jenisQuery)}`);
      const json = await res.json();

      if (json.status === '00') {
        const options = json.data.map((item) => ({
          label: item.nama,
          value: item.nama,
        }));
        setKeteranganOptions(options);
      } else {
        toastRef.current?.showToast(json.status ?? '99', json.message ?? 'Gagal mengambil data keterangan');
      }
    } catch (err) {
      console.error('Fetch keterangan error:', err);
      toastRef.current?.showToast('99', 'Gagal mengambil data golongan stock');
    }
  };

  const fetchGudang = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/gudang/detail/${encodeURIComponent(jenisQuery)}`);
      const json = await res.json();

      if (json.data?.status === '00') {
        setGudang(json.data.gudang);
      } else {
        toastRef.current?.showToast(json.data?.status ?? '99', json.data?.message ?? 'Gagal memuat data');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toastRef.current?.showToast('99', 'Gagal memuat data gudang');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = dialogMode === 'add'
        ? '/api/gudang'
        : `/api/gudang/${selectedGudang.id}`;

      const method = dialogMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      const status = json.data?.status ?? '99';
      const message = json.data?.message;

      toastRef.current?.showToast(status, message);

      if (status === '00') {
        const newRow = json.data?.gudang;
        setGudang((prev) =>
          dialogMode === 'add'
            ? [...prev, newRow]
            : prev.map((r) => (r.id === newRow.id ? newRow : r))
        );
      }
    } catch (err) {
      console.error('Submit error:', err);
      toastRef.current?.showToast('99', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setIsLoading(false);
      resetForm();
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Hapus gudang "${item.nama}"?`)) return;
    try {
      const res = await fetch(`/api/gudang/${item.id}`, { method: 'DELETE' });
      const json = await res.json();

      if (json.status === '00') {
        toastRef.current?.showToast('00', json.message);
        setGudang((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        toastRef.current?.showToast(json.status ?? '99', json.message);
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Gagal menghapus gudang');
    }
  };

  const resetForm = () => {
    setForm({ nama: '', alamat: '', KETERANGAN: '' });
    setDialogMode(null);
    setSelectedGudang(null);
  };

  if (isLocked) {
    return (
      <div className="card text-center">
        <h3 className="text-xl text-red-600 font-bold mb-3">Halaman Terkunci</h3>
        <p className="text-gray-600">
          Anda tidak bisa mengakses halaman ini langsung.
          Silakan kembali ke halaman <strong>Master Jenis Gudang</strong> dan pilih jenis gudang terlebih dahulu.
        </p>
        <ToastNotifier ref={toastRef} />
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">
        Master Nama Gudang (Jenis: {jenisQuery})
      </h3>

      <div className="flex justify-end mb-4">
        <Button
          label="Tambah Gudang"
          icon="pi pi-plus"
          onClick={() => {
            setDialogMode('add');
            setForm({ KETERANGAN: jenisQuery, nama: '', alamat: '' });
          }}
        />
      </div>

      <DataTable
        size="small"
        className="text-sm"
        value={gudang}
        paginator
        rows={10}
        loading={isLoading}
        scrollable
      >
        <Column field="KODE" header ="KODE"/>
        <Column field="KETERANGAN" header="Jenis" />
        <Column field="nama" header="Nama" />
        <Column field="alamat" header="Alamat" />
        <Column
          header="Aksi"
          style={{ width: '150px' }}
          body={(row) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                size="small"
                severity="warning"
                onClick={() => {
                  setDialogMode('edit');
                  setSelectedGudang(row);
                  setForm({ ...row });
                }}
              />
              <Button
                icon="pi pi-trash"
                size="small"
                severity="danger"
                onClick={() => handleDelete(row)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={dialogMode === 'add' ? 'Tambah Gudang' : 'Edit Gudang'}
        visible={dialogMode !== null}
        onHide={resetForm}
        style={{ width: '40rem' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(form);
          }}
        >
          <div className="mb-3">
            <label htmlFor="keterangan">Jenis</label>
            <InputText
              id="keterangan"
              name="keterangan"
              value={form.KETERANGAN}
              className="w-full mt-2"
              readOnly
            />

          </div>

            <div className="mb-3">
            <label htmlFor="KODE">Kode</label>
            <InputText
              id="KODE"
              name="KODE"
              value={form.KODE || ''}
              onChange={handleChange}
              className="w-full mt-2"
              required
            />
          </div>


          <div className="mb-3">
            <label htmlFor="nama">Nama</label>
            <InputText
              id="nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full mt-2"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="alamat">Alamat</label>
            <InputText
              id="alamat"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="w-full mt-2"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              label="Simpan"
              icon="pi pi-save"
              severity="success"
            />
          </div>
        </form>
      </Dialog>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default GudangPage;


