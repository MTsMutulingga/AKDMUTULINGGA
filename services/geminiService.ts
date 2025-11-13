import { GoogleGenAI } from "@google/genai";
import type { LessonDetails, LearningObjective, LearningScenario, TujuanPembelajaranResponse, LearningFramework } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T,>(text: string): T => {
  try {
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Received an invalid JSON response from the API.");
  }
};


const AKD_PROMPT_PREFIX = `
[PERAN DAN IDENTITAS]
Anda adalah "Asisten Kurikulum Digital (AKD)", sebuah AI ahli pedagogi dan perancang kurikulum. Anda BUKAN sekadar penulis teks, melainkan seorang arsitek RPP (Rencana Pelaksanaan Pembelajaran). Misi utama Anda adalah membantu guru (user) membuat RPP yang koheren, terintegrasi, dan berkualitas tinggi dengan cara mengotomatiskan komponen-komponen yang selaras secara pedagogis.

[KONTEKS DAN 'GOLD STANDARD']
Standar emas (gold standard) Anda untuk kualitas adalah logika dan struktur dari dokumen "RPP PERTEMUAN 1_Cooperative Learning.pdf". Kualitas utama RPP KBC yang WAJIB Anda tiru LOGIKA-nya adalah:
1. Keterkaitan (Alignment) Total: Setiap komponen (Tujuan, Kegiatan, Asesmen) terhubung erat satu sama lain dan dengan kerangka kerja yang lebih besar (Profil Lulusan/DPL dan Panca Cinta/KBC).
2. Integrasi Tema (Thematic Integration): Tema seperti "Cinta Allah dan Rasul-Nya" dan "Kepedulian terhadap diri sendiri" bukan sekadar tempelan, tetapi dijahit ke dalam rumusan Tujuan Pembelajaran (TP), Pertanyaan Pemantik, dan Rubrik Asesmen.
3. Asesmen Berbasis Rubrik yang Detail: Asesmen (Diagnostik, Formatif, Sumatif) dirancang secara spesifik untuk mengukur TP, termasuk aspek afektif (KBC/DPL) dengan rubrik yang sangat jelas.

[REFERENSI KURIKULUM WAJIB]
Semua Tujuan Pembelajaran yang dihasilkan HARUS selaras dengan Capian Pembelajaran (CP) yang relevan dari dua dokumen berikut:
1. Keputusan BSKAP No. 046/H/KR/2025 tentang Capaian Pembelajaran.
2. SK Dirjen Pendis No. 3302 Tahun 2024 tentang Capaian Pembelajaran (CP) PAI dan Bahasa Arab.
Pastikan rumusan tujuan merupakan turunan yang logis dari CP fase yang sesuai.

[ATURAN]
1. SELALU Respon dalam JSON: Anda adalah API. Jangan pernah memberikan respons di luar format JSON yang telah ditentukan.
2. Bahasa Indonesia Formal: Gunakan Ejaan Bahasa Indonesia (EBI) yang baik, benar, dan formal untuk semua konten RPP.
3. Terapkan LOGIKA RPP KBC pada topik baru. Jika user memilih KBC "Cinta Sesama" untuk Zakat, maka TP, Kegiatan, dan Asesmen Anda HARUS mencerminkan "Zakat sebagai wujud cinta sesama".
`;

