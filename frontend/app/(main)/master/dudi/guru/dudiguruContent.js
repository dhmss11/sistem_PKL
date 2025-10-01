'use client';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import ToastNotifier from '@/app/components/ToastNotifier';

export const dynamic = 'force-dynamic';

const DudiGuruContent = () => {
  const toastRef = useRef(null);
  const [dudi, setDudi] = useState([]);
  const [summary, setSummary] = useState({ total: 0, siswa: 0, rata: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchDudi = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/dudi/guru');
      const json = await res.json();

      if (res.ok && Array.isArray(json.data)) {
        setDudi(json.data);

        const total = json.data.length;
        const siswa = json.data.reduce((acc, d) => acc + (d.jumlah_siswa ?? 0), 0);
        const rata = total > 0 ? Math.round(siswa / total) : 0;

        setSummary({ total, siswa, rata });
      } else {
        toastRef.current?.showToast('99', json.message || 'Gagal memuat data');
      }
    } catch (err) {
      console.error('Fetch DUDI guru error:', err);
      toastRef.current?.showToast('99', 'Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDudi();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Manajemen DUDI (Guru)</h2>

      {/* Ringkasan Statistik */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 p-4 rounded-2xl shadow bg-white min-w-[200px] text-center">
          <p className="text-gray-500">Total DUDI</p>
          <h3 className="text-2xl font-bold">{summary.total}</h3>
        </div>
        <div className="flex-1 p-4 rounded-2xl shadow bg-white min-w-[200px] text-center">
          <p className="text-gray-500">Total Siswa Magang</p>
          <h3 className="text-2xl font-bold">{summary.siswa}</h3>
        </div>
        <div className="flex-1 p-4 rounded-2xl shadow bg-white min-w-[200px] text-center">
          <p className="text-gray-500">Rata-rata Siswa/Perusahaan</p>
          <h3 className="text-2xl font-bold">{summary.rata}</h3>
        </div>
      </div>

      {/* Tabel DUDI */}
      <div className="card bg-white shadow rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">Daftar DUDI</h3>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Cari perusahaan, alamat, penanggung jawab..."
            />
          </span>
        </div>

        <DataTable
          value={dudi}
          paginator
          rows={5}
          loading={isLoading}
          size="small"
          className="text-sm"
          globalFilter={globalFilter}
          responsiveLayout="scroll"
          emptyMessage="Tidak ada data DUDI"
        >
          <Column field="nama_perusahaan" header="Perusahaan" sortable />
          <Column
            header="Kontak"
            body={(row) => (
              <div>
                {row.email && <div>Email: {row.email}</div>}
                {row.tlpn && <div>Telepon: {row.tlpn}</div>}
              </div>
            )}
          />
          <Column field="pj" header="Penanggung Jawab" sortable />
          <Column field="jumlah_siswa" header="Siswa Magang" sortable />
        </DataTable>

        {/* Toast Notifier */}
        <ToastNotifier ref={toastRef} />
      </div>
    </div>
  );
};

export default DudiGuruContent;
