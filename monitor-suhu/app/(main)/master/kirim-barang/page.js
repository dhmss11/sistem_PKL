'use client';

import { useEffect, useState, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

export default function MasterExportPage() {
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [selectedFromGudang, setSelectedFromGudang] = useState(null);
  const [selectedToGudang, setSelectedToGudang] = useState(null);
  const [satuanOptions, setSelectSatuan] = useState(null);
  const [satuanSelect, setSatuanSelect] = useState(null)

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

const fetchSatuan = useCallback(async () => {
  try {
    const res = await fetch("/api/satuan");
    const json = await res.json();

    if (json.status === "00" ) {
      const options = json.satuanStock.map((KODE) => ({
        label: KODE,
        value: KODE,
      }));
      setSelectSatuan(options);
    } else {
      console.warn("Data satuan tidak valid:", json);
      setSelectSatuan([]); // kosongkan jika tidak ada data
    }
  } catch (error) {
    console.error("Form Gagal ambil satuan", error);
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
    fetchSatuan();
  }, [fetchGudang, fetchSatuan]);

  return (
    <div className="card">
      <Toast />
      <h2 className="text-xl font-bold mb-4">Kirim Barang</h2>
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

        {/* <div className="mb-3 p-2 border rounded-lg bg-gray-50"> untuk tabel */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-1/2 ">
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
        <label className="block text-sm font-medium mb-1">satuan</label>
            <Dropdown
              id='satuan'
              name='satuan'
              className="w-full"
              placeholder="Pilih satuan"
              options={satuanOptions}
              value={satuanSelect}
              onChange={(e) => setSatuanSelect(e.value)}
              optionLabel="label"
              optionValue="value"
              showClear
            />
      </div>
      </div>


     <div className='mt-3'>
      <DataTable
        size="small"
        className="text-sm"
        value={exportData}
        paginator
        rows={10}
        loading={loading}
        scrollable
      >
        <Column field="FAKTUR" header="FAKTUR" />
        <Column field="TGL" header="TGL" />
        <Column field="GUDANG_KIRIM" header="GUDANG_KIRIM" />
        <Column field="GUDANG_TERIMA" header="GUDANG_TERIMA" />
        <Column field="KODE" header="KODE" />
        <Column field="QTY" header="QTY" />
        <Column field="SATUAN" header="SATUAN" />
        <Column field="USERNAME" header="USERNAME" />
        <Column field="DATETIME" header="DATETIME" />
        <Column field="STATUS" header="STATUS" />
      </DataTable>
    </div>
    </div>
  );
}
