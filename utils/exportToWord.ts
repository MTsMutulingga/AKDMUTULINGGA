
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  VerticalAlign,
  UnderlineType,
  PageOrientation,
} from 'docx';
import type {
  LessonDetails,
  LearningObjective,
  LearningFramework,
  LearningScenario,
  AssessmentPackage,
} from '../types';

interface RppData {
  lessonDetails: LessonDetails;
  learningObjectives: LearningObjective[];
  learningFramework: LearningFramework;
  learningScenario: LearningScenario;
  assessmentPackage: AssessmentPackage;
}

const HEADING_1 = { level: HeadingLevel.HEADING_1 };
const HEADING_2 = { level: HeadingLevel.HEADING_2 };
const HEADING_3 = { level: HeadingLevel.HEADING_3 };
const BOLD_TEXT = { bold: true };
const JUSTIFIED_ALIGN = { alignment: AlignmentType.JUSTIFIED };
const LEFT_ALIGN = { alignment: AlignmentType.LEFT };
const NO_BORDER = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const KBC_OPTIONS = ['Cinta Allah dan Rasul-Nya', 'Cinta Ilmu', 'Cinta Lingkungan', 'Cinta Diri dan Sesama Manusia', 'Cinta Tanah Air'];
const DPL_OPTIONS = ['Keimanan dan Ketakwaan kepada Tuhan YME', 'Kewargaan', 'Penalaran Kritis', 'Kreativitas', 'Kolaborasi', 'Kemandirian', 'Kesehatan', 'Komunikasi'];

const getFormattedDate = (place: string) => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(date);
    return `${place}, ${formattedDate}`;
};

