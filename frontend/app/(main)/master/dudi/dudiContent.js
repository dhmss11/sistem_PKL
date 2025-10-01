'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import ToastNotifier from '@/app/components/ToastNotifier';

export const dynamic = "force-dynamic";

const defaultForm = {
  nama_perusahaan: '',
  alamat: '',
  email: '',
  tlpn: '',
  pj: '',
  statuss: 'aktif',
};

const DudiContent = () => {
  const toastRef = useRef(null);
  const [dudi, setDudi] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    aktif: 0,
    tidak: 0,
    siswa: 0,
  });
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedDudi, setSelectedDudi] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // fetch data DUDI
  const fetchDudi = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/dudi');
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        setDudi(json.data);
        setSummary({
          total: json.data.length,
          aktif: json.data.filter(d => d.statuss?.toLowerCase() === 'aktif').length,
          tidak: json.data.filter(d => d.statuss?.toLowerCase() === 'tidak aktif').length,
          siswa: json.data.reduce((acc, d) => acc + (d.jumlah_siswa ?? 0), 0),
        });
      }
    } catch (err) {
      console.error('Fetch DUDI error:', err);
      toastRef.current?.showToast('99', 'Gagal memuat data DUDI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    const url = dialogMode === 'add'
      ? '/api/dudi'
      : `/api/dudi/edit/${selectedDudi.id}`;

    const res = await fetch(url, {
      method: dialogMode === 'add' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const json = await res.json();

    if (res.ok && json.status === '00') {
      toastRef.current?.showToast('00', json.message);
      setDialogMode(null);
      setForm(defaultForm);
      setSelectedDudi(null);
      await fetchDudi();
    } else {
      toastRef.current?.showToast(json.status ?? '99', json.message);
    }
  } catch (err) {
    console.error('Update DUDI error:', err);
    toastRef.current?.showToast('99', 'Gagal menyimpan data');
  } finally {
    setIsSubmitting(false);
  }
};


  const handleDelete = async (row) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus DUDI "${row.nama_perusahaan}"?`)) return;
    try {
      const res = await fetch(`/api/dudi/${row.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (res.ok && json.status === '00') {
        toastRef.current?.showToast("00", json.message || "DUDI berhasil dihapus");
        await fetchDudi();
      } else {
        toastRef.current?.showToast("99", json.message || "Gagal menghapus DUDI");
      }
    } catch (err) {
      console.error("Delete DUDI error:", err);
      toastRef.current?.showToast("99", "Gagal menghapus DUDI");
    }
  };

  useEffect(() => {
    fetchDudi();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Manajemen DUDI</h2>

      {/* Statistik */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] p-4 rounded-2xl shadow bg-white">
          <p className="text-gray-500">Total DUDI</p>
          <h3 className="text-2xl font-bold">{summary.total}</h3>
        </div>
        <div className="flex-1 min-w-[200px] p-4 rounded-2xl shadow bg-white">
          <p className="text-gray-500">DUDI Aktif</p>
          <h3 className="text-2xl font-bold text-green-600">{summary.aktif}</h3>
        </div>
        <div className="flex-1 min-w-[200px] p-4 rounded-2xl shadow bg-white">
          <p className="text-gray-500">DUDI Tidak Aktif</p>
          <h3 className="text-2xl font-bold text-red-500">{summary.tidak}</h3>
        </div>
        <div className="flex-1 min-w-[200px] p-4 rounded-2xl shadow bg-white">
          <p className="text-gray-500">Total Siswa Magang</p>
          <h3 className="text-2xl font-bold text-blue-600">{summary.siswa}</h3>
        </div>
      </div>

      {/* Master DUDI */}
      <div className="card">
        <h3 className="text-xl font-semibold">Master DUDI</h3>

        <div className="flex justify-end my-3">
          <Button
            label="Tambah DUDI"
            icon="pi pi-plus"
            className="text-sm"
            onClick={() => {
              setDialogMode('add');
              setForm(defaultForm);
              setSelectedDudi(null);
            }}
          />
        </div>

        <DataTable
          size="small"
          className="text-sm"
          value={dudi}
          paginator
          rows={10}
          loading={isLoading}
          scrollable
        >
          <Column field="nama_perusahaan" header="Perusahaan" filter />
          <Column field="email" header="Email" />
          <Column field="tlpn" header="Telepon" />
          <Column field="pj" header="Penanggung Jawab" />
          <Column
            field="statuss"
            header="Status"
            body={(row) => (
              <Tag
                value={row.statuss?.toLowerCase() === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                severity={row.statuss?.toLowerCase() === 'aktif' ? 'success' : 'danger'}
              />
            )}
          />

          <Column
            header="Aksi"
            body={(row) => (
              <div className="flex gap-2">
                <Button
                  icon="pi pi-pencil text-sm"
                  size="small"
                  severity="warning"
                  onClick={() => {
                    setDialogMode('edit');
                    setSelectedDudi(row);
                    setForm({
                      nama_perusahaan: row.nama_perusahaan,
                      alamat: row.alamat,
                      email: row.email,
                      tlpn: row.tlpn,
                      pj: row.pj,
                      statuss: row.statuss,
                    });
                  }}
                />
                <Button
                  icon="pi pi-trash text-sm"
                  size="small"
                  severity="danger"
                  onClick={() => handleDelete(row)}
                />
              </div>
            )}
            style={{ width: '150px' }}
          />
        </DataTable>

        {/* Dialog Form */}
        <Dialog
          key={dialogMode}
          header={dialogMode === 'add' ? 'Tambah DUDI' : 'Edit DUDI'}
          visible={dialogMode !== null}
          style={{ width: '450px' }}
          modal
          onHide={() => setDialogMode(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-3">
              <label htmlFor="nama_perusahaan">Nama Perusahaan</label>
              <InputText
                id="nama_perusahaan"
                name="nama_perusahaan"
                value={form.nama_perusahaan}
                onChange={handleChange}
                className="w-full mt-3"
                placeholder="Nama Perusahaan"
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
                className="w-full mt-3"
                placeholder="Alamat"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full mt-3"
                placeholder="Email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tlpn">Telepon</label>
              <InputText
                id="tlpn"
                name="tlpn"
                value={form.tlpn}
                onChange={handleChange}
                className="w-full mt-3"
                placeholder="Telepon"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="pj">Penanggung Jawab</label>
              <InputText
                id="pj"
                name="pj"
                value={form.pj}
                onChange={handleChange}
                className="w-full mt-3"
                placeholder="Penanggung Jawab"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="statuss">Status</label>
              <Dropdown
                id="statuss"
                name="statuss"
                value={form.statuss}
                options={[
                  { label: 'Aktif', value: 'aktif' },
                  { label: 'Tidak Aktif', value: 'tidak aktif' },
                ]}
                onChange={(e) => setForm((prev) => ({ ...prev, statuss: e.value }))}
                className="w-full mt-3"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                label="Submit"
                severity="success"
                icon="pi pi-save"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </Dialog>

        <ToastNotifier ref={toastRef} />
      </div>
    </div>
  );
};

export default DudiContent;
