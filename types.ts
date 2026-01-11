
export interface LessonDetails {
  topik: string;
  mapel: string;
  kelas: string;
  madrasah: string;
  namaGuru: string;
  namaKepalaMadrasah: string;
  tempat: string;
  list_kbc_terpilih: string[];
  list_dpl_terpilih: string[];
  model_pembelajaran: string;
  stimulus_url: string;
}

export interface LearningObjective {
  id: string;
  deskripsi: string;
}

export interface TujuanPembelajaranResponse {
  tujuan_pembelajaran: LearningObjective[];
  ref_cp: string;
  alokasi_waktu: string;
}

export interface LearningFramework {
  praktik_pedagogis: {
    model_pembelajaran: string;
    metode: string[];
  };
  kemitraan_pembelajaran: string[];
  lingkungan_pembelajaran: {
    lingkungan_fisik: string;
    ruang_virtual: string;
    budaya_belajar: string;
  };
  pemanfaatan_digital: {
    stimulus: string;
    pencarian_informasi: string;
    pembuatan_produk: string;
  };
}

export interface PengalamanBelajar {
  penjelasan: string;
  aktivitas: {
    sintaks: string;
    deskripsi: string;
  }[];
}

export interface LearningScenario {
  kegiatan_awal: {
    apersepsi: string;
    pertanyaan_pemantik: {
      pertanyaan: string;
      kaitan_kbc: string;
    }[];
  };
  kegiatan_inti: {
    memahami: PengalamanBelajar;
    mengaplikasi: PengalamanBelajar;
    merefleksi: PengalamanBelajar;
  };
  kegiatan_penutup: {
    refleksi: string;
    tindak_lanjut: string;
  };
}

export interface RubricItem {
  kategori: string;
  kriteria: string;
}

export interface FormativeRubricItem {
    aspek: string;
    skor_4: string;
    skor_3: string;
    skor_2: string;
    skor_1: string;
}

export interface SummativeEssayRubricItem {
    aspek: string;
    skor_5: string;
    skor_3: string;
    skor_1: string;
}

export interface AlignmentValidation {
  item_asesmen: string;
  tp_terukur: string[];
  kbc_dpl_terukur: string[];
  catatan_keselarasan: string;
}

export interface AssessmentPackage {
  asesmen_diagnostik: {
    instrumen: string;
    pertanyaan: { id: string; pertanyaan: string }[];
    rubrik: RubricItem[];
  };
  asesmen_formatif: {
    instrumen: string;
    rubrik: FormativeRubricItem[];
  };
  asesmen_sumatif: {
    instrumen: string;
    pertanyaan: { id: string; pertanyaan: string }[];
    rubrik_esai: SummativeEssayRubricItem[];
  };
  validasi_keselarasan: AlignmentValidation[];
}
