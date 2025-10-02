import { db } from "../core/config/knex.js";
import { datetime, status } from "../utils/general.js";

// Get school settings
export const getSchoolSettings = async (req, res) => {
  try {
    // Ensure the table has all required columns
    const hasWebsite = await db.schema.hasColumn('school_settings', 'website');
    const hasKepalaSekolah = await db.schema.hasColumn('school_settings', 'kepala_sekolah');
    const hasNpsn = await db.schema.hasColumn('school_settings', 'npsn');
    
    if (!hasWebsite || !hasKepalaSekolah || !hasNpsn) {
      console.log('Adding missing columns to school_settings table...');
      await db.schema.alterTable('school_settings', (table) => {
        if (!hasWebsite) table.string('website', 255);
        if (!hasKepalaSekolah) table.string('kepala_sekolah', 255);
        if (!hasNpsn) table.string('npsn', 50);
      });
    }

    const settings = await db("school_settings")
      .select('*')
      .first();

    // If no settings exist, return default values
    if (!settings) {
      const defaultSettings = {
        id: null,
        school_name: "SMK Negeri 1 Surabaya",
        school_abbreviation: "SMKN 1 Surabaya",
        school_address: "Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252",
        school_phone: "031-5678910",
        school_email: "info@smkn1surabaya.sch.id",
        school_logo_url: null,
        website: "www.smkn1surabaya.sch.id",
        kepala_sekolah: "Drs. H. Sutrisno, M.Pd",
        npsn: "20567890",
        created_at: null,
        updated_at: null
      };
      
      return res.status(200).json({
        status: status.SUKSES,
        message: "Data pengaturan sekolah berhasil diambil (default)",
        data: defaultSettings,
        datetime: datetime(),
      });
    }

    res.status(200).json({
      status: status.SUKSES,
      message: "Data pengaturan sekolah berhasil diambil",
      data: settings,
      datetime: datetime(),
    });
  } catch (err) {
    console.error("Get school settings error:", err);
    res.status(500).json({
      status: status.ERROR,
      message: "Gagal mengambil data pengaturan sekolah",
      error: err.message,
      datetime: datetime(),
    });
  }
};

// Update or create school settings
export const updateSchoolSettings = async (req, res) => {
  try {
    console.log('Update school settings request body:', req.body);
    console.log('User from token:', req.user);
    
    const {
      school_name,
      school_abbreviation,
      school_address,
      school_phone,
      school_email,
      school_logo_url,
      website,
      kepala_sekolah,
      npsn
    } = req.body;

    // Validation
    if (!school_name) {
      return res.status(400).json({
        status: status.ERROR,
        message: "Nama sekolah wajib diisi",
        datetime: datetime(),
      });
    }

    // Check if settings already exist
    const existingSettings = await db("school_settings").first();

    let updatedSettings;

    if (existingSettings) {
      // Update existing settings
      await db("school_settings")
        .update({
          school_name,
          school_abbreviation: school_abbreviation || null,
          school_address: school_address || null,
          school_phone: school_phone || null,
          school_email: school_email || null,
          school_logo_url: school_logo_url || null,
          website: website || null,
          kepala_sekolah: kepala_sekolah || null,
          npsn: npsn || null,
          updated_at: new Date(),
        });

      // Get the updated data
      updatedSettings = await db("school_settings").first();
    } else {
      // Create new settings
      await db("school_settings")
        .insert({
          school_name,
          school_abbreviation: school_abbreviation || null,
          school_address: school_address || null,
          school_phone: school_phone || null,
          school_email: school_email || null,
          school_logo_url: school_logo_url || null,
          website: website || null,
          kepala_sekolah: kepala_sekolah || null,
          npsn: npsn || null,
          created_at: new Date(),
          updated_at: new Date(),
        });

      // Get the created data
      updatedSettings = await db("school_settings").first();
    }

    res.status(200).json({
      status: status.SUKSES,
      message: "Pengaturan sekolah berhasil diperbarui",
      data: updatedSettings,
      datetime: datetime(),
    });
  } catch (err) {
    console.error("Update school settings error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      status: status.ERROR,
      message: "Gagal memperbarui pengaturan sekolah",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      datetime: datetime(),
    });
  }
};

// Upload school logo
export const uploadSchoolLogo = async (req, res) => {
  try {
    // This would handle file upload logic
    // For now, we'll just return a placeholder response
    const logoUrl = req.body.logo_url || req.file?.path;
    
    if (!logoUrl) {
      return res.status(400).json({
        status: status.ERROR,
        message: "File logo tidak ditemukan",
        datetime: datetime(),
      });
    }

    res.status(200).json({
      status: status.SUKSES,
      message: "Logo sekolah berhasil diupload",
      data: { logo_url: logoUrl },
      datetime: datetime(),
    });
  } catch (err) {
    console.error("Upload school logo error:", err);
    res.status(500).json({
      status: status.ERROR,
      message: "Gagal mengupload logo sekolah",
      error: err.message,
      datetime: datetime(),
    });
  }
};