export const exportToWord = (data: RppData) => {
  const {
    lessonDetails,
    learningObjectives,
    learningFramework,
    learningScenario,
    assessmentPackage,
  } = data;

  const doc = new Document({
    creator: 'Asisten Kurikulum Digital (AKD)',
    title: `RPP - ${lessonDetails.topik}`,
    description: 'Rencana Pelaksanaan Pembelajaran yang dihasilkan oleh AKD',
    sections: [
      {
        properties: {
            pageSize: {
                width: 11906, // A4 width in Twips
                height: 16840, // A4 height in Twips
                orientation: PageOrientation.PORTRAIT,
            },
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch
            },
        },
        children: [
            new Paragraph({ text: 'RENCANA PELAKSANAAN PEMBELAJARAN (RPP)', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: '(MENDALAM BERBASIS CINTA)', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
            new Paragraph(''),

          // A. Spesifikasi
          new Paragraph({ text: 'A. Spesifikasi', ...HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: NO_BORDER,
            columnWidths: [3000, 6500],
            rows: [
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('1. Madrasah')] }), new TableCell({ children: [new Paragraph(`: ${lessonDetails.madrasah}`)] }) ]}),
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('2. Mata Pelajaran')] }), new TableCell({ children: [new Paragraph(`: ${lessonDetails.mapel}`)] }) ]}),
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('3. Kelas / Semester')] }), new TableCell({ children: [new Paragraph(`: ${lessonDetails.kelas}`)] }) ]}),
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('4. Topik Pembelajaran')] }), new TableCell({ children: [new Paragraph(`: ${lessonDetails.topik}`)] }) ]}),
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('5. Alokasi Waktu')] }), new TableCell({ children: [new Paragraph(': 2 x 40 Menit')] }) ]}),
            ],
          }),
          new Paragraph(''),

          // B. Identifikasi
          new Paragraph({ text: 'B. Identifikasi', ...HEADING_1 }),
          new Paragraph({ text: '1. Kesiapan Murid (opsional)', ...HEADING_2 }),
          new Paragraph({
            text: 'Murid memiliki pemahaman awal tentang konsep dasar hari akhir dari pelajaran sebelumnya.',
            ...JUSTIFIED_ALIGN
          }),
          new Paragraph({ text: '2. Dimensi Profil Lulusan', ...HEADING_2 }),
          ...DPL_OPTIONS.map(option => new Paragraph({
              children: [
                  new TextRun(lessonDetails.list_dpl_terpilih.includes(option) ? '☑ ' : '☐ '),
                  new TextRun(option)
              ],
              indent: { left: 400 },
              ...LEFT_ALIGN
          })),
          new Paragraph({ text: '3. Topik Panca Cinta', ...HEADING_2 }),
          ...KBC_OPTIONS.map(option => new Paragraph({
              children: [
                  new TextRun(lessonDetails.list_kbc_terpilih.includes(option) ? '☑ ' : '☐ '),
                  new TextRun(option)
              ],
              indent: { left: 400 },
              ...LEFT_ALIGN
          })),
          new Paragraph({ text: '4. Materi Integrasi KBC', ...HEADING_2 }),
          new Paragraph({
            text: `Pembelajaran ini mengintegrasikan ${lessonDetails.list_kbc_terpilih.join(
              ' dan '
            )} dengan menekankan bagaimana keimanan pada hari akhir mendorong ${lessonDetails.list_dpl_terpilih.join(
              ' dan '
            )}.`,
            ...JUSTIFIED_ALIGN
          }),
          new Paragraph(''),

          // C. Desain Pembelajaran
          new Paragraph({ text: 'C. Desain Pembelajaran', ...HEADING_1 }),
          new Paragraph({ text: '1. Tujuan Pembelajaran', ...HEADING_2 }),
          ...learningObjectives.map(
            (obj) =>
              new Paragraph({ text: obj.deskripsi, numbering: { reference: 'default-numbering', level: 0 }, ...LEFT_ALIGN })
          ),
           new Paragraph({ text: '2. Kerangka Pembelajaran', ...HEADING_2 }),
            new Paragraph({ text: 'a. Praktik Pedagogis', ...HEADING_3 }),
            new Paragraph({ children: [new TextRun({text: "Model Pembelajaran: ", ...BOLD_TEXT}), new TextRun(learningFramework.praktik_pedagogis.model_pembelajaran)], ...LEFT_ALIGN }),
            new Paragraph({ children: [new TextRun({text: "Metode: ", ...BOLD_TEXT}), new TextRun(learningFramework.praktik_pedagogis.metode.join(', '))], ...LEFT_ALIGN }),
            new Paragraph({ text: 'b. Kemitraan Pembelajaran (Opsional)', ...HEADING_3 }),
            ...learningFramework.kemitraan_pembelajaran.map(item => new Paragraph({ text: item, bullet: { level: 0 }, ...LEFT_ALIGN })),
            new Paragraph({ text: 'c. Lingkungan Pembelajaran', ...HEADING_3 }),
            new Paragraph({ children: [new TextRun({text: "Lingkungan Fisik: ", ...BOLD_TEXT}), new TextRun(learningFramework.lingkungan_pembelajaran.lingkungan_fisik)], ...JUSTIFIED_ALIGN }),
            new Paragraph({ children: [new TextRun({text: "Ruang Virtual: ", ...BOLD_TEXT}), new TextRun(learningFramework.lingkungan_pembelajaran.ruang_virtual)], ...JUSTIFIED_ALIGN }),
            new Paragraph({ children: [new TextRun({text: "Budaya Belajar: ", ...BOLD_TEXT}), new TextRun(learningFramework.lingkungan_pembelajaran.budaya_belajar)], ...JUSTIFIED_ALIGN }),
            new Paragraph({ text: 'd. Pemanfaatan Digital', ...HEADING_3 }),
            new Paragraph({ children: [new TextRun({text: "Video/Animasi: ", ...BOLD_TEXT}), new TextRun(learningFramework.pemanfaatan_digital.stimulus)], ...JUSTIFIED_ALIGN }),
            new Paragraph({ children: [new TextRun({text: "Pencarian Informasi: ", ...BOLD_TEXT}), new TextRun(learningFramework.pemanfaatan_digital.pencarian_informasi)], ...JUSTIFIED_ALIGN }),
            new Paragraph({ children: [new TextRun({text: "Pembuatan Produk: ", ...BOLD_TEXT}), new TextRun(learningFramework.pemanfaatan_digital.pembuatan_produk)], ...JUSTIFIED_ALIGN }),
          new Paragraph(''),
          
          // D. Pengalaman Belajar
          new Paragraph({ text: 'D. Pengalaman Belajar', ...HEADING_1 }),
          new Paragraph({ text: `(menggunakan model ${lessonDetails.model_pembelajaran})`, ...LEFT_ALIGN }),
          new Paragraph({ text: '1. Kegiatan Awal', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Apersepsi: ", ...BOLD_TEXT}), new TextRun(learningScenario.kegiatan_awal.apersepsi)], ...JUSTIFIED_ALIGN }),
          new Paragraph({text: "Pertanyaan Pemantik:", ...BOLD_TEXT, ...LEFT_ALIGN}),
          ...learningScenario.kegiatan_awal.pertanyaan_pemantik.map(q => new Paragraph({text: `${q.pertanyaan} (${q.kaitan_kbc})`, bullet: { level: 0 }, ...LEFT_ALIGN })),
          new Paragraph({ text: '2. Kegiatan Inti', ...HEADING_2 }),
            new Paragraph({text: "Tahap 1: Memahami", ...HEADING_3, ...LEFT_ALIGN}),
            new Paragraph({...JUSTIFIED_ALIGN, text: learningScenario.kegiatan_inti.memahami.penjelasan}),
            ...learningScenario.kegiatan_inti.memahami.aktivitas.map(a => new Paragraph({children: [new TextRun({text: `${a.sintaks}: `, ...BOLD_TEXT}), new TextRun(a.deskripsi)], ...JUSTIFIED_ALIGN})),
            new Paragraph({text: "Tahap 2: Mengaplikasi", ...HEADING_3, ...LEFT_ALIGN}),
            new Paragraph({...JUSTIFIED_ALIGN, text: learningScenario.kegiatan_inti.mengaplikasi.penjelasan}),
            ...learningScenario.kegiatan_inti.mengaplikasi.aktivitas.map(a => new Paragraph({children: [new TextRun({text: `${a.sintaks}: `, ...BOLD_TEXT}), new TextRun(a.deskripsi)], ...JUSTIFIED_ALIGN})),
            new Paragraph({text: "Tahap 3: Merefleksi", ...HEADING_3, ...LEFT_ALIGN}),
            new Paragraph({...JUSTIFIED_ALIGN, text: learningScenario.kegiatan_inti.merefleksi.penjelasan}),
            ...learningScenario.kegiatan_inti.merefleksi.aktivitas.map(a => new Paragraph({children: [new TextRun({text: `${a.sintaks}: `, ...BOLD_TEXT}), new TextRun(a.deskripsi)], ...JUSTIFIED_ALIGN})),
          new Paragraph({ text: '3. Kegiatan Penutup', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Refleksi: ", ...BOLD_TEXT}), new TextRun(learningScenario.kegiatan_penutup.refleksi)], ...JUSTIFIED_ALIGN }),
          new Paragraph({ children: [new TextRun({text: "Tindak Lanjut: ", ...BOLD_TEXT}), new TextRun(learningScenario.kegiatan_penutup.tindak_lanjut)], ...JUSTIFIED_ALIGN }),
          new Paragraph(''),

          // E. Asesmen Pembelajaran
          new Paragraph({ text: 'E. Asesmen Pembelajaran', ...HEADING_1 }),
          new Paragraph({ text: '1. Asesmen Awal (Diagnostik)', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Instrumen: ", ...BOLD_TEXT}), new TextRun(assessmentPackage.asesmen_diagnostik.instrumen)], ...LEFT_ALIGN }),
          new Paragraph({text: "Pertanyaan:", ...BOLD_TEXT, ...LEFT_ALIGN }),
          ...assessmentPackage.asesmen_diagnostik.pertanyaan.map(q => new Paragraph({text: q.pertanyaan, numbering: { reference: 'default-numbering-2', level: 0 }, ...LEFT_ALIGN })),
          new Paragraph({text: "Rubrik:", ...BOLD_TEXT, ...LEFT_ALIGN }),
          new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                columnWidths: [3000, 6000],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: "Kategori", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.TOP }),
                            new TableCell({ children: [new Paragraph({text: "Kriteria", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.TOP }),
                        ]
                    }),
                    ...assessmentPackage.asesmen_diagnostik.rubrik.map(r => new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: r.kategori, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.TOP }),
                            new TableCell({ children: [new Paragraph({text: r.kriteria, ...JUSTIFIED_ALIGN })], verticalAlign: VerticalAlign.TOP }),
                        ]
                    }))
                ]
          }),

          new Paragraph({ text: '2. Asesmen Proses (Formatif)', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Instrumen: ", ...BOLD_TEXT}), new TextRun(assessmentPackage.asesmen_formatif.instrumen)], ...LEFT_ALIGN }),
           new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: "Aspek", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 4 (Sangat Baik)", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 3 (Baik)", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 2 (Cukup)", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 1 (Kurang)", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                        ],
                    }),
                    ...assessmentPackage.asesmen_formatif.rubrik.map(r => new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: r.aspek, ...BOLD_TEXT, ...LEFT_ALIGN })] }),
                            new TableCell({ children: [new Paragraph({text: r.skor_4, ...JUSTIFIED_ALIGN })] }),
                            new TableCell({ children: [new Paragraph({text: r.skor_3, ...JUSTIFIED_ALIGN })] }),
                            new TableCell({ children: [new Paragraph({text: r.skor_2, ...JUSTIFIED_ALIGN })] }),
                            new TableCell({ children: [new Paragraph({text: r.skor_1, ...JUSTIFIED_ALIGN })] }),
                        ]
                    }))
                ],
            }),
          
          new Paragraph({ text: '3. Asesmen Akhir (Sumatif)', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Instrumen: ", ...BOLD_TEXT}), new TextRun(assessmentPackage.asesmen_sumatif.instrumen)], ...LEFT_ALIGN }),
          new Paragraph({text: "Pertanyaan:", ...BOLD_TEXT, ...LEFT_ALIGN }),
          ...assessmentPackage.asesmen_sumatif.pertanyaan.map(q => new Paragraph({text: q.pertanyaan, numbering: { reference: 'default-numbering-3', level: 0 }, ...LEFT_ALIGN })),
           new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                     new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: "Aspek", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 5 (Sangat Baik)", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 3 (Cukup)", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 1 (Kurang)", ...BOLD_TEXT, ...LEFT_ALIGN })], verticalAlign: VerticalAlign.CENTER }),
                        ],
                    }),
                     ...assessmentPackage.asesmen_sumatif.rubrik_esai.map(r => new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: r.aspek, ...BOLD_TEXT, ...LEFT_ALIGN })] }),
                            new TableCell({ children: [new Paragraph({text: r.skor_5, ...JUSTIFIED_ALIGN })] }),
                            new TableCell({ children: [new Paragraph({text: r.skor_3, ...JUSTIFIED_ALIGN })] }),
                            new TableCell({ children: [new Paragraph({text: r.skor_1, ...JUSTIFIED_ALIGN })] }),
                        ]
                    }))
                ],
            }),
            new Paragraph(''),
            new Paragraph(''),

            // Signature Block
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: NO_BORDER,
                columnWidths: [4500, 4500],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: 'Mengetahui,', alignment: AlignmentType.CENTER })]}),
                            new TableCell({ children: [new Paragraph({text: getFormattedDate(lessonDetails.tempat), alignment: AlignmentType.CENTER })]}),
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: 'Kepala Madrasah', alignment: AlignmentType.CENTER })]}),
                            new TableCell({ children: [new Paragraph({text: 'Guru Mata Pelajaran', alignment: AlignmentType.CENTER })]}),
                        ]
                    }),
                     new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(''), new Paragraph(''), new Paragraph('')]}),
                            new TableCell({ children: [new Paragraph(''), new Paragraph(''), new Paragraph('')]}),
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: lessonDetails.namaKepalaMadrasah, underline: { type: UnderlineType.SINGLE } })], alignment: AlignmentType.CENTER })]}),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: lessonDetails.namaGuru, underline: { type: UnderlineType.SINGLE } })], alignment: AlignmentType.CENTER })]}),
                        ]
                    }),
                ]
            })
        ],
      },
    ],
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [ { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START } ],
        },
        {
          reference: 'default-numbering-2',
          levels: [ { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START } ],
        },
        {
          reference: 'default-numbering-3',
          levels: [ { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START } ],
        },
      ],
    },
  });

  Packer.toBlob(doc).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RPP_${lessonDetails.topik.replace(/[\s/:]/g, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  });
};
