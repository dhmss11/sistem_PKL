'use client';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';   // ✅ import Dialog
import ToastNotifier from '@/app/components/ToastNotifier';

const LaporanStock = () => {
  const toastRef = useRef(null);
  const [dataLaporan, setDataLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listGudang, setListGudang] = useState([]);
  const [selectedGudang, setSelectedGudang] = useState(null);

  const [previewVisible, setPreviewVisible] = useState(false); // ✅ state untuk dialog

  const fetchPreview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stock/preview');
      const json = await res.json();
      if (json.status === '00') {
        setDataLaporan(json.data);
        setPreviewVisible(true);   // ✅ tampilkan dialog setelah data siap
      } else {
        toastRef.current?.showToast('99', 'Terjadi kesalahan ambil preview');
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Terjadi kesalahan ambil preview');
    } finally {
      setLoading(false);
    }
  };

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stock');
      const json = await res.json();
      if (json.status === '00') {
        const grouped = {};
        const gudangSet = new Set();

        json.data.forEach(item => {
          const gudangName = item.nama_gudang || item.NAMA_GUDANG || item.GUDANG || "-";
          const key = `${item.KODE}-${gudangName}`;
          gudangSet.add(gudangName);

          if (!grouped[key]) {
            grouped[key] = {
              KODE: item.KODE,
              NAMA: item.NAMA || item.KODE,
              GUDANG: gudangName,
              BARCODE: item.BARCODE,
              SATUAN: item.SATUAN,
              SISA: item.QTY
            };
          }
        });

        setDataLaporan(Object.values(grouped));
        setListGudang(Array.from(gudangSet).map(g => ({ label: g, value: g })));
      } else {
        toastRef.current?.showToast('99', json.message || 'Gagal memuat laporan stok');
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Terjadi kesalahan mengambil laporan stok');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const filteredData = selectedGudang
    ? dataLaporan.filter(item => item.GUDANG === selectedGudang)
    : dataLaporan;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Laporan Sisa Stok</h3>

      <div className="flex items-center gap-3 mb-3">
        <Button label="Refresh" icon="pi pi-refresh" onClick={fetchLaporan} />
        <Button label="Preview Laporan" icon="pi pi-eye" onClick={fetchPreview} />
        <Dropdown
          value={selectedGudang}
          options={listGudang}
          onChange={(e) => setSelectedGudang(e.value)}
          placeholder="Pilih Gudang"
          showClear
          className="w-64 ml-auto"
        />
      </div>

      {/* tabel utama */}
      <DataTable value={filteredData} paginator rows={10} loading={loading} stripedRows>
        <Column field="KODE" header="Kode Produk" />
        <Column field="NAMA" header="Nama Produk" />
        <Column field="GUDANG" header="Gudang" />
        <Column field="BARCODE" header="Barcode" />
        <Column field="SISA" header="Sisa Stock" />
        <Column field="SATUAN" header="Satuan" />
      </DataTable>

      {/* dialog preview */}
      <Dialog
        header="Preview Laporan Stok"
        visible={previewVisible}
        style={{ width: '80vw' }}
        onHide={() => setPreviewVisible(false)}  
      >
        <DataTable value={dataLaporan} loading={loading} stripedRows paginator rows={10}>
          <Column field="KODE" header="Kode Produk" />
          <Column field="NAMA" header="Nama Produk" />
          <Column field="GUDANG" header="Gudang" />
          <Column field="BARCODE" header="Barcode" />
          <Column field="SISA" header="Sisa Stock" />
          <Column field="SATUAN" header="Satuan" />
        </DataTable>
      </Dialog>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default LaporanStock;
