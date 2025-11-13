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
const NO_BORDER = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const createBulletedList = (items: string[]) =>
  items.map(
    (item) =>
      new Paragraph({
        text: item,
        bullet: { level: 0 },
      })
  );

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
        children: [
            new Paragraph({ text: 'RENCANA PELAKSANAAN PEMBELAJARAN (RPP)', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
            new Paragraph(''),

          // A. Spesifikasi
          new Paragraph({ text: 'A. Spesifikasi', ...HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: NO_BORDER,
            columnWidths: [2500, 7000],
            rows: [
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('1. Madrasah')] }), new TableCell({ children: [new Paragraph(`: ${lessonDetails.madrasah}`)] }) ]}),
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('2. Mata Pelajaran')] }), new TableCell({ children: [new Paragraph(`: ${lessonDetails.mapel}`)] }) ]}),
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('3. Kelas / Semester')] }), new TableCell({ children: [new Paragraph(`: ${lessonDetails.kelas}`)] }) ]}),
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('4. Topik Pembelajaran')] }), new TableCell({ children: [new Paragraph(`: ${lessonDetails.topik}`)] }) ]}),
                new TableRow({ children: [ new TableCell({ children: [new Paragraph('5. Alokasi Waktu')] }), new TableCell({ children: [new Paragraph(': 2 x 45 Menit')] }) ]}),
            ],
          }),
          new Paragraph(''),

          // B. Identifikasi
          new Paragraph({ text: 'B. Identifikasi', ...HEADING_1 }),
          new Paragraph({ text: '1. Kesiapan Murid (opsional)', ...HEADING_2 }),
          new Paragraph({
            text: 'Murid memiliki pemahaman awal tentang konsep dasar hari akhir dari pelajaran sebelumnya.',
          }),
          new Paragraph({ text: '2. Dimensi Profil Lulusan', ...HEADING_2 }),
          ...createBulletedList(lessonDetails.list_dpl_terpilih),
          new Paragraph({ text: '3. Topik Panca Cinta', ...HEADING_2 }),
          ...createBulletedList(lessonDetails.list_kbc_terpilih),
          new Paragraph({ text: '4. Materi Integrasi KBC', ...HEADING_2 }),
          new Paragraph(
            `Pembelajaran ini mengintegrasikan ${lessonDetails.list_kbc_terpilih.join(
              ' dan '
            )} dengan menekankan bagaimana keimanan pada hari akhir mendorong ${lessonDetails.list_dpl_terpilih.join(
              ' dan '
            )}.`
          ),
          new Paragraph(''),

          // C. Desain Pembelajaran
          new Paragraph({ text: 'C. Desain Pembelajaran', ...HEADING_1 }),
          new Paragraph({ text: '1. Tujuan Pembelajaran', ...HEADING_2 }),
          ...learningObjectives.map(
            (obj) =>
              new Paragraph({ text: obj.deskripsi, numbering: { reference: 'default-numbering', level: 0 } })
          ),
           new Paragraph({ text: '2. Kerangka Pembelajaran', ...HEADING_2 }),
            new Paragraph({ text: 'a. Praktik Pedagogis', ...HEADING_3 }),
            new Paragraph({ children: [new TextRun({text: "Model Pembelajaran: ", ...BOLD_TEXT}), new TextRun(learningFramework.praktik_pedagogis.model_pembelajaran)] }),
            new Paragraph({ children: [new TextRun({text: "Metode: ", ...BOLD_TEXT}), new TextRun(learningFramework.praktik_pedagogis.metode.join(', '))] }),
            new Paragraph({ text: 'b. Kemitraan Pembelajaran (Opsional)', ...HEADING_3 }),
            ...createBulletedList(learningFramework.kemitraan_pembelajaran),
            new Paragraph({ text: 'c. Lingkungan Pembelajaran', ...HEADING_3 }),
            new Paragraph({ children: [new TextRun({text: "Lingkungan Fisik: ", ...BOLD_TEXT}), new TextRun(learningFramework.lingkungan_pembelajaran.lingkungan_fisik)] }),
            new Paragraph({ children: [new TextRun({text: "Ruang Virtual: ", ...BOLD_TEXT}), new TextRun(learningFramework.lingkungan_pembelajaran.ruang_virtual)] }),
            new Paragraph({ children: [new TextRun({text: "Budaya Belajar: ", ...BOLD_TEXT}), new TextRun(learningFramework.lingkungan_pembelajaran.budaya_belajar)] }),
            new Paragraph({ text: 'd. Pemanfaatan Digital', ...HEADING_3 }),
            new Paragraph({ children: [new TextRun({text: "Video/Animasi: ", ...BOLD_TEXT}), new TextRun(learningFramework.pemanfaatan_digital.stimulus)] }),
            new Paragraph({ children: [new TextRun({text: "Pencarian Informasi: ", ...BOLD_TEXT}), new TextRun(learningFramework.pemanfaatan_digital.pencarian_informasi)] }),
            new Paragraph({ children: [new TextRun({text: "Pembuatan Produk: ", ...BOLD_TEXT}), new TextRun(learningFramework.pemanfaatan_digital.pembuatan_produk)] }),
          new Paragraph(''),
          
          // D. Pengalaman Belajar
          new Paragraph({ text: 'D. Pengalaman Belajar', ...HEADING_1 }),
          new Paragraph({ text: `(menggunakan model ${lessonDetails.model_pembelajaran})`}),
          new Paragraph({ text: '1. Kegiatan Awal', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Apersepsi: ", ...BOLD_TEXT}), new TextRun(learningScenario.kegiatan_awal.apersepsi)] }),
          new Paragraph({text: "Pertanyaan Pemantik:", ...BOLD_TEXT}),
          ...learningScenario.kegiatan_awal.pertanyaan_pemantik.map(q => new Paragraph({text: `${q.pertanyaan} (${q.kaitan_kbc})`, bullet: { level: 0 }})),
          new Paragraph({ text: '2. Kegiatan Inti', ...HEADING_2 }),
            new Paragraph({text: "Tahap 1: Memahami", ...HEADING_3}),
            new Paragraph(learningScenario.kegiatan_inti.memahami.penjelasan),
            ...learningScenario.kegiatan_inti.memahami.aktivitas.map(a => new Paragraph({children: [new TextRun({text: `${a.sintaks}: `, ...BOLD_TEXT}), new TextRun(a.deskripsi)]})),
            new Paragraph({text: "Tahap 2: Mengaplikasi", ...HEADING_3}),
            new Paragraph(learningScenario.kegiatan_inti.mengaplikasi.penjelasan),
            ...learningScenario.kegiatan_inti.mengaplikasi.aktivitas.map(a => new Paragraph({children: [new TextRun({text: `${a.sintaks}: `, ...BOLD_TEXT}), new TextRun(a.deskripsi)]})),
            new Paragraph({text: "Tahap 3: Merefleksi", ...HEADING_3}),
            new Paragraph(learningScenario.kegiatan_inti.merefleksi.penjelasan),
            ...learningScenario.kegiatan_inti.merefleksi.aktivitas.map(a => new Paragraph({children: [new TextRun({text: `${a.sintaks}: `, ...BOLD_TEXT}), new TextRun(a.deskripsi)]})),
          new Paragraph({ text: '3. Kegiatan Penutup', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Refleksi: ", ...BOLD_TEXT}), new TextRun(learningScenario.kegiatan_penutup.refleksi)] }),
          new Paragraph({ children: [new TextRun({text: "Tindak Lanjut: ", ...BOLD_TEXT}), new TextRun(learningScenario.kegiatan_penutup.tindak_lanjut)] }),
          new Paragraph(''),

          // E. Asesmen Pembelajaran
          new Paragraph({ text: 'E. Asesmen Pembelajaran', ...HEADING_1 }),
          new Paragraph({ text: '1. Asesmen Awal (Diagnostik)', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Instrumen: ", ...BOLD_TEXT}), new TextRun(assessmentPackage.asesmen_diagnostik.instrumen)] }),
          new Paragraph({text: "Pertanyaan:", ...BOLD_TEXT}),
          ...assessmentPackage.asesmen_diagnostik.pertanyaan.map(q => new Paragraph({text: q.pertanyaan, numbering: { reference: 'default-numbering-2', level: 0 }})),
          new Paragraph({text: "Rubrik:", ...BOLD_TEXT}),
          new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: "Kategori", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Kriteria", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                        ]
                    }),
                    ...assessmentPackage.asesmen_diagnostik.rubrik.map(r => new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(r.kategori)] }),
                            new TableCell({ children: [new Paragraph(r.kriteria)] }),
                        ]
                    }))
                ]
          }),

          new Paragraph({ text: '2. Asesmen Proses (Formatif)', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Instrumen: ", ...BOLD_TEXT}), new TextRun(assessmentPackage.asesmen_formatif.instrumen)] }),
           new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: "Aspek", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 4 (Sangat Baik)", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 3 (Baik)", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 2 (Cukup)", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 1 (Kurang)", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                        ],
                    }),
                    ...assessmentPackage.asesmen_formatif.rubrik.map(r => new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: r.aspek, ...BOLD_TEXT})] }),
                            new TableCell({ children: [new Paragraph(r.skor_4)] }),
                            new TableCell({ children: [new Paragraph(r.skor_3)] }),
                            new TableCell({ children: [new Paragraph(r.skor_2)] }),
                            new TableCell({ children: [new Paragraph(r.skor_1)] }),
                        ]
                    }))
                ],
            }),
          
          new Paragraph({ text: '3. Asesmen Akhir (Sumatif)', ...HEADING_2 }),
          new Paragraph({ children: [new TextRun({text: "Instrumen: ", ...BOLD_TEXT}), new TextRun(assessmentPackage.asesmen_sumatif.instrumen)] }),
          new Paragraph({text: "Pertanyaan:", ...BOLD_TEXT}),
          ...assessmentPackage.asesmen_sumatif.pertanyaan.map(q => new Paragraph({text: q.pertanyaan, numbering: { reference: 'default-numbering-3', level: 0 }})),
           new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                     new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: "Aspek", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 5 (Sangat Baik)", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 3 (Cukup)", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({text: "Skor 1 (Kurang)", ...BOLD_TEXT})], verticalAlign: VerticalAlign.CENTER }),
                        ],
                    }),
                     ...assessmentPackage.asesmen_sumatif.rubrik_esai.map(r => new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({text: r.aspek, ...BOLD_TEXT})] }),
                            new TableCell({ children: [new Paragraph(r.skor_5)] }),
                            new TableCell({ children: [new Paragraph(r.skor_3)] }),
                            new TableCell({ children: [new Paragraph(r.skor_1)] }),
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