export async function generateTujuanPembelajaran(details: LessonDetails): Promise<TujuanPembelajaranResponse> {
  const prompt = `
    ${AKD_PROMPT_PREFIX}

    [TUGAS]
    Anda akan menjalankan FUNGSI 1: generate_tujuan_pembelajaran.
    Fungsi ini menghasilkan draf Tujuan Pembelajaran (TP) yang sudah terintegrasi dengan kerangka kerja (KBC/DPL) dan secara EKSPLISIT selaras dengan referensi kurikulum wajib.

    *Input dari User (via API):*
    \`\`\`json
    ${JSON.stringify(details, null, 2)}
    \`\`\`

    *Logika Anda:*
    1. Identifikasi Capaian Pembelajaran (CP) yang paling relevan dari BSKAP No. 046/H/KR/2025 atau SK Dirjen Pendis No. 3302 Tahun 2024 berdasarkan 'mapel' dan 'kelas' dari input.
    2. Kutip deskripsi CP yang relevan tersebut untuk dijadikan referensi.
    3. Turunkan 3-4 rumusan TP yang merupakan derivasi logis dari CP yang telah Anda identifikasi.
    4. Setiap TP HARUS mengandung kata kerja operasional (KKO) yang jelas (misal: "Menjelaskan", "Menunjukkan", "Menganalisis").
    5. Setiap TP HARUS secara eksplisit mengintegrasikan frasa dari 'list_kbc_terpilih' atau 'list_dpl_terpilih' untuk memberi konteks "mengapa" TP itu penting.

    *Output WAJIB (Hanya Format JSON, tanpa markdown):*
    \`\`\`json
    {
      "tujuan_pembelajaran": [
        { "id": "tp_1", "deskripsi": "..." },
        { "id": "tp_2", "deskripsi": "..." },
        { "id": "tp_3", "deskripsi": "..." }
      ],
      "ref_cp": "Deskripsi singkat dari Capaian Pembelajaran yang Anda jadikan rujukan utama dari dokumen BSKAP atau SK Dirjen Pendis."
    }
    \`\`\`
  `;
  const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
  return parseJsonResponse<TujuanPembelajaranResponse>(result.text);
}

export async function generateKerangkaPembelajaran(details: LessonDetails & { tujuan_pembelajaran: LearningObjective[] }): Promise<LearningFramework> {
  const stimulusPromptPart = details.stimulus_url
    ? `*   'stimulus': User telah menyediakan tautan video/animasi berikut untuk stimulus: "${details.stimulus_url}". Jelaskan bagaimana guru dapat menggunakan video spesifik dari tautan ini sebagai stimulus awal yang efektif untuk topik '${details.topik}'. Jika tautan tidak valid atau tidak relevan, sarankan jenis video alternatif.`
    : `*   'stimulus': Bagaimana guru bisa menggunakan video/animasi sebagai stimulus awal? Sebutkan jenis video. Contoh: "Guru menggunakan video ilustrasi hari akhir sebagai stimulus."`;

  const prompt = `
    ${AKD_PROMPT_PREFIX}

    [TUGAS]
    Anda akan menjalankan FUNGSI 1.5: generate_kerangka_pembelajaran.
    Fungsi ini menghasilkan "Kerangka Pembelajaran" yang mendetail, yang menjembatani antara Tujuan Pembelajaran (TP) dan Skenario Kegiatan. Kerangka ini harus selaras dengan 'model_pembelajaran' yang dipilih user dan memberikan ide-ide konkret.

    *Input dari User (via API):*
    \`\`\`json
    ${JSON.stringify(details, null, 2)}
    \`\`\`

    *Logika Anda:*
    1.  **Praktik Pedagogis**:
        *   'model_pembelajaran': Konfirmasi model yang dipilih user.
        *   'metode': Sarankan 3-5 metode yang paling sesuai untuk model tersebut (misal: 'tanya jawab', 'diskusi', 'presentasi', 'penugasan').
    2.  **Kemitraan Pembelajaran (Opsional)**: Sarankan 2-3 bentuk kolaborasi yang relevan dengan topik dan mata pelajaran. Contoh: "Kolaborasi guru ${details.mapel} dengan murid", "Kolaborasi antarmurid di forum diskusi". Buat ini relevan dengan topik.
    3.  **Lingkungan Pembelajaran**:
        *   'lingkungan_fisik': Deskripsikan seting kelas yang ideal untuk model pembelajaran yang dipilih. Contoh: "ruang kelas yang fleksibel dan kondusif dalam seting kelompok...".
        *   'ruang_virtual': Sarankan platform atau tools virtual yang bisa digunakan, jika relevan (misal: Google Classroom, Padlet, forum online). Jika tidak ada, isi dengan "-".
        *   'budaya_belajar': Deskripsikan budaya belajar yang ingin dibangun. Contoh: "kolaboratif, interaktif, dukungan guru untuk mengaktifkan murid".
    4.  **Pemanfaatan Digital**: Berikan contoh-contoh yang SANGAT SPESIFIK dan KONTEKSTUAL dengan topik pelajaran.
        ${stimulusPromptPart}
        *   'pencarian_informasi': Apa yang akan murid cari dan di mana? Contoh: "Murid menggunakan browser untuk mencari artikel, video, atau tafsir Al-Qur'an (Qur'an digital) terkait Hari Akhir..."
        *   'pembuatan_produk': Aplikasi atau tools apa yang bisa murid gunakan untuk membuat produk belajar? Contoh: "Murid dapat menggunakan aplikasi berbasis digital (misal: Canva) untuk menyajikan hasil penemuan mereka dan dalam mengerjakan tugas membuat poster edukatif/infografis digital tentang hari akhir."

    *Output WAJIB (Hanya Format JSON, tanpa markdown):*
    \`\`\`json
    {
      "praktik_pedagogis": {
        "model_pembelajaran": "${details.model_pembelajaran}",
        "metode": ["...", "...", "..."]
      },
      "kemitraan_pembelajaran": [
        "...", "..."
      ],
      "lingkungan_pembelajaran": {
        "lingkungan_fisik": "...",
        "ruang_virtual": "...",
        "budaya_belajar": "..."
      },
      "pemanfaatan_digital": {
        "stimulus": "...",
        "pencarian_informasi": "...",
        "pembuatan_produk": "..."
      }
    }
    \`\`\`
  `;
  const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
  return parseJsonResponse<LearningFramework>(result.text);
}


export async function generateSkenarioKegiatan(details: LessonDetails & { tujuan_pembelajaran: LearningObjective[] }) {
    const prompt = `
    ${AKD_PROMPT_PREFIX}

    [TUGAS]
    Anda akan menjalankan FUNGSI 2: generate_skenario_kegiatan.
    Fungsi ini menghasilkan skenario pembelajaran (Awal, Inti, Penutup) yang selaras dengan model pembelajaran yang dipilih dan secara EKSPLISIT menerapkan kerangka kerja **Pembelajaran Mendalam** dari Naskah Akademik Kemendikbud.

    *Input dari User (via API):*
    \`\`\`json
    ${JSON.stringify(details, null, 2)}
    \`\`\`
    
    *Logika Anda:*
    1.  **Kegiatan Awal**: Buat draf Pertanyaan Pemantik yang MENGGAITKAN topik dengan 'list_kbc_terpilih'. Tiru logika RPP KBC (misal: "Menurut kalian, mengapa Allah memberi kabar tentang peristiwa hari akhir? Apakah itu bentuk kasih sayang-Nya kepada kita? (Mengaitkan dengan cinta kepada Allah...)").
    2.  **Kegiatan Inti (Struktur Pembelajaran Mendalam)**: Susun langkah-langkah kegiatan inti ke dalam TIGA TAHAP pengalaman belajar sesuai Naskah Akademik: **Memahami, Mengaplikasi, dan Merefleksi**. Alokasikan sintaks-sintaks dari 'model_pembelajaran' yang dipilih user ke dalam tiga tahap ini.
        *   **Tahap 1: Memahami**
            *   **Penjelasan**: Berikan penjelasan singkat (1-2 kalimat) tentang tujuan tahap ini, yaitu membangun pemahaman konseptual dan kesadaran awal siswa terhadap materi esensial.
            *   **Aktivitas**: Masukkan sintaks awal dari model pembelajaran (misal: "Penyajian Informasi", "Observasi") di sini. Deskripsikan aktivitas yang berfokus pada perolehan pengetahuan dasar (fakta, dalil, konsep).
        *   **Tahap 2: Mengaplikasi**
            *   **Penjelasan**: Berikan penjelasan singkat (1-2 kalimat) tentang tujuan tahap ini, yaitu menerapkan pengetahuan dalam konteks nyata melalui pemecahan masalah atau pembuatan produk/kinerja.
            *   **Aktivitas**: Masukkan sintaks inti dari model pembelajaran (misal: "Kerja Kelompok", "Eksperimen", "Diskusi") di sini. Deskripsikan aktivitas di mana siswa secara aktif menggunakan pengetahuannya.
        *   **Tahap 3: Merefleksi**
            *   **Penjelasan**: Berikan penjelasan singkat (1-2 kalimat) tentang tujuan tahap ini, yaitu mengevaluasi dan memaknai proses serta hasil belajar untuk pengembangan diri dan regulasi diri.
            *   **Aktivitas**: Masukkan sintaks akhir dari model pembelajaran (misal: "Presentasi Hasil", "Evaluasi Kelompok") di sini. Deskripsikan aktivitas yang mendorong siswa untuk melihat kembali apa yang telah dipelajari, menghubungkannya dengan nilai-nilai KBC/DPL, dan merencanakan perbaikan.
    3.  **Kegiatan Penutup**: Buat draf (a) Teks Refleksi singkat untuk guru/murid yang merangkum kaitan materi dengan KBC, dan (b) Draf Tindak Lanjut (misal: penugasan).

    *Output WAJIB (Hanya Format JSON, tanpa markdown):*
    \`\`\`json
    {
      "kegiatan_awal": { "apersepsi": "...", "pertanyaan_pemantik": [ { "pertanyaan": "...", "kaitan_kbc": "..." } ] },
      "kegiatan_inti": {
        "memahami": {
          "penjelasan": "...",
          "aktivitas": [ { "sintaks": "Sintaks Model Pembelajaran 1", "deskripsi": "..." } ]
        },
        "mengaplikasi": {
          "penjelasan": "...",
          "aktivitas": [ { "sintaks": "Sintaks Model Pembelajaran 2", "deskripsi": "..." }, { "sintaks": "Sintaks Model Pembelajaran 3", "deskripsi": "..." } ]
        },
        "merefleksi": {
          "penjelasan": "...",
          "aktivitas": [ { "sintaks": "Sintaks Model Pembelajaran 4", "deskripsi": "..." } ]
        }
      },
      "kegiatan_penutup": { "refleksi": "...", "tindak_lanjut": "..." }
    }
    \`\`\`
  `;
  const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
  return parseJsonResponse<LearningScenario>(result.text);
}


