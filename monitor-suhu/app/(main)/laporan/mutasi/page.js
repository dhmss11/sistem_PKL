'use client';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import ToastNotifier from '@/app/components/ToastNotifier';

const LaporanMutasiGudang = () => {
  const toastRef = useRef(null);
  const [data, setData] = useState([]);
  const [dataLaporan, setDataLaporan] = useState([]); // ✅ state untuk laporan utama
  const [loading, setLoading] = useState(false);
  const [listGudang, setListGudang] = useState([]);
  const [selectedGudang, setSelectedGudang] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false); // ✅ state untuk dialog

  const fetchPreview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mutasi');
      const json = await res.json();
      if (json.status === '00') {
        const rows = Array.isArray(json.data) ? json.data : [];
        
        // Proses data preview sama seperti data utama
        const processedPreview = rows.map(item => ({
          POSTING: item.POSTING || item.tanggal_posting || item.posting || item.tgl_posting || "-",
          TGL: item.TGL || item.tanggal || item.tgl || item.tanggal_mutasi || "-",
          FAKTUR: item.FAKTUR || item.no_faktur || item.faktur || "-",
          DARI: item.gudang_asal || item.DARI || item.GUDANG_ASAL || "-",
          KE: item.gudang_tujuan || item.KE || item.GUDANG_TUJUAN || "-",
          BARCODE: item.BARCODE || item.barcode || item.kode_barang || "-",
          QTY: item.QTY || item.qty || item.quantity || item.jumlah || 0,
          NAMA: item.NAMA || item.NAMA_BARANG || item.nama_produk || item.nama_barang || item.nama || "-"
        }));
        
        setDataLaporan(processedPreview);
        setPreviewVisible(true); // ✅ tampilkan dialog setelah data siap
      } else {
        toastRef.current?.showToast('99', 'Terjadi kesalahan ambil preview');
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Terjadi kesalahan ambil preview');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/laporanmutasi');
      const json = await res.json();
      if (json.status === '00') {
        const rows = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.data?.rows)
          ? json.data.rows
          : [];
        setData(rows);

        const grouped = {};
        const gudangSet = new Set();

        rows.forEach(item => {
          const gudangAsal = item.gudang_asal || item.DARI || item.GUDANG_ASAL || "-";
          const gudangTujuan = item.gudang_tujuan || item.KE || item.GUDANG_TUJUAN || "-";
          const key = `${item.FAKTUR || item.no_faktur}-${item.BARCODE || item.barcode}`;

          gudangSet.add(gudangAsal);
          gudangSet.add(gudangTujuan);

          if (!grouped[key]) {
            grouped[key] = {
              POSTING: item.POSTING || item.tanggal_posting || item.posting || item.tgl_posting,
              TGL: item.TGL || item.tanggal || item.tgl || item.tanggal_mutasi,
              FAKTUR: item.FAKTUR || item.no_faktur || item.faktur,
              DARI: gudangAsal,
              KE: gudangTujuan,
              BARCODE: item.BARCODE || item.barcode || item.kode_barang,
              QTY: item.QTY || item.qty || item.quantity || item.jumlah,
              NAMA: item.NAMA || item.NAMA_BARANG || item.nama_produk || item.nama_barang || item.nama
            };
          }
        });

        setDataLaporan(Object.values(grouped));
        
        // Set options untuk dropdown gudang
        const gudangOptions = Array.from(gudangSet)
          .filter(g => g !== "-")
          .map(g => ({ label: g, value: g }));
        setListGudang(gudangOptions);

      } else {
        toastRef.current?.showToast(json.status, json.message);
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Gagal mengambil data Laporan Mutasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data berdasarkan gudang yang dipilih
  const filteredData = selectedGudang
    ? dataLaporan.filter(item =>
        item.DARI === selectedGudang || item.KE === selectedGudang
      )
    : dataLaporan;

  const handleDownload = async () => {
    try {
      let url = "/api/mutasi/export";

      // Tambahkan parameter filter gudang jika ada
      if (selectedGudang) {
        url += `?gudang=${selectedGudang}`;
      }

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error("Gagal Download Laporan");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `laporan_mutasi_gudang${selectedGudang ? '_' + selectedGudang : ''}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toastRef.current?.showToast('00', 'Laporan berhasil didownload');
    } catch (error) {
      console.error('Download error:', error);
      toastRef.current?.showToast('99', 'Terjadi kesalahan saat download laporan');
    }
  };

  // Handle delete mutasi in preview
  const handleDelete = async (rowData) => {
    if (!rowData.FAKTUR) {
      toastRef.current?.showToast('99', 'Data tidak valid untuk dihapus');
      return;
    }

    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus mutasi dengan faktur ${rowData.FAKTUR}?`,
      header: 'Konfirmasi Hapus Mutasi',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          // Simulasi delete dari dataLaporan
          const updatedData = dataLaporan.filter(item => item.FAKTUR !== rowData.FAKTUR);
          setDataLaporan(updatedData);
          toastRef.current?.showToast('00', `Mutasi ${rowData.FAKTUR} berhasil dihapus (simulasi)`);
        } catch (err) {
          console.error('Error delete:', err);
          toastRef.current?.showToast('99', `Terjadi kesalahan saat hapus mutasi: ${err.message}`);
        }
      },
      acceptLabel: 'Ya, Hapus',
      rejectLabel: 'Batal',
      acceptClassName: 'p-button-danger'
    });
  };

  // Action template for preview table
  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => handleDelete(rowData)}
        title="Hapus Mutasi"
        tooltip="Hapus"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  // Quantity body template
  const qtyBodyTemplate = (rowData) => {
    return (
      <span style={{ textAlign: 'right', display: 'block' }}>
        {rowData.QTY || 0}
      </span>
    );
  };

  // Date body template - improved to handle various date formats
  const dateBodyTemplate = (rowData, field = 'POSTING') => {
    const dateValue = field === 'TGL' ? rowData.TGL : rowData.POSTING;

    if (!dateValue) return '-';

    try {
      let date;
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else {
        date = new Date(dateValue);
      }

      if (isNaN(date.getTime())) {
        return dateValue;
      }

      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      console.warn('Error parsing date:', dateValue, err);
      return dateValue;
    }
  };

  const postingDateTemplate = (rowData) => dateBodyTemplate(rowData, 'POSTING');
  const tanggalTemplate = (rowData) => dateBodyTemplate(rowData, 'TGL');

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Laporan Mutasi Gudang</h3>

      <div className="flex items-center gap-3 mb-3">
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          onClick={fetchData}
          className="p-button-outlined"
          disabled={loading}
        />
        <Button
          label="Preview Laporan"
          icon="pi pi-eye"
          onClick={fetchPreview}
          className="p-button-info"
          disabled={loading}
        />

        <Dropdown
          value={selectedGudang}
          options={listGudang}
          onChange={(e) => setSelectedGudang(e.value)}
          placeholder="Filter Gudang"
          showClear
          className="w-64 ml-auto"
          disabled={loading}
        />
      </div>

      {selectedGudang && (
        <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
          <small>
            <i className="pi pi-filter mr-2"></i>
            Filter aktif: {selectedGudang} ({filteredData.length} data)
          </small>
        </div>
      )}

      {/* Tabel utama */}
      <DataTable
        value={filteredData}
        paginator
        rows={10}
        loading={loading}
        stripedRows
        emptyMessage="Tidak ada data mutasi"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
      >
        <Column
          field="POSTING"
          header="Posting"
          body={postingDateTemplate}
          sortable
          style={{ minWidth: '100px' }}
        />
        <Column
          field="TGL"
          header="Tanggal"
          body={tanggalTemplate}
          sortable
          style={{ minWidth: '100px' }}
        />
        <Column field="FAKTUR" header="No. Faktur" sortable />
        <Column field="DARI" header="Dari Gudang" sortable />
        <Column field="KE" header="Ke Gudang" sortable />
        <Column field="BARCODE" header="Barcode" sortable />
        <Column field="NAMA" header="Nama Barang" sortable style={{ minWidth: '150px' }} />
        <Column field="QTY" header="Qty" body={qtyBodyTemplate} sortable />
      </DataTable>

      {/* Dialog preview */}
      <Dialog
        header={`Preview Laporan Mutasi Gudang (${dataLaporan?.length || 0} data)`}
        visible={previewVisible}
        style={{ width: '95vw', maxWidth: '1400px' }}
        onHide={() => setPreviewVisible(false)}
        maximizable
        footer={
          <div className="flex justify-end items-center">
            <Button
              label="Download"
              icon="pi pi-download"
              onClick={() => {
                handleDownload();
                setPreviewVisible(false);
              }}
              className="p-button-success"
              disabled={dataLaporan?.length === 0}
            />
          </div>
        }
      >
        <div className="preview-content">
          {loading ? (
            <div className="text-center p-8">
              <i className="pi pi-spinner pi-spin text-4xl text-blue-500 mb-3"></i>
              <p>Memuat data preview...</p>
            </div>
          ) : !dataLaporan || dataLaporan.length === 0 ? (
            <div className="text-center p-8">
              <i className="pi pi-info-circle text-4xl text-gray-400 mb-3"></i>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada data mutasi</h4>
              <p className="text-gray-500">Belum ada transaksi mutasi gudang yang dapat ditampilkan</p>
              <Button
                label="Refresh Data"
                icon="pi pi-refresh"
                onClick={() => {
                  fetchData();
                  fetchPreview();
                }}
                className="mt-4 p-button-outlined"
              />
            </div>
          ) : (
            <>
              <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-400">
                <small className="text-blue-700">
                  <i className="pi pi-info-circle mr-2"></i>
                  Preview menampilkan {dataLaporan.length} transaksi mutasi. Anda dapat hapus.
                </small>
              </div>

              <DataTable
                value={dataLaporan}
                loading={loading}
                stripedRows
                paginator
                rows={15}
                emptyMessage="Tidak ada data mutasi"
                scrollable
                scrollHeight="500px"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[15, 25, 50]}
                currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
                globalFilterFields={['FAKTUR', 'DARI', 'KE', 'BARCODE', 'NAMA']}
              >
                <Column
                  field="POSTING"
                  header="Posting"
                  body={postingDateTemplate}
                  sortable
                  style={{ minWidth: '100px' }}
                />
                <Column
                  field="TGL"
                  header="Tanggal"
                  body={tanggalTemplate}
                  sortable
                  style={{ minWidth: '100px' }}
                />
                <Column field="FAKTUR" header="No. Faktur" sortable style={{ minWidth: '120px' }} />
                <Column field="DARI" header="Dari" sortable style={{ minWidth: '100px' }} />
                <Column field="KE" header="Ke" sortable style={{ minWidth: '100px' }} />
                <Column field="BARCODE" header="Barcode" sortable style={{ minWidth: '120px' }} />
                <Column field="NAMA" header="Nama Barang" sortable style={{ minWidth: '150px' }} />
                <Column
                  field="QTY"
                  header="Qty"
                  body={qtyBodyTemplate}
                  sortable
                  style={{ minWidth: '80px' }}
                />
                <Column
                  header="Actions"
                  body={actionBodyTemplate}
                  style={{ width: '150px', textAlign: 'center' }}
                  exportable={false}
                />
              </DataTable>
            </>
          )}
        </div>
      </Dialog>

      <ConfirmDialog />
      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default LaporanMutasiGudang;