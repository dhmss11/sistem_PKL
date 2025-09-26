'use client'

import { useEffect, useState, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { useAuth } from '@/app/(auth)/context/authContext';

export default function MutasiKirimData() {
  const [kirimData, setKirimData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [produkList, setProdukList] = useState([]);
  const [filteredProdukList, setFilteredProdukList] = useState([]);
  const { user } = useAuth();
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    TGL: '',
    KODE: '',
    NAMA: '',
    FAKTUR: '',
    QTY: '',
    BARCODE: '',
    harga: '',
    GUDANG_KIRIM: '',
    GUDANG_TERIMA: '',
    SATUAN: '',
  });

  const formatDateForDatabase = (date) => {
    if (!date) return '-';
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  const fetchGudang = useCallback(async () => {
    try {
      const res = await fetch("/api/gudang/nama");
      const json = await res.json();
      if (json.status === "00") {
        setGudangOptions(json.namaGudang.map(nama => ({ label: nama, value: nama })));
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data gudang', life: 3000 });
    }
  }, []);

  const fetchSatuan = useCallback(async () => {
    try {
      const res = await fetch("/api/satuan");
      const json = await res.json();
      if (json.status === "00" && Array.isArray(json.data)) {
        setSatuanOptions(json.data.map(item => ({ label: item.KODE, value: item.KODE })));
      }
    } catch (error) {
      console.error(error);
      setSatuanOptions([]);
    }
  }, []);

  // Fungsi untuk fetch produk berdasarkan gudang
  const fetchProdukByGudang = useCallback(async (gudangKirim = null) => {
    try {
      let url = "/api/stock";
      if (gudangKirim) {
        // Tambahkan parameter gudang ke URL
        url = `/api/stock?gudang=${encodeURIComponent(gudangKirim)}`;
      }
      
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === "00") {
        const produkData = json.data
          .filter(item => item.GUDANG) // Filter hanya produk yang memiliki gudang
          .map(item => ({
            ID: item.ID,
            KODE: item.KODE,
            BARCODE: item.BARCODE,
            NAMA: item.NAMA,
            HJ: item.HJ,
            SATUAN: item.SATUAN,
            QTY: item.QTY,
            GUDANG: item.GUDANG,
          }));
        
        if (gudangKirim) {
          setFilteredProdukList(produkData);
        } else {
          setProdukList(produkData);
          setFilteredProdukList(produkData);
        }
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data produk', life: 3000 });
    }
  }, []);

  const fetchProduk = useCallback(async () => {
    try {
      const res = await fetch("/api/stock");
      const json = await res.json();
      if (json.status === "00") {
        const produkData = json.data
          .filter(item => item.GUDANG) // Filter hanya produk yang memiliki gudang
          .map(item => ({
            ID: item.ID,
            KODE: item.KODE,
            BARCODE: item.BARCODE,
            NAMA: item.NAMA,
            HJ: item.HJ,
            SATUAN: item.SATUAN,
            QTY: item.QTY,
            GUDANG: item.GUDANG,
          }));
        setProdukList(produkData);
        setFilteredProdukList(produkData);
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data produk', life: 3000 });
    }
  }, []);

  const fetchKirimData = useCallback(async () => {
    try {
      const res = await fetch('/api/kirimdata');
      const json = await res.json();
      if (json.status === '00') {
        const formattedData = json.data.map((item, index) => ({
          id: item.id || index + 1,
          NAMA: item.nama || item.NAMA || '-',
          FAKTUR: item.faktur || item.FAKTUR || '-',
          TGL: item.TANGGAL || item.TGL || '-',
          GUDANG_KIRIM: item.dari || item.GUDANG_KIRIM || '-',
          GUDANG_TERIMA: item.ke || item.GUDANG_TERIMA || '-',
          KODE: item.kode || item.KODE || '-',
          QTY: item.qty || item.QTY || 0,
          BARCODE: item.barcode || item.BARCODE || '-',
          SATUAN: item.satuan || item.SATUAN || '-',
          USERNAME: item.username || item.USERNAME || '-',
          STATUS: item.status || item.STATUS || 'Pending'
        }));
        setKirimData(formattedData);
      } 
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGudang();
    fetchSatuan();
    fetchProduk();
    fetchKirimData();
  }, []);

  // Filter produk saat gudang kirim berubah
  useEffect(() => {
    if (formData.GUDANG_KIRIM) {
      // Filter produk berdasarkan gudang kirim, hanya produk yang memiliki gudang
      const filtered = produkList.filter(produk => 
        produk.GUDANG && produk.GUDANG === formData.GUDANG_KIRIM
      );
      setFilteredProdukList(filtered);
      
      // Atau fetch ulang dari API dengan parameter gudang
      // fetchProdukByGudang(formData.GUDANG_KIRIM);
    } else {
      // Jika tidak ada gudang dipilih, tampilkan semua produk yang memiliki gudang
      const productsWithGudang = produkList.filter(produk => produk.GUDANG);
      setFilteredProdukList(productsWithGudang);
    }
  }, [formData.GUDANG_KIRIM, produkList]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset barcode input jika gudang kirim berubah
    if (field === 'GUDANG_KIRIM') {
      setFormData(prev => ({ ...prev, BARCODE: '' }));
    }
  };

  const generateFaktur = () => {
    const timestamp = Date.now();
    return `FA${timestamp}`;
  };

  const handleQtyChange = (id, newQty) => {
    if (newQty <= 0) {
      toast.current?.show({ 
        severity: 'warn', 
        summary: 'Invalid Quantity', 
        detail: 'Quantity harus lebih dari 0', 
        life: 3000 
      });
      return;
    }
    
    setKirimData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, QTY: newQty } : item
      )
    );
  };

  const handleSelect = (selectedProduct) => {
    // Validasi gudang kirim harus sudah dipilih
    if (!formData.GUDANG_KIRIM) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Gudang Belum Dipilih',
        detail: 'Silakan pilih gudang kirim terlebih dahulu',
        life: 3000
      });
      return;
    }

    setKirimData(prev => {
      const existing = prev.find(item => item.BARCODE === selectedProduct.BARCODE);

      let faktur = formData.FAKTUR;
      if (!faktur) {
        faktur = generateFaktur();
        setFormData(prevForm => ({ ...prevForm, FAKTUR: faktur }));
      }

      if (existing) {
        return prev.map(item =>
          item.BARCODE === selectedProduct.BARCODE
            ? { ...item, QTY: Number(item.QTY) + 1 }
            : item
        );
      } else {
        const newItem = {
          id: prev.length + 1,
          KODE: selectedProduct.KODE,
          BARCODE: selectedProduct.BARCODE,
          NAMA: selectedProduct.NAMA,
          QTY: 1,
          HARGA: selectedProduct.HJ,
          SATUAN: selectedProduct.SATUAN,
          FAKTUR: faktur,
          TGL: formData.TGL ? formatDateForDatabase(formData.TGL) : '-',
          GUDANG_KIRIM: formData.GUDANG_KIRIM || '-',
          GUDANG_TERIMA: formData.GUDANG_TERIMA || '-',
          USERNAME: user?.username || '-',
          STATUS: 'Pending'
        };
        return [...prev, newItem];
      }
    });

    setVisible(false);
    setFormData(prev => ({ ...prev, BARCODE: '' }));
    toast.current?.show({
      severity: 'success',
      summary: 'Produk Ditambahkan',
      detail: `${selectedProduct.NAMA} berhasil ditambahkan`,
      life: 3000
    });
  };

  const handleBarcodeEnter = (e) => {
    if (e.key !== 'Enter') return;
    
    // Validasi gudang kirim harus sudah dipilih
    if (!formData.GUDANG_KIRIM) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Gudang Belum Dipilih',
        detail: 'Silakan pilih gudang kirim terlebih dahulu',
        life: 3000
      });
      return;
    }

    const code = (formData.BARCODE || '').toString().trim();
    if (!code) return;
    
    // Cari dari filtered list (berdasarkan gudang) dan pastikan produk memiliki gudang
    const found = filteredProdukList.find(p => 
      (p.BARCODE || '').toString() === code && p.GUDANG
    );
    
    if (found) {
      handleSelect(found);
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Tidak ditemukan',
        detail: `Barcode "${code}" tidak ada di gudang ${formData.GUDANG_KIRIM}`,
        life: 3000
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.GUDANG_KIRIM || !formData.GUDANG_TERIMA || !formData.TGL) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Field Gudang dan Tanggal wajib diisi', life: 3000 });
      return;
    }

    if (kirimData.length === 0) {
      toast.current?.show({ severity: 'warn', summary: 'Kosong', detail: 'Belum ada item untuk disimpan', life: 2500 });
      return;
    }

    setSubmitLoading(true);
    try {
      for (let item of kirimData) {
        const payload = {
          nama: item.NAMA,
          faktur: item.FAKTUR || formData.FAKTUR || generateFaktur(),
          tgl: item.TGL && item.TGL !== '-' ? item.TGL : formatDateForDatabase(formData.TGL),
          gudang_kirim: item.GUDANG_KIRIM || formData.GUDANG_KIRIM,
          gudang_terima: item.GUDANG_TERIMA || formData.GUDANG_TERIMA,
          kode: item.KODE,
          qty: item.QTY,
          barcode: item.BARCODE,     
          satuan: item.SATUAN,      
          username: item.USERNAME || user?.username || '-',
        };

        const res = await fetch('/api/mutasi/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Gagal menyimpan salah satu item');
        }
      }

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan!', life: 3000 });
      setFormData({
        TGL: '', KODE: '', NAMA: '', FAKTUR: '', QTY: '', BARCODE: '', harga: '',
        GUDANG_KIRIM: '', GUDANG_TERIMA: '', SATUAN: ''
      });
      setKirimData([]);
      fetchKirimData();
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteRow = (id) => {
    setKirimData(prev => prev.filter(item => item.id !== id));
    toast.current?.show({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Data berhasil dihapus',
      life: 3000
    });
  };

  const qtyBodyTemplate = (rowData) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100%',
          paddingRight: '8px'
        }}
      >
        <InputNumber
          value={rowData.QTY}
          onValueChange={(e) => handleQtyChange(rowData.id, e.value)}
          min={1}
          style={{ width: '100%' }}
          inputStyle={{
            width: '60px',              
            transition: 'all 0.2s ease',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            textAlign: 'left',
            padding: '4px',
            fontSize: '14px',
            lineHeight: '1.2',
            verticalAlign: 'middle'
          }}
          onFocus={(e) => {
            e.target.style.width = '100px';
            e.target.style.border = '2px solid #1761b6ff';
            e.target.style.borderRadius = '6px';
            e.target.style.background = 'white';
            e.target.style.boxShadow = '0 0 0 3px rgba(244, 244, 244, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.width = '60px';
            e.target.style.border = 'none';
            e.target.style.background = 'transparent';
            e.target.style.boxShadow = 'none';
          }}
          size="small"
        />
      </div>
    );
  };

  return (
    <div className="card p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold mb-4">Kirim Barang</h2>

      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        {/* Form Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Dari Gudang *</label>
            <Dropdown 
              placeholder="Pilih Gudang" 
              options={gudangOptions} 
              value={formData.GUDANG_KIRIM} 
              onChange={(e) => handleInputChange('GUDANG_KIRIM', e.value)} 
              showClear 
              className="w-full"
            />
            {!formData.GUDANG_KIRIM && (
              <small className="text-orange-600">Pilih gudang untuk memfilter produk</small>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ke Gudang</label>
            <Dropdown 
              placeholder="Pilih Gudang" 
              options={gudangOptions} 
              value={formData.GUDANG_TERIMA} 
              onChange={(e) => handleInputChange('GUDANG_TERIMA', e.value)} 
              showClear 
              className="w-full"
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
          <div>
            <label className="block text-sm font-medium mb-1">
              BARCODE 
              {formData.GUDANG_KIRIM && (
                <span className="text-green-600 text-xs ml-1">({formData.GUDANG_KIRIM})</span>
              )}
            </label>
            <div className="p-inputgroup">
              <InputText
                placeholder={formData.GUDANG_KIRIM ? "Scan Barcode" : "Pilih gudang dulu"}
                value={formData.BARCODE}
                onChange={(e) => handleInputChange('BARCODE', e.target.value)}
                onKeyDown={handleBarcodeEnter}
                disabled={!formData.GUDANG_KIRIM}
              />
              <Button 
                icon="pi pi-search" 
                onClick={() => setVisible(true)} 
                disabled={!formData.GUDANG_KIRIM}
                tooltip={!formData.GUDANG_KIRIM ? "Pilih gudang kirim terlebih dahulu" : "Pilih produk"}
              />
            </div>
            {filteredProdukList.length > 0 && formData.GUDANG_KIRIM && (
              <small className="text-blue-600">
                {filteredProdukList.length} produk tersedia di {formData.GUDANG_KIRIM}
              </small>
            )}
          </div>
        </div>

        {/* Dialog Pilih Produk */}
        <Dialog 
          header={`Pilih Produk - ${formData.GUDANG_KIRIM || 'Semua Gudang'}`} 
          visible={visible} 
          style={{ width: '70vw' }} 
          onHide={() => setVisible(false)} 
          position="center"
        >
          <DataTable value={filteredProdukList} paginator rows={10} size="small">
            <Column field="KODE" header="KODE" sortable/>
            <Column field="BARCODE" header="BARCODE"/>
            <Column field="NAMA" header="NAMA"/>
            <Column field="QTY" header="STOCK"/>
            <Column field="SATUAN" header="SATUAN"/>
            <Column field="GUDANG" header="GUDANG" />
            <Column field="HJ" header="HARGA" body={(rowData) => `Rp ${(rowData.HJ ?? 0).toLocaleString('id-ID')}`} />
            <Column header="AKSI" body={(rowData) => <Button label="Pilih" icon="pi pi-check" size="small" onClick={() => handleSelect(rowData)} />} />
          </DataTable>
        </Dialog>

        {/* Tabel Kirim Data */}
        <div className='mt-3'>
          <DataTable value={kirimData} paginator rows={10} size="small" loading={loading} scrollable emptyMessage="Tidak ada data yang ditemukan">
            <Column field='NAMA' header="NAMA" style={{ minWidth: '200px' }} />
            <Column field="FAKTUR" header="FAKTUR" style={{ minWidth: '120px' }} />
            <Column field="TGL" header="TANGGAL" style={{ minWidth: '100px' }} />
            <Column field="GUDANG_KIRIM" header="DARI GUDANG" style={{ minWidth: '120px' }} />
            <Column field="GUDANG_TERIMA" header="KE GUDANG" style={{ minWidth: '120px' }} />
            <Column field="KODE" header="KODE" style={{ minWidth: '80px' }} />
            <Column field="QTY" header="QTY" body={qtyBodyTemplate} style={{ minWidth: '80px', padding: '0 8px' }} />
            <Column field="BARCODE" header="BARCODE" style={{ minWidth: '100px' }} /> 
            <Column field="SATUAN" header="SATUAN" style={{ minWidth: '80px' }} />    
            <Column field="USERNAME" header="USER" style={{ minWidth: '100px' }} />
            <Column field="STATUS" header="STATUS" style={{ minWidth: '100px' }} />
            <Column
              header="AKSI"
              style={{ minWidth: '80px' }}
              body={(rowData) => (
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => handleDeleteRow(rowData.id)}
                />
              )}
            />
          </DataTable>
          <div className="w-full flex mt-3 justify-end gap-2">
            <Button
              label="Simpan"
              icon="pi pi-check"
              onClick={handleSubmit}
              loading={submitLoading}
              className="p-button-success ml-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}