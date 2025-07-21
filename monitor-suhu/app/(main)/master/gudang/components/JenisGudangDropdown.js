import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';

const JenisGudangDropdown = ({ value, onChange }) => {
  const jenisOptions = [
    { label: 'Baku', value: 'Baku' },
    { label: 'Mentah', value: 'Mentah' },
    { label: 'Transit', value: 'Transit' },
  ];

  return (
    <Dropdown
      value={value}
      options={jenisOptions}
      onChange={(e) => onChange(e.value)}
      placeholder="Pilih Jenis Gudang"
      className="w-full"
    />
  );
};

export default JenisGudangDropdown;
