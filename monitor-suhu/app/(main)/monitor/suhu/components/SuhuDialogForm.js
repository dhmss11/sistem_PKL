'use client';

import { Dialog } from 'primereact/dialog';
import { Formik, Form, ErrorMessage } from 'formik';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import * as Yup from 'yup';

/**
 * @typedef {Object} Props
 * @property {boolean} visible
 * @property {'add' | 'edit' | null} mode
 * @property {Array} mesin
 * @property {Object|null} initialData
 * @property {function} onHide
 * @property {function} onSubmit
 */

const defaultValues = {
  id_mesin: '',
  tanggal_input: '',
  keterangan_suhu: 0,
};

const validationSchema = Yup.object({
  id_mesin: Yup.string().required('Kode Mesin wajib diisi'),
  tanggal_input: Yup.date().required('Tanggal Input wajib diisi'),
  keterangan_suhu: Yup.number().typeError('Suhu harus berupa angka').required('Keterangan Suhu wajib diisi'),
});

/**
 * @param {Props} props
 */
const SuhuDialogForm = ({ visible, mode, mesin, initialData, onHide, onSubmit }) => {
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Data Suhu Mesin' : 'Tambah Data Suhu Mesin';

  return (
    <Dialog style={{ minWidth: '70vw' }} header={title} visible={visible} onHide={onHide}>
      <Formik
        initialValues={initialData ?? defaultValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          onSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {({ values, handleChange, setFieldValue, isSubmitting }) => (
          <Form>
            <div className="mt-3">
              <label htmlFor="id_mesin">Kode Mesin</label>
              <Dropdown
                id="id_mesin"
                name="id_mesin"
                className="w-full mt-2"
                value={values.id_mesin}
                onChange={(e) => setFieldValue('id_mesin', e.value)}
                options={mesin.map((m) => ({ label: `${m.nama_mesin} (${m.kode_mesin})`, value: m.id }))}
                placeholder="Pilih Mesin"
              />
              <ErrorMessage name="id_mesin" component="small" className="p-error" />
            </div>

            <div className="mt-3">
              <label htmlFor="tanggal_input">Tanggal Input</label>
              <InputText
                id="tanggal_input"
                name="tanggal_input"
                className="w-full mt-2"
                value={values.tanggal_input}
                onChange={handleChange}
                placeholder="yyyy-mm-dd"
              />
              <ErrorMessage name="tanggal_input" component="small" className="p-error" />
            </div>

            <div className="mt-3">
              <label htmlFor="keterangan_suhu">Keterangan Suhu</label>
              <div className="p-inputgroup mt-2">
                <InputNumber
                  id="keterangan_suhu"
                  name="keterangan_suhu"
                  useGrouping={false}
                  value={values.keterangan_suhu}
                  onValueChange={(e) => setFieldValue('keterangan_suhu', e.value ?? 0)}
                />
                <span className="p-inputgroup-addon">°C</span>
              </div>
              <ErrorMessage name="keterangan_suhu" component="small" className="p-error" />
            </div>

            <div className="flex justify-content-end gap-2 mt-4">
              <Button label={isEdit ? 'Update' : 'Simpan'} icon="pi pi-save" type="submit" severity="success" disabled={isSubmitting} />
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default SuhuDialogForm;
