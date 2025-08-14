'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import ToastNotifier from '@/app/components/ToastNotifier';

const defaultForm = {
  STATUS: '', FAKTUR: '', TGL: '', GUDANG: '', KODE: '', QTY: '', DEBET: '', KREDIT: '',
  HARGA: '', DISCITEM: '', DISCFAKTUR1: '', DISCFAKTUR2: '', HP: '', KETERANGAN: '',
  DATETIME: '', USERNAME: '', URUT: '', SATUAN: '', PPN: ''
};

const fieldLabels = Object.keys(defaultForm);

const KartuStockPage = () => {
  const toastRef = useRef(null);
  const [dataKartuStock, setDataKartuStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [dialogMode, setDialogMode] = useState(null);
  const [gudangOptions, setGudangOptions] = useState([]);

  const fetchKartuStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kartustock');
      const json = await res.json();
      if (json.status === '00') {
        setDataKartuStock(json.data);
      } else {
        toastRef.current?.showToast(json.status, json.message);
      }
    } catch {
      toastRef.current?.showToast('99', 'Gagal memuat data kartu stok');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGudang = useCallback(async () => {
    try {
      const res = await fetch("/api/gudang/nama");
      const json = await res.json();
      if (json.status === "00") {
        const options = json.namaGudang.map(nama => ({ value: nama, label: nama }));
        setGudangOptions(options);
      } else {
        setGudangOptions([]);
      }
    } catch {
      setGudangOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchGudang();
    fetchKartuStock();
  }, [fetchGudang, fetchKartuStock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCalendarChange = (name, value) => {
    if (!value) return setForm(prev => ({ ...prev, [name]: '' }));
    const formatted = value.toISOString().split('T')[0];
    setForm(prev => ({ ...prev, [name]: formatted }));
  };

  const handleSubmit = async () => {
    const isEdit = dialogMode === 'edit';
    const endpoint = isEdit ? `/api/kartustock/${form.id}` : '/api/kartustock';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (res.ok && json.status === '00') {
        toastRef.current?.showToast('00', isEdit ? 'Berhasil mengedit data' : 'Berhasil menambah data');
        fetchKartuStock();
        setDialogMode(null);
        setForm(defaultForm);
      } else {
        toastRef.current?.showToast('99', json.message || 'Gagal menyimpan data');
      }
    } catch {
      toastRef.current?.showToast('99', 'Terjadi kesalahan saat menyimpan');
    }
  };

  const handleEdit = (row) => {
    setForm({ ...row });
    setDialogMode('edit');
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      const res = await fetch(`/api/kartustock/${row.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.status === '00') {
        toastRef.current?.showToast('00', 'Data berhasil dihapus');
        fetchKartuStock();
      } else {
        toastRef.current?.showToast('99', json.message || 'Gagal menghapus data');
      }
    } catch {
      toastRef.current?.showToast('99', 'Gagal menghapus data');
    }
  };

  const renderDialogForm = () => (
    <Dialog
      header={dialogMode === 'add' ? 'Tambah Data Kartu Stok' : 'Edit Data Kartu Stok'}
      visible={!!dialogMode}
      onHide={() => setDialogMode(null)}
      style={{ width: '40rem' }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {fieldLabels.map((field) => {
          if (field === 'STATUS') {
            return (
              <div key={field} className="mb-3">
                <label htmlFor={field}>Status</label>
                <Dropdown
                  id={field}
                  name={field}
                  value={form[field]}
                  options={[{ label: 'Masuk', value: 'MASUK' }, { label: 'Keluar', value: 'KELUAR' }]}
                  onChange={(e) => setForm(prev => ({ ...prev, [field]: e.value }))}
                  placeholder="Pilih Status"
                  className="w-full mt-2"
                />
              </div>
            );
          }
          if (field === 'GUDANG') {
            return (
              <div key={field} className="mb-3">
                <label htmlFor={field}>Gudang</label>
                <Dropdown
                  id={field}
                  name={field}
                  value={form[field]}
                  options={gudangOptions}
                  onChange={(e) => setForm(prev => ({ ...prev, [field]: e.value }))}
                  placeholder="Pilih Gudang"
                  className="w-full mt-2"
                  optionLabel="label"
                  optionValue="value"
                />
              </div>
            );
          }
          if (field === 'TGL') {
            return (
              <div key={field} className="mb-3">
                <label htmlFor={field}>Tanggal</label>
                <Calendar
                  id={field}
                  name={field}
                  value={form[field] ? new Date(form[field] + 'T00:00:00') : null}
                  onChange={(e) => handleCalendarChange(field, e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  className="w-full mt-2"
                />
              </div>
            );
          }
          return (
            <div key={field} className="mb-3">
              <label htmlFor={field}>{field}</label>
              <InputText
                id={field}
                name={field}
                value={form[field] || ''}
                onChange={handleChange}
                className="w-full mt-2"
              />
            </div>
          );
        })}

        <div className="flex justify-end gap-2">
          <Button type="button" label="Batal" severity="secondary" onClick={() => setDialogMode(null)} />
          <Button type="submit" label="Simpan" severity="primary" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Kartu Stok</h3>

      <Button
        label="Tambah Data"
        icon="pi pi-plus"
        className="mb-3"
        onClick={() => {
          setForm(defaultForm);
          setDialogMode('add');
        }}
      />

      <DataTable value={dataKartuStock} paginator rows={10} loading={loading} scrollable size="small">
        {fieldLabels.map((field) => (
          <Column key={field} field={field} header={field} />
        ))}
        <Column
          header="Aksi"
          body={(rowData) => (
            <div className="flex gap-2">
              <Button icon="pi pi-pencil" size="small" severity="warning" onClick={() => handleEdit(rowData)} />
              <Button icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDelete(rowData)} />
            </div>
          )}
        />
      </DataTable>

      {renderDialogForm()}
      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default KartuStockPage;
