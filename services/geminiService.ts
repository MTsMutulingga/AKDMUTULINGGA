
import { GoogleGenAI, Type } from "@google/genai";
import type { 
  LessonDetails, 
  LearningObjective, 
  LearningScenario, 
  TujuanPembelajaranResponse, 
  LearningFramework,
  AssessmentPackage
} from '../types';

const SYSTEM_INSTRUCTION = `
[PERAN DAN IDENTITAS]
Anda adalah "Asisten Kurikulum Digital (AKD)", sebuah AI ahli pedagogi dan perancang kurikulum. Anda adalah arsitek RPP (Rencana Pelaksanaan Pembelajaran) yang membantu guru membuat dokumen yang koheren, terintegrasi, dan berkualitas tinggi.

[STANDAR KUALITAS]
Logika Anda mengacu pada struktur RPP KBC (Kurikulum Berbasis Cinta):
1. Keterkaitan (Alignment): Tujuan, Kegiatan, dan Asesmen harus terhubung erat.
2. Integrasi Tema: Nilai-nilai Panca Cinta (KBC) dan Profil Lulusan (DPL) harus terjalin dalam narasi pembelajaran.
3. Pembelajaran Mendalam: Alur kegiatan menggunakan kerangka Memahami, Mengaplikasi, dan Merefleksi.

[REFERENSI KURIKULUM]
Selaraskan dengan Capaian Pembelajaran (CP) dari Keputusan BSKAP No. 046/H/KR/2025 dan SK Dirjen Pendis No. 3302 Tahun 2024.
Gunakan Bahasa Indonesia formal sesuai EBI.
`;

export async function generateTujuanPembelajaran(details: LessonDetails): Promise<TujuanPembelajaranResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Hasilkan Tujuan Pembelajaran (TP) untuk: ${JSON.stringify(details)}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tujuan_pembelajaran: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                deskripsi: { type: Type.STRING, description: "Rumusan TP yang mengandung KKO dan integrasi KBC/DPL" }
              },
              required: ["id", "deskripsi"]
            }
          },
          ref_cp: { type: Type.STRING, description: "Deskripsi singkat CP yang dirujuk" }
        },
        required: ["tujuan_pembelajaran", "ref_cp"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Model returned empty response");
  return JSON.parse(text);
}

export async function generateKerangkaPembelajaran(details: LessonDetails & { tujuan_pembelajaran: LearningObjective[] }): Promise<LearningFramework> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Buat kerangka pembelajaran berdasarkan TP berikut: ${JSON.stringify(details)}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          praktik_pedagogis: {
            type: Type.OBJECT,
            properties: {
              model_pembelajaran: { type: Type.STRING },
              metode: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["model_pembelajaran", "metode"]
          },
          kemitraan_pembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
          lingkungan_pembelajaran: {
            type: Type.OBJECT,
            properties: {
              lingkungan_fisik: { type: Type.STRING },
              ruang_virtual: { type: Type.STRING },
              budaya_belajar: { type: Type.STRING }
            },
            required: ["lingkungan_fisik", "ruang_virtual", "budaya_belajar"]
          },
          pemanfaatan_digital: {
            type: Type.OBJECT,
            properties: {
              stimulus: { type: Type.STRING },
              pencarian_informasi: { type: Type.STRING },
              pembuatan_produk: { type: Type.STRING }
            },
            required: ["stimulus", "pencarian_informasi", "pembuatan_produk"]
          }
        },
        required: ["praktik_pedagogis", "kemitraan_pembelajaran", "lingkungan_pembelajaran", "pemanfaatan_digital"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Model returned empty response");
  return JSON.parse(text);
}

export async function generateSkenarioKegiatan(details: LessonDetails & { tujuan_pembelajaran: LearningObjective[] }): Promise<LearningScenario> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Rancang skenario kegiatan (Awal, Inti, Penutup) untuk: ${JSON.stringify(details)}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          kegiatan_awal: {
            type: Type.OBJECT,
            properties: {
              apersepsi: { type: Type.STRING },
              pertanyaan_pemantik: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pertanyaan: { type: Type.STRING },
                    kaitan_kbc: { type: Type.STRING }
                  },
                  required: ["pertanyaan", "kaitan_kbc"]
                }
              }
            },
            required: ["apersepsi", "pertanyaan_pemantik"]
          },
          kegiatan_inti: {
            type: Type.OBJECT,
            properties: {
              memahami: {
                type: Type.OBJECT,
                properties: {
                  penjelasan: { type: Type.STRING },
                  aktivitas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { sintaks: { type: Type.STRING }, deskripsi: { type: Type.STRING } },
                      required: ["sintaks", "deskripsi"]
                    }
                  }
                },
                required: ["penjelasan", "aktivitas"]
              },
              mengaplikasi: {
                type: Type.OBJECT,
                properties: {
                  penjelasan: { type: Type.STRING },
                  aktivitas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { sintaks: { type: Type.STRING }, deskripsi: { type: Type.STRING } },
                      required: ["sintaks", "deskripsi"]
                    }
                  }
                },
                required: ["penjelasan", "aktivitas"]
              },
              merefleksi: {
                type: Type.OBJECT,
                properties: {
                  penjelasan: { type: Type.STRING },
                  aktivitas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { sintaks: { type: Type.STRING }, deskripsi: { type: Type.STRING } },
                      required: ["sintaks", "deskripsi"]
                    }
                  }
                },
                required: ["penjelasan", "aktivitas"]
              }
            },
            required: ["memahami", "mengaplikasi", "merefleksi"]
          },
          kegiatan_penutup: {
            type: Type.OBJECT,
            properties: {
              refleksi: { type: Type.STRING },
              tindak_lanjut: { type: Type.STRING }
            },
            required: ["refleksi", "tindak_lanjut"]
          }
        },
        required: ["kegiatan_awal", "kegiatan_inti", "kegiatan_penutup"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Model returned empty response");
  return JSON.parse(text);
}

export async function generatePaketAsesmen(details: { 
  tujuan_pembelajaran: LearningObjective[]; 
  kegiatan_inti: { sintaks: string; deskripsi: string; }[]; 
  list_kbc_terpilih: string[]; 
  list_dpl_terpilih: string[] 
}): Promise<AssessmentPackage> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Buat paket asesmen lengkap berdasarkan data: ${JSON.stringify(details)}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          asesmen_diagnostik: {
            type: Type.OBJECT,
            properties: {
              instrumen: { type: Type.STRING },
              pertanyaan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { id: { type: Type.STRING }, pertanyaan: { type: Type.STRING } },
                  required: ["id", "pertanyaan"]
                }
              },
              rubrik: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { kategori: { type: Type.STRING }, kriteria: { type: Type.STRING } },
                  required: ["kategori", "kriteria"]
                }
              }
            },
            required: ["instrumen", "pertanyaan", "rubrik"]
          },
          asesmen_formatif: {
            type: Type.OBJECT,
            properties: {
              instrumen: { type: Type.STRING },
              rubrik: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    aspek: { type: Type.STRING },
                    skor_4: { type: Type.STRING },
                    skor_3: { type: Type.STRING },
                    skor_2: { type: Type.STRING },
                    skor_1: { type: Type.STRING }
                  },
                  required: ["aspek", "skor_4", "skor_3", "skor_2", "skor_1"]
                }
              }
            },
            required: ["instrumen", "rubrik"]
          },
          asesmen_sumatif: {
            type: Type.OBJECT,
            properties: {
              instrumen: { type: Type.STRING },
              pertanyaan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { id: { type: Type.STRING }, pertanyaan: { type: Type.STRING } },
                  required: ["id", "pertanyaan"]
                }
              },
              rubrik_esai: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    aspek: { type: Type.STRING },
                    skor_5: { type: Type.STRING },
                    skor_3: { type: Type.STRING },
                    skor_1: { type: Type.STRING }
                  },
                  required: ["aspek", "skor_5", "skor_3", "skor_1"]
                }
              }
            },
            required: ["instrumen", "pertanyaan", "rubrik_esai"]
          },
          validasi_keselarasan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item_asesmen: { type: Type.STRING },
                tp_terukur: { type: Type.ARRAY, items: { type: Type.STRING } },
                kbc_dpl_terukur: { type: Type.ARRAY, items: { type: Type.STRING } },
                catatan_keselarasan: { type: Type.STRING }
              },
              required: ["item_asesmen", "tp_terukur", "kbc_dpl_terukur", "catatan_keselarasan"]
            }
          }
        },
        required: ["asesmen_diagnostik", "asesmen_formatif", "asesmen_sumatif", "validasi_keselarasan"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Model returned empty response");
  return JSON.parse(text);
}
