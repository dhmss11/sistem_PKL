'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import ToastNotifier from '@/app/components/ToastNotifier';
import { Calendar } from 'primereact/calendar';

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

  // Fetch all data
  const fetchKartuStock = async () => {
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
  };

  // Submit form (add/edit)
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
    } else {
      toastRef.current?.showToast('99', json.message || 'Gagal menyimpan data');
    }
  } catch {
    toastRef.current?.showToast('99', 'Terjadi kesalahan saat menyimpan');
  } finally {
    setDialogMode(null);
    setForm(defaultForm);
  }
};

  // Delete data
  const handleDelete = async (row) => {
    try {
      const res = await fetch(`/api/kartustock/${row.id}`, {
        method: 'DELETE'
      });

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

  // Edit data
  const handleEdit = (row) => {
    setForm({ ...row });
    setDialogMode('edit');
  };

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchKartuStock();
  }, []);

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

      <Dialog
        header={dialogMode === 'add' ? 'Tambah Data Kartu Stok' : 'Edit Data Kartu Stok'}
        visible={dialogMode !== null}
        onHide={() => setDialogMode(null)}
        style={{ width: '40rem' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {fieldLabels.map((field) => (
  <div className="mb-3" key={field}>
    <label htmlFor={field} className="block font-medium mb-1">{field}</label>

    {field === 'TGL' ? (
  <Calendar
    id={field}
    name={field}
    value={
      form[field] && /^\d{4}-\d{2}-\d{2}$/.test(form[field])
        ? (() => {
            // Parse tanggal dengan cara yang aman dari timezone
            const [year, month, day] = form[field].split('-').map(Number);
            return new Date(year, month - 1, day); // month - 1 karena JS month dimulai dari 0
          })()
        : null
    }
    onChange={(e) => {
      const date = e.value;
      if (date instanceof Date && !isNaN(date)) {
        // Gunakan getFullYear, getMonth, getDate untuk menghindari timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0'); 
        const formatted = `${year}-${month}-${day}`;

        setForm((prev) => ({ ...prev, [field]: formatted }));
      } else {
        setForm((prev) => ({ ...prev, [field]: '' }));
      }
    }}
    dateFormat="yy-mm-dd"
    showIcon
    className="w-full"
  />
) : (
  <InputText
    id={field}
    name={field}
    value={form[field] ?? ''}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }
    className="w-full"
  />
)}
  </div>
))}


          <div className="flex justify-end mt-4">
            <Button type="submit" label="Simpan" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default KartuStockPage;
