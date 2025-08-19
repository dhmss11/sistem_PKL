'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { useAuth } from '@/app/(auth)/context/authContext';

export default function MutasiKirimData() {
  const [kirimData, setKirimData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [produkList, setProdukList] = useState([]);
  const searchButtonRef = useRef(null);
  const { user } = useAuth();
   
  // Konsolidasi semua form state dalam satu object
  const [formData, setFormData] = useState({
    TGL: null,
    KODE: '',
    NAMA: '',
    FAKTUR: '',
    QTY: '',
    BARCODE: '',
    harga: '',
    GUDANG_KIRIM: null,
    GUDANG_TERIMA: null,
    SATUAN: null,
  });
    
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef(null);

  const formatDateForDatabase = (date) => {
    if (!date) return null;
    
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return date;
  };

  // Fixed: Add proper dependencies or empty arrays
  const fetchGudang = useCallback(async () => {
    try {
      const res = await fetch("/api/gudang/nama");
      const json = await res.json();

      if (json.status === "00") {
        const options = json.namaGudang.map(nama => ({ label: nama, value: nama }));
        setGudangOptions(options);
      }
    } catch (error) {
      console.error("Gagal ambil nama gudang", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data gudang', life: 3000 });
    }
  }, []);

  const fetchProduk = useCallback(async () => {
    try {
      const res = await fetch("/api/stock");
      const json = await res.json();

      if (json.status === "00") {
        const data = json.data.map(item => ({
          ID: item.ID,
          KODE: item.KODE,
          BARCODE: item.BARCODE, 
          NAMA: item.NAMA,
          HJ: item.HJ, 
          QTY: item.QTY,
        }));
        setProdukList(data);
      }
    } catch (error) {
      console.error("gagal ambil data produk:", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'gagal mengambil data produk',
        life: 3000
      });
    }
  }, []);

  const fetchSatuan = useCallback(async () => {
    try {
      const res = await fetch("/api/satuan");
      const json = await res.json();
      if (json.status === "00" && Array.isArray(json.data)) {
        const options = json.data.map(item => ({ label: item.KODE, value: item.KODE }));
        setSatuanOptions(options);
      } else {
        setSatuanOptions([]);
      }
    } catch (error) {
      console.error("Gagal ambil satuan", error);
      setSatuanOptions([]);
    }
  }, []);

  const fetchKirimData = useCallback(async () => {
    try {
      console.log("Fetching kirim data...");
      const res = await fetch('/api/kirimbarang', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Response bukan JSON:', text);
        throw new Error('Response is not JSON');
      }

      const json = await res.json();
      if (json.status === '00') {
        const rawData = Array.isArray(json.data) ? json.data : [];
        const formattedData = rawData.map((item, index) => ({
          id: item.id || index + 1,
          NAMA: item.NAMA,
          FAKTUR: item.FAKTUR || item.faktur || '-',
          TGL: item.TGL || item.tanggal || item.tgl || '-',
          GUDANG_KIRIM: item.GUDANG_KIRIM || item.gudang_kirim || item.DARI || item.dari || '-',
          GUDANG_TERIMA: item.GUDANG_TERIMA || item.gudang_terima || item.KE || item.ke || '-',
          KODE: item.KODE || item.kode || '-',
          QTY: item.QTY || item.qty || 0,
          BARCODE: item.BARCODE || item.barcode || '-',
          SATUAN: item.SATUAN || item.satuan || '-',
          USERNAME: item.USERNAME || item.username || item.user || '-',
          DATETIME: item.DATETIME || item.datetime || item.created_at || '-',
          STATUS: item.STATUS || item.status || 'Pending'
        }));
        setKirimData(formattedData);
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: json.message || 'Gagal mengambil data',
          life: 3000
        });
        setKirimData([]);
      }
    } catch (error) {
      console.error('Error fetching kirim data:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
      setKirimData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fixed: Remove the problematic dependencies from useEffect
  useEffect(() => {
    fetchGudang();
    fetchSatuan();
    fetchKirimData();
    fetchProduk();
  }, []); // Empty dependency array - runs only once on mount

  const handleInputChange = (field, value) => {
    console.log(`Setting ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelect = (selectedProduct) => {
    setFormData(prev => ({
      ...prev,
      KODE: selectedProduct.KODE,
      BARCODE: selectedProduct.BARCODE,
      NAMA: selectedProduct.NAMA,
      harga: selectedProduct.HJ 
    }));
    setVisible(false); 
    toast.current?.show({ 
      severity: 'success', 
      summary: 'Success', 
      detail: `Produk ${selectedProduct.NAMA} berhasil dipilih`, 
      life: 3000 
    });
  };

  const handleSubmit = async () => {
    console.log('Form data saat submit:', formData);
    
    if (!formData.GUDANG_KIRIM || !formData.GUDANG_TERIMA || !formData.TGL ||
        !formData.KODE || !formData.FAKTUR || !formData.QTY || !formData.SATUAN || !formData.NAMA) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Semua field harus diisi!', 
        life: 3000 
      });
      return;
    }

    if (formData.GUDANG_KIRIM === formData.GUDANG_TERIMA) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Gudang asal dan tujuan tidak boleh sama!', 
        life: 3000 
      });
      return;
    }
    
    if (isNaN(parseFloat(formData.QTY)) || parseFloat(formData.QTY) <= 0) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'QTY harus valid dan lebih dari 0!', 
        life: 3000 
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const formattedDate = formatDateForDatabase(formData.TGL);
      
      const payload = {
        GUDANG_KIRIM: formData.GUDANG_KIRIM,
        GUDANG_TERIMA: formData.GUDANG_TERIMA,
        NAMA: formData.NAMA,
        TGL: formattedDate,
        FAKTUR: formData.FAKTUR,
        KODE: formData.KODE,
        QTY: parseFloat(formData.QTY),
        BARCODE: formData.BARCODE,
        SATUAN: formData.SATUAN,
        STATUS: '1',
        USERNAME: user?.username
      };

      console.log('Payload yang dikirim:', payload);
      console.log('Formatted date:', formattedDate);

      const response = await fetch('/api/kirimbarang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (result.status === "00") {
        toast.current?.show({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Data berhasil disimpan!', 
          life: 3000 
        });
        
        setFormData({
          TGL: null,
          KODE: '',
          FAKTUR: '',
          QTY: '',
          BARCODE: '',
          NAMA: '',
          harga: '',
          GUDANG_KIRIM: null,
          GUDANG_TERIMA: null,
          SATUAN: null,
        });
        
        fetchKirimData();
      } else {
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: result.message || 'Gagal menyimpan data!', 
          life: 3000 
        });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.message, 
        life: 3000 
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = kirimData.filter(item => item.KODE.includes(searchTerm));
    setKirimData(filtered);
  };
 
  return (
    <div className="card p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold mb-4">Kirim Barang</h2>

      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Dari Gudang</label>
            <Dropdown
              placeholder="Pilih Gudang"
              options={gudangOptions}
              value={formData.GUDANG_KIRIM}
              onChange={(e) => handleInputChange('GUDANG_KIRIM', e.value)}
              optionLabel="label"
              optionValue="value"
              showClear
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ke Gudang</label>
            <Dropdown
              placeholder="Pilih Gudang"
              options={gudangOptions}
              value={formData.GUDANG_TERIMA}
              onChange={(e) => handleInputChange('GUDANG_TERIMA', e.value)}
              optionLabel="label"
              optionValue="value"
              showClear
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <Calendar
              placeholder="Tanggal Kirim"
              value={formData.TGL}
              onChange={(e) => handleInputChange('TGL', e.value)}
              showIcon
              dateFormat="dd/mm/yy"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Faktur</label>
            <InputText
              placeholder="Faktur"
              value={formData.FAKTUR}
              onChange={(e) => handleInputChange('FAKTUR', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">QTY</label>
            <InputText
              placeholder="QTY"
              value={formData.QTY}
              onChange={(e) => handleInputChange('QTY', e.target.value)}
              keyfilter="pnum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">BARCODE</label>
            <div className="p-inputgroup">
              <InputText
                id="barcode"
                name="barcode"
                placeholder="BARCODE"
                value={formData.BARCODE}
                onChange={(e) => handleInputChange('BARCODE', e.target.value)}
              />
              <Button
                icon="pi pi-search"
                onClick={() => setVisible(true)}
                ref={searchButtonRef}
              />
            </div>
          </div>
         
          <div>
            <label className="block text-sm font-medium mb-1">Satuan</label>
            <Dropdown
              placeholder="Pilih Satuan"
              options={satuanOptions}
              value={formData.SATUAN}
              onChange={(e) => handleInputChange('SATUAN', e.value)}
              optionLabel="label"
              optionValue="value"
              showClear
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            label="Simpan" 
            icon="pi pi-check" 
            onClick={handleSubmit}
            loading={submitLoading}
            className="p-button-success"
          />
        </div>
      </div>

      <Dialog
        header="Pilih Produk"
        visible={visible}
        style={{ width: '70vw' }}
        onHide={() => setVisible(false)}
        position="center"
      >
        <DataTable value={produkList} paginator rows={10} size="small">
          <Column field="KODE" header="KODE" sortable/>
          <Column field="BARCODE" header="BARCODE"/>
          <Column field="NAMA" header="NAMA"/>
          <Column field="QTY" header="QTY"/>
          <Column 
            field="HJ" 
            header="HARGA" 
            body={(rowData) => `Rp ${(rowData.HJ ?? 0).toLocaleString('id-ID')}`} 
          />
          <Column
            header="AKSI"
            body={(rowData) => (
              <Button 
                label="Pilih" 
                icon="pi pi-check" 
                size="small"
                onClick={() => handleSelect(rowData)} 
              />
            )}
          />
        </DataTable>
      </Dialog>
      
      <Dialog
        header="Form Search"
        visible={showSearchDialog}
        style={{ width: '30vw' }}
        onHide={() => setShowSearchDialog(false)}
      >
      </Dialog>
      
      <Dialog
        header='Form Search'
        visible={showForm}
        style={{width: '30vw'}}
        onHide={() => setShowForm(false)}
      />
     
      <div className='mt-3'>
        <DataTable
          size="small"
          className="text-sm"
          value={kirimData}
          paginator
          rows={10}
          loading={loading}
          scrollable
          emptyMessage="Tidak ada data yang ditemukan"
        >
          <Column field='NAMA' header="NAMA"/>
          <Column field="FAKTUR" header="FAKTUR" />
          <Column field="TGL" header="TANGGAL" />
          <Column field="GUDANG_KIRIM" header="DARI GUDANG" />
          <Column field="GUDANG_TERIMA" header="KE GUDANG" />
          <Column field="KODE" header="KODE" />
          <Column field="QTY" header="QTY" />
          <Column field="BARCODE" header="BARCODE"/>
          <Column field="SATUAN" header="SATUAN" />
          <Column field="USERNAME" header="USER" />
          <Column field="STATUS" header="STATUS" />
        </DataTable>
      </div>
    </div>
  );
}