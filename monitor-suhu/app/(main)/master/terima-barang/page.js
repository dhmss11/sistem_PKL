'use client';

import { useEffect, useState, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

export default function MasterImportPage() {
  const [Import, setImport] = useState([]);
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

  const fetchExportData = async () => {
    try {
      const res = await fetch('/api/export');
      const json = await res.json();
      setExportData(json.data || []);
    } catch (err) {
      console.error('Gagal ambil data export:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExportData();
    fetchGudang();
  }, [fetchGudang]);

    return (
    <div className="card">
      <Toast />
      <h2 className="text-xl font-bold mb-4">Kirim Barang</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* <div className="mb-4 p-3 border rounded-lg bg-gray-50"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
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
          <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <Calendar
              id="tanggal"
              name="tanggal"
              className="w-full"
              placeholder="Tanggal Kirim"
              showIcon
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-small mb-1">Kode</label>
            <InputText
              id="kode"
              name="kode"
              className="w-full"
              placeholder="kode"
            />
          </div>
        </div>
         <div className="mb-3 p-2 border rounded-lg bg-white-50"> 
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div>
      <label className='block text-sm font-medium mb-1'>Faktur</label>
      <InputText
        id='faktur'
        name='faktur'
        className='w-full'
        placeholder='Faktur'
      />
    </div>
    <div>
      <label className='block text-sm font-medium mb-1'>QTY</label>
      <InputText
        id='QTY'
        name='QTY'
        className='w-full'
        placeholder='QTY'
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Satuan</label>
      <Dropdown
        id='satuan'
        name='satuan'
        className="w-full"
        placeholder="Pilih satuan"
        optionLabel="label"
        optionValue="value"
        showClear
      />
    </div>
  </div>
</div>
     

      <DataTable
        size='small'
        className='text-sm'
        value={Import}
        paginator
        rows={10}
        scrollable
    >
        <Column field="faktur" header="FAKTUR" />
        <Column field="faktur_kirim" header="FAKTUR_KIRIM" />
        <Column field="tgl" header="TGL" />
        <Column field="gudang_terima" header="GUDANG_TERIMA" />
        <Column field="gudang_kirim" header="GUDANG_KIRIM" />
        <Column field="kode" header="KODE" />
        <Column field="qty" header="QTY" />
        <Column field="satuan" header="SATUAN" />
        <Column field="username" header="USERNAME" />
      </DataTable>
    </div>
    </div>
    </div>
  );
}
