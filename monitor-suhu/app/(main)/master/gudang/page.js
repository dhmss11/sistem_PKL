'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ToastNotifier from '@/app/components/ToastNotifier';

const JENIS_OPTIONS = [
  { label: 'Baku', value: 'baku' },
  { label: 'Mentah', value: 'mentah' },
  { label: 'Transit', value: 'transit' },
];

const GudangPage = () => {
  const toastRef = useRef(null);
  const [gudang, setGudang] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedGudang, setSelectedGudang] = useState(null);
  const [form, setForm] = useState({
    jenis: '',
    nama: '',
    alamat: '',
    keterangan: ''
  });

  const fetchGudang = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gudang');
      const json = await res.json();

      if (json.data.status === '00') {
        setGudang(json.data.gudang);
      } else {
        toastRef.current?.showToast(json.data.status, json.data.message);
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
    let res;

    try {
      if (dialogMode === 'add') {
        res = await fetch('/api/gudang', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else if (dialogMode === 'edit' && selectedGudang) {
        res = await fetch(`/api/gudang/${selectedGudang.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      if (!res) throw new Error('Tidak ada respons dari server');
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${res.status}`);
      }

      const json = await res.json();
      toastRef.current?.showToast(json.data?.status ?? '00', json.data?.message);

      const newRow = json.data?.gudang;
      if (dialogMode === 'add') {
        setGudang((prev) => [...prev, newRow]);
      } else {
        setGudang((prev) =>
          prev.map((r) => (r.id === newRow.id ? newRow : r)),
        );
      }
    } catch (err) {
      console.error('Submit error:', err);
      toastRef.current?.showToast('99', err.message);
    } finally {
      setIsLoading(false);
      setForm({ jenis: '', nama: '', alamat: '', keterangan: '' });
      setDialogMode(null);
      setSelectedGudang(null);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Hapus gudang ${item.nama}?`)) return;
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

  useEffect(() => {
    fetchGudang();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Master Nama Gudang</h3>

      <div className="flex justify-end my-3">
        <Button
          label="Tambah Gudang"
          icon="pi pi-plus"
          className="text-sm"
          onClick={() => {
            setDialogMode('add');
            setForm({ jenis: '', nama: '', alamat: '', keterangan: '' });
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
        <Column field="jenis" header="Jenis" />
        <Column field="nama" header="Nama" />
        <Column field="alamat" header="Alamat" />
        <Column field="keterangan" header="Keterangan" />
        <Column
          header="Aksi"
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
          style={{ width: '150px' }}
        />
      </DataTable>

      <Dialog
        header={dialogMode === 'add' ? 'Tambah Gudang' : 'Edit Gudang'}
        visible={dialogMode !== null}
        onHide={() => setDialogMode(null)}
        style={{ width: '40rem' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(form);
          }}
        >
          <div className="mb-3">
            <label htmlFor="jenis">Jenis</label>
            <Dropdown
              id="jenis"
              name="jenis"
              value={form.jenis}
              options={JENIS_OPTIONS}
              onChange={handleChange}
              className="w-full mt-2"
              placeholder="Pilih jenis gudang"
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
            />
          </div>
          <div className="mb-3">
            <label htmlFor="keterangan">Keterangan</label>
            <InputText
              id="keterangan"
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              className="w-full mt-2"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" label="Submit" severity="success" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default GudangPage;