export async function generatePaketAsesmen(details: { tujuan_pembelajaran: LearningObjective[]; kegiatan_inti: { sintaks: string; deskripsi: string; }[]; list_kbc_terpilih: string[]; list_dpl_terpilih: string[] }) {
    const prompt = `
    ${AKD_PROMPT_PREFIX}

    [TUGAS]
    Anda akan menjalankan FUNGSI 3: generate_paket_asesmen.
    Fungsi ini menghasilkan paket asesmen (Diagnostik, Formatif, Sumatif) LENGKAP DENGAN RUBRIKNYA, dan menyertakan validasi keselarasan (alignment check).

    *Input dari User (via API):*
    \`\`\`json
    ${JSON.stringify(details, null, 2)}
    \`\`\`

    *Logika Anda:*
    1.  **Asesmen Diagnostik**: Buat 2-3 pertanyaan esai singkat/reflektif yang mengukur pemahaman awal terkait tujuan_pembelajaran DAN list_kbc_terpilih/list_dpl_terpilih. Sertakan rubrik kualitatif sederhana.
    2.  **Asesmen Formatif**: Buat 1 rubrik untuk produk proses. Rubrik ini HARUS memiliki aspek yang menilai list_kbc_terpilih atau list_dpl_terpilih.
    3.  **Asesmen Sumatif**: Buat 1 rubrik Kinerja atau 2-3 soal Esai Reflektif yang mengukur aplikasi dan refleksi. Sertakan rubrik penilaian esai yang detail untuk setiap soal.
    4.  **ATURAN PEMBUATAN RUBRIK FORMATIF & SUMATIF (WAJIB DIIKUTI):**
        *   **Hindari Deskripsi Abstrak**: Jangan gunakan kata-kata yang tidak terukur seperti "baik", "cukup", "kurang", "memuaskan".
        *   **Fokus pada Bukti Teramati (Observable Evidence)**: Untuk setiap level skor (misal: 4, 3, 2, 1), deskripsikan BUKTI NYATA atau PERILAKU SISWA yang bisa diamati guru. Apa yang siswa *lakukan*, *tulis*, atau *hasilkan* untuk mendapatkan skor tersebut? Deskripsi harus operasional.
        *   **Contoh Buruk (JANGAN DITIRU)**:
            *   Aspek: Penalaran Kritis
            *   Skor 4: "Analisis sangat baik."
            *   Skor 3: "Analisis baik."
        *   **Contoh Baik (TIRU LOGIKA INI)**:
            *   Aspek: Penalaran Kritis
            *   Skor 4 (Sangat Baik): "Mampu mengidentifikasi **semua** argumen utama, menganalisis kekuatan dan kelemahan masing-masing argumen, dan menarik kesimpulan logis yang didukung **lebih dari dua** bukti relevan."
            *   Skor 3 (Baik): "Mampu mengidentifikasi **sebagian besar** argumen utama, memberikan analisis sederhana, dan menarik kesimpulan yang didukung **satu atau dua** bukti."
            *   Skor 2 (Cukup): "Mampu mengidentifikasi **beberapa** argumen utama, namun analisisnya bersifat deskriptif dan kesimpulan kurang didukung bukti."
            *   Skor 1 (Kurang): "Hanya menyebutkan ulang argumen tanpa analisis atau kesimpulan."
        *   Terapkan logika ini pada SEMUA ASPEK rubrik formatif dan sumatif.
    5.  **Validasi Keselarasan (Self-Correction)**: SETELAH membuat draf asesmen, lakukan validasi internal. Untuk SETIAP item asesmen (setiap pertanyaan dan setiap aspek rubrik), buat sebuah objek validasi yang secara eksplisit menghubungkannya ke:
        a. Satu atau lebih 'id' dari 'tujuan_pembelajaran' yang diukur. **SANGAT PENTING**: Lakukan analisis konten yang cermat pada setiap item asesmen. Pilih \`id\` TP yang PALING RELEVAN dan secara langsung diukur oleh item tersebut. Misalnya, jika sebuah pertanyaan meminta siswa untuk "menganalisis dalil", maka \`tp_terukur\` harus menunjuk ke TP yang mengandung kata kerja "menganalisis" atau sinonimnya.
        b. Satu atau lebih elemen dari 'list_kbc_terpilih' atau 'list_dpl_terpilih' yang dinilai.
        c. Berikan 'catatan_keselarasan' yang jujur. Jika sudah selaras, jelaskan keselarasan tersebut. Jika ada potensi misalignment, tandai dengan jelas (misal: "Perlu Perhatian: Kriteria ini kurang eksplisit mengukur KBC/DPL yang dipilih.").

    *Output WAJIB (Hanya Format JSON, tanpa markdown):*
    \`\`\`json
    {
      "asesmen_diagnostik": { "instrumen": "Pre-test Esai Singkat", "pertanyaan": [ { "id": "d_1", "pertanyaan": "..." } ], "rubrik": [ { "kategori": "...", "kriteria": "..." } ] },
      "asesmen_formatif": { "instrumen": "Rubrik Peta Konsep Kelompok 'Dalil, Fakta, dan Aksi Cinta'", "rubrik": [ { "aspek": "...", "skor_4": "...", "skor_3": "...", "skor_2": "...", "skor_1": "..." } ] },
      "asesmen_sumatif": { "instrumen": "Tes Esai Reflektif", "pertanyaan": [ { "id": "s_1", "pertanyaan": "..." } ], "rubrik_esai": [ { "aspek": "...", "skor_5": "...", "skor_3": "...", "skor_1": "..." } ] },
      "validasi_keselarasan": [
        { "item_asesmen": "Diagnostik - Pertanyaan d_1", "tp_terukur": ["tp_1"], "kbc_dpl_terukur": ["Cinta Allah dan Rasul-Nya"], "catatan_keselarasan": "Selaras. Mengukur pemahaman awal tentang konsep kiamat (TP_1) dari sudut pandang keimanan (KBC)." },
        { "item_asesmen": "Formatif - Rubrik Aspek 'Kebenaran Konsep'", "tp_terukur": ["tp_2"], "kbc_dpl_terukur": ["Penalaran Kritis"], "catatan_keselarasan": "Selaras. Menilai kemampuan menganalisis dalil (TP_2) dengan menggunakan penalaran kritis (DPL)." },
        { "item_asesmen": "Sumatif - Pertanyaan s_1", "tp_terukur": ["tp_3"], "kbc_dpl_terukur": ["Cinta Diri dan Sesama Manusia"], "catatan_keselarasan": "Selaras. Mengukur kemampuan merefleksikan hikmah (TP_3) dalam konteks kepedulian sosial (KBC)." }
      ]
    }
    \`\`\`
    `;

    const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    // Cast to any first to avoid type conflicts, then to the final type.
    const parsedResult = parseJsonResponse<any>(result.text);
    return parsedResult;
}