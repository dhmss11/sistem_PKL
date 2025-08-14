'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

export default function MutasiTerimaData() {
  const toastRef = useRef(null);
  const [terimaData, setTerimaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [selectedFromGudang, setSelectedFromGudang] = useState(null);
  const [selectedToGudang, setSelectedToGudang] = useState(null);

  const fetchGudang = useCallback(async () => {
    try {
      const res = await fetch("/api/gudang/nama");
      const json = await res.json();

      if (json.status === "00") {
        const options = json.namaGudang.map(nama => ({
          label: nama,
          value: nama,
        }));
        setGudangOptions(options);
      }
    } catch (error) {
      console.error("Form Gagal ambil nama gudang", error);
    }
  }, []);

  const fetchTerima = async () => {
    try {
      console.log('Fetching data from /api/terimabarang...');
      const res = await fetch('/api/terimabarang');
      const json = await res.json();
      
      console.log('Response status:', res.status); 
      console.log('Response data:', json);

      if (json.status === '00') {
        console.log('Data yang akan di-set:', json.data);
        console.log('Jumlah data:', json.data?.length || 0); 
        setTerimaData(json.data || []);
      } else {
        console.error('API Error:', json.status, json.message);
        toastRef.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: json.message || 'Gagal mengambil data',
          life: 3000
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Gagal mengambil data mutasi',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log('terimaData changed:', terimaData);
    console.log('terimaData length:', terimaData?.length || 0);
  }, [terimaData]);

  useEffect(() => {
    fetchTerima();
    fetchGudang();
  }, [fetchGudang]);

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <h2 className="text-xl font-bold mb-4">Terima Barang</h2>
      
      {/* Debug info - remove in production */}
      <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
      
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Dari Gudang</label>
          <Dropdown
            id='darigudang'
            name='darigudang'
            className="w-full"
            placeholder="Pilih Gudang"
            options={gudangOptions}
            value={selectedFromGudang}
            onChange={(e) => setSelectedFromGudang(e.value)}
            optionLabel="label"
            optionValue="value"
            showClear
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ke Gudang</label>
          <Dropdown
            id='kegudang'
            name='kegudang'
            className="w-full"
            placeholder="Pilih Gudang"
            options={gudangOptions}
            value={selectedToGudang}
            onChange={(e) => setSelectedToGudang(e.value)}
            optionLabel="label"
            optionValue="value"
            showClear
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal</label>
          <Calendar
            id='tanggal'
            name='tanggal'
            className='w-full'
            placeholder='Tanggal Kirim'
            showIcon
          />
        </div>
      </div>
      
      <div className="mb-3 p-2 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-1 mr-5">
          <label className='block text-sm font-medium mt-1'>Faktur</label>
          <InputText
            id='faktur'
            name='faktur'
            className='w-full'
            placeholder='Faktur'
          />
        </div>
      </div>

      <DataTable
        size='small'
        className='text-sm'
        value={terimaData}
        loading={loading}
        paginator
        rows={10}
        scrollable
        emptyMessage="Tidak ada data untuk ditampilkan"
      >
        <Column field="FAKTUR" header="FAKTUR" />
        <Column field="FAKTUR_KIRIM" header="FAKTUR_KIRIM" />
        <Column field="TGL" header="TGL" body={(rowData) => {
          const date = new Date(rowData.TGL);
          return date.toLocaleDateString('id-ID');
        }} />
        <Column field="GUDANG_TERIMA" header="GUDANG_TERIMA" />
        <Column field="GUDANG_KIRIM" header="GUDANG_KIRIM" />
        <Column field="KODE" header="KODE" />
        <Column field="QTY" header="QTY" />
        <Column field="BARCODE" header="BARCODE" />
        <Column field="SATUAN" header="SATUAN" />
        <Column field="USERNAME" header="USERNAME" />
        <Column field="DATETIME" header="DATETIME" body={(rowData) => {
          const datetime = new Date(rowData.DATETIME);
          return datetime.toLocaleString('id-ID');
        }} />
      </DataTable>
      
    </div>
  );
}