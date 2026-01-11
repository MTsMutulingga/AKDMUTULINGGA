
import React from 'react';
import type { LessonDetails, LearningObjective, LearningFramework, LearningScenario, AssessmentPackage } from '../types';
import { Loader } from './Loader';
import { DownloadIcon, PrintIcon, CheckSquareIcon, SquareIcon } from './icons';
import { EditableField } from './EditableField';

interface OutputDisplayProps {
  lessonDetails: LessonDetails;
  learningObjectives: LearningObjective[] | null;
  referencedCP: string | null;
  alokasiWaktu: string | null;
  setAlokasiWaktu: React.Dispatch<React.SetStateAction<string | null>>;
  learningFramework: LearningFramework | null;
  learningScenario: LearningScenario | null;
  assessmentPackage: AssessmentPackage | null;
  isLoading: boolean;
  onExport: () => void;
  onUpdateObjective: (id: string, newDeskripsi: string) => void;
  onUpdateScenario: (path: (string | number)[], newValue: string) => void;
  onUpdateAssessment: (type: 'diagnostik' | 'sumatif', path: (string | number)[], newValue: string) => void;
}

const KBC_OPTIONS = ['Cinta Allah dan Rasul-Nya', 'Cinta Ilmu', 'Cinta Lingkungan', 'Cinta Diri dan Sesama Manusia', 'Cinta Tanah Air'];
const DPL_OPTIONS = ['Keimanan dan Ketakwaan kepada Tuhan YME', 'Kewargaan', 'Penalaran Kritis', 'Kreativitas', 'Kolaborasi', 'Kemandirian', 'Kesehatan', 'Komunikasi'];

const H1: React.FC<{children: React.ReactNode}> = ({children}) => <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3 text-left">{children}</h3>;
const H2: React.FC<{children: React.ReactNode}> = ({children}) => <h4 className="text-lg font-semibold text-slate-700 mt-4 mb-2 text-left">{children}</h4>;
const H3: React.FC<{children: React.ReactNode}> = ({children}) => <h5 className="text-base font-semibold text-slate-700 mt-3 mb-1 text-left">{children}</h5>;
const BoldText: React.FC<{children: React.ReactNode}> = ({children}) => <span className="font-semibold text-slate-800">{children}</span>;

const renderSafely = (content: any): string => {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.join(', ');
  return '';
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  lessonDetails,
  learningObjectives,
  referencedCP,
  alokasiWaktu,
  setAlokasiWaktu,
  learningFramework,
  learningScenario,
  assessmentPackage,
  isLoading,
  onExport,
  onUpdateObjective,
  onUpdateScenario,
  onUpdateAssessment
}) => {
  if (isLoading && !learningObjectives) {
      return (
          <div className="flex justify-center items-center p-16">
              <Loader large={true} />
              <p className="ml-4 text-slate-600">Menghasilkan RPP...</p>
          </div>
      )
  }

  if (!learningObjectives) {
    return (
        <div className="text-center p-10 bg-slate-100/50 rounded-lg border-2 border-dashed border-slate-300">
            <p className="text-slate-500">Pratinjau RPP Anda akan muncul di sini setelah Anda menekan "Hasilkan Tujuan".</p>
        </div>
    );
  }

  return (
    <div id="rpp-preview-container" className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1 uppercase">Rencana Pelaksanaan Pembelajaran</h2>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1 uppercase">(Mendalam Berbasis Cinta)</h2>
        <hr className="my-6 border-slate-300"/>

        <div className="flex justify-end gap-2 no-print mb-6">
            <button
                onClick={() => window.print()}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
                <PrintIcon />
                <span className="ml-2">Cetak RPP</span>
            </button>
            <button
                onClick={onExport}
                disabled={!assessmentPackage}
                className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
                <DownloadIcon />
                <span className="ml-2">Ekspor ke Word</span>
            </button>
        </div>

        {/* A. Spesifikasi */}
        <H1>A. Spesifikasi</H1>
        <div className="text-base grid grid-cols-[180px,10px,1fr] gap-x-2 gap-y-1">
            <span className="font-medium">1. Madrasah</span> <span>:</span> <span>{lessonDetails.madrasah}</span>
            <span className="font-medium">2. Mata Pelajaran</span> <span>:</span> <span>{lessonDetails.mapel}</span>
            <span className="font-medium">3. Kelas / Semester</span> <span>:</span> <span>{lessonDetails.kelas}</span>
            <span className="font-medium">4. Topik Pembelajaran</span> <span>:</span> <span>{lessonDetails.topik}</span>
            <span className="font-medium">5. Alokasi Waktu</span> <span>:</span> 
            <span>
              <EditableField 
                as="span" 
                initialValue={alokasiWaktu || "2 x 40 Menit"} 
                onSave={(val) => setAlokasiWaktu(val)} 
                ariaLabel="Edit Alokasi Waktu" 
              />
            </span>
        </div>

        {/* B. Identifikasi */}
        <H1>B. Identifikasi</H1>
        <H2>1. Kesiapan Murid (opsional)</H2>
        <p className="text-slate-700 text-justify">Murid memiliki pemahaman awal tentang konsep dasar hari akhir dari pelajaran sebelumnya.</p>
        <H2>2. Dimensi Profil Lulusan</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-slate-700">
            {DPL_OPTIONS.map(option => (
                <div key={option} className="flex items-center">
                    {lessonDetails.list_dpl_terpilih.includes(option)
                        ? <CheckSquareIcon className="text-blue-600 mr-2 flex-shrink-0" />
                        : <SquareIcon className="text-slate-400 mr-2 flex-shrink-0" />
                    }
                    <span>{option}</span>
                </div>
            ))}
        </div>
        <H2>3. Topik Panca Cinta</H2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-slate-700">
            {KBC_OPTIONS.map(option => (
                <div key={option} className="flex items-center">
                    {lessonDetails.list_kbc_terpilih.includes(option)
                        ? <CheckSquareIcon className="text-blue-600 mr-2 flex-shrink-0" />
                        : <SquareIcon className="text-slate-400 mr-2 flex-shrink-0" />
                    }
                    <span>{option}</span>
                </div>
            ))}
        </div>
        <H2>4. Materi Integrasi KBC</H2>
        <p className="text-slate-700 text-justify">Pembelajaran ini mengintegrasikan {lessonDetails.list_kbc_terpilih.join(' dan ')} dengan menekankan bagaimana keimanan pada hari akhir mendorong {lessonDetails.list_dpl_terpilih.join(' dan ')}.</p>

        {/* C. Desain Pembelajaran */}
        <H1>C. Desain Pembelajaran</H1>
        <H2>1. Tujuan Pembelajaran</H2>
        <ul className="space-y-2 list-decimal list-inside text-slate-700">
            {learningObjectives.map(obj => (
              <li key={obj.id} className="pl-2 text-left">
                 <EditableField as="span" initialValue={obj.deskripsi} onSave={(newValue) => onUpdateObjective(obj.id, newValue)} ariaLabel={`Edit deskripsi untuk tujuan pembelajaran ${obj.id}`} />
              </li>
            ))}
        </ul>
        {referencedCP && (
              <div className="mt-4 p-3 bg-slate-100 border-l-4 border-slate-300 rounded-r-lg">
                  <p className="text-sm text-slate-600 font-semibold text-left">Selaras dengan Capaian Pembelajaran:</p>
                  <p className="text-base text-slate-700 italic text-justify">"{renderSafely(referencedCP)}"</p>
              </div>
        )}
        
        {learningFramework && (
            <>
                <H2>2. Kerangka Pembelajaran</H2>
                <div className="pl-4 space-y-3">
                  <div>
                    <H3>a. Praktik Pedagogis</H3>
                    <p className="text-left"><BoldText>Model Pembelajaran:</BoldText> {renderSafely(learningFramework.praktik_pedagogis.model_pembelajaran)}</p>
                    <p className="text-left"><BoldText>Metode:</BoldText> {renderSafely(learningFramework.praktik_pedagogis.metode)}</p>
                  </div>

                  <div>
                    <H3>b. Kemitraan Pembelajaran (Opsional)</H3>
                    <ul className="list-disc list-inside ml-4 text-slate-700 text-left">
                        {learningFramework.kemitraan_pembelajaran?.map((item, i) => <li key={i}>{renderSafely(item)}</li>)}
                    </ul>
                  </div>

                  <div>
                    <H3>c. Lingkungan Pembelajaran</H3>
                    <p className="text-justify"><BoldText>Lingkungan Fisik:</BoldText> {renderSafely(learningFramework.lingkungan_pembelajaran.lingkungan_fisik)}</p>
                    <p className="text-justify"><BoldText>Ruang Virtual:</BoldText> {renderSafely(learningFramework.lingkungan_pembelajaran.ruang_virtual)}</p>
                    <p className="text-justify"><BoldText>Budaya Belajar:</BoldText> {renderSafely(learningFramework.lingkungan_pembelajaran.budaya_belajar)}</p>
                  </div>
                  
                  <div>
                    <H3>d. Pemanfaatan Digital</H3>
                    <p className="text-justify"><BoldText>Video/Animasi (sebagai stimulus):</BoldText> {renderSafely(learningFramework.pemanfaatan_digital.stimulus)}</p>
                    <p className="text-justify"><BoldText>Pencarian Informasi:</BoldText> {renderSafely(learningFramework.pemanfaatan_digital.pencarian_informasi)}</p>
                    <p className="text-justify"><BoldText>Pembuatan Produk:</BoldText> {renderSafely(learningFramework.pemanfaatan_digital.pembuatan_produk)}</p>
                  </div>
                </div>
            </>
        )}

        {/* D. Pengalaman Belajar */}
        {learningScenario ? (
             <>
                <H1>D. Pengalaman Belajar</H1>
                <p className="italic text-slate-600 -mt-2 mb-4 text-left">(menggunakan model {lessonDetails.model_pembelajaran})</p>
                <div className="pl-4">
                  <H2>1. Kegiatan Awal</H2>
                  <p className="text-justify"><BoldText>Apersepsi:</BoldText> <EditableField as="span" initialValue={learningScenario.kegiatan_awal.apersepsi} onSave={newValue => onUpdateScenario(['kegiatan_awal', 'apersepsi'], newValue)} ariaLabel="Edit apersepsi"/></p>
                  <p className="mt-2 text-left"><BoldText>Pertanyaan Pemantik:</BoldText></p>
                  <ul className="space-y-2 list-disc list-inside ml-4">
                      {learningScenario.kegiatan_awal.pertanyaan_pemantik?.map((q, i) => (
                          <li key={i} className="text-slate-700 text-left">
                              <EditableField as="span" initialValue={q.pertanyaan} onSave={newValue => onUpdateScenario(['kegiatan_awal', 'pertanyaan_pemantik', i, 'pertanyaan'], newValue)} ariaLabel={`Edit pertanyaan pemantik ${i+1}`}/>
                              {' '}
                              <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">{renderSafely(q.kaitan_kbc)}</span>
                          </li>
                      ))}
                  </ul>

                  <H2>2. Kegiatan Inti (Pembelajaran Mendalam)</H2>
                  <div className="space-y-4">
                      <H3>Tahap 1: Memahami</H3>
                      <p className="text-sm text-slate-600 italic text-justify">{renderSafely(learningScenario.kegiatan_inti.memahami.penjelasan)}</p>
                      {learningScenario.kegiatan_inti.memahami.aktivitas?.map((activity, i) => (
                        <p key={`memahami-${i}`} className="text-justify"><BoldText>{renderSafely(activity.sintaks)}:</BoldText> <EditableField as="span" initialValue={activity.deskripsi} onSave={newValue => onUpdateScenario(['kegiatan_inti', 'memahami', 'aktivitas', i, 'deskripsi'], newValue)} ariaLabel={`Edit deskripsi aktivitas memahami ${i+1}`}/></p>
                      ))}
                      <H3>Tahap 2: Mengaplikasi</H3>
                      <p className="text-sm text-slate-600 italic text-justify">{renderSafely(learningScenario.kegiatan_inti.mengaplikasi.penjelasan)}</p>
                      {learningScenario.kegiatan_inti.mengaplikasi.aktivitas?.map((activity, i) => (
                        <p key={`mengaplikasi-${i}`} className="text-justify"><BoldText>{renderSafely(activity.sintaks)}:</BoldText> <EditableField as="span" initialValue={activity.deskripsi} onSave={newValue => onUpdateScenario(['kegiatan_inti', 'mengaplikasi', 'aktivitas', i, 'deskripsi'], newValue)} ariaLabel={`Edit deskripsi aktivitas mengaplikasi ${i+1}`}/></p>
                      ))}
                      <H3>Tahap 3: Merefleksi</H3>
                      <p className="text-sm text-slate-600 italic text-justify">{renderSafely(learningScenario.kegiatan_inti.merefleksi.penjelasan)}</p>
                      {learningScenario.kegiatan_inti.merefleksi.aktivitas?.map((activity, i) => (
                        <p key={`merefleksi-${i}`} className="text-justify"><BoldText>{renderSafely(activity.sintaks)}:</BoldText> <EditableField as="span" initialValue={activity.deskripsi} onSave={newValue => onUpdateScenario(['kegiatan_inti', 'merefleksi', 'aktivitas', i, 'deskripsi'], newValue)} ariaLabel={`Edit deskripsi aktivitas merefleksi ${i+1}`}/></p>
                      ))}
                  </div>

                  <H2>3. Kegiatan Penutup</H2>
                  <p className="text-justify"><BoldText>Refleksi:</BoldText> <EditableField as="span" initialValue={learningScenario.kegiatan_penutup.refleksi} onSave={newValue => onUpdateScenario(['kegiatan_penutup', 'refleksi'], newValue)} ariaLabel="Edit refleksi"/></p>
                  <p className="text-justify"><BoldText>Tindak Lanjut:</BoldText> <EditableField as="span" initialValue={learningScenario.kegiatan_penutup.tindak_lanjut} onSave={newValue => onUpdateScenario(['kegiatan_penutup', 'tindak_lanjut'], newValue)} ariaLabel="Edit tindak lanjut"/></p>
                </div>
             </>
        ) : isLoading && !!learningObjectives && <div className="flex items-center mt-6"><Loader large={true}/> <span className="ml-4 text-slate-600">Menghasilkan Skenario Pembelajaran...</span></div>}


        {/* E. Asesmen */}
        {assessmentPackage ? (
             <>
                <H1>E. Asesmen Pembelajaran</H1>
                <div className="pl-4 space-y-8">
                  <div>
                    <H2>1. Asesmen Awal (Diagnostik)</H2>
                    <p className="text-left"><BoldText>Instrumen:</BoldText> {renderSafely(assessmentPackage.asesmen_diagnostik.instrumen)}</p>
                    <p className="mt-2 text-left"><BoldText>Pertanyaan:</BoldText></p>
                    <ul className="list-decimal list-inside space-y-1 ml-4 text-slate-700 text-left">
                        {assessmentPackage.asesmen_diagnostik.pertanyaan?.map((q, i) => <li key={q.id} className="text-left">
                            <EditableField as="span" initialValue={q.pertanyaan} onSave={newValue => onUpdateAssessment('diagnostik', ['pertanyaan', i, 'pertanyaan'], newValue)} ariaLabel={`Edit pertanyaan diagnostik ${q.id}`}/>
                        </li>)}
                    </ul>
                    <p className="mt-2 text-left"><BoldText>Rubrik:</BoldText></p>
                    <div className="border border-slate-200 rounded-lg overflow-hidden mt-1">
                        <table className="min-w-full divide-y divide-slate-200 table-fixed">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kategori</th>
                                    <th scope="col" className="w-2/3 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kriteria</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {assessmentPackage.asesmen_diagnostik.rubrik?.map(r => (
                                    <tr key={r.kategori}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 align-top text-left">{renderSafely(r.kategori)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 align-top text-justify">{renderSafely(r.kriteria)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>

                  <div>
                    <H2>2. Asesmen Proses (Formatif)</H2>
                    <p className="text-left"><BoldText>Instrumen:</BoldText> {renderSafely(assessmentPackage.asesmen_formatif.instrumen)}</p>
                    <div className="border border-slate-200 rounded-lg overflow-hidden mt-1">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Aspek</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Skor 4 (Sangat Baik)</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Skor 3 (Baik)</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Skor 2 (Cukup)</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Skor 1 (Kurang)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {assessmentPackage.asesmen_formatif.rubrik?.map(r => (
                                    <tr key={r.aspek}>
                                        <td className="px-4 py-2 font-semibold text-slate-800 align-top text-left">{renderSafely(r.aspek)}</td>
                                        <td className="px-4 py-2 text-slate-600 align-top text-justify">{renderSafely(r.skor_4)}</td>
                                        <td className="px-4 py-2 text-slate-600 align-top text-justify">{renderSafely(r.skor_3)}</td>
                                        <td className="px-4 py-2 text-slate-600 align-top text-justify">{renderSafely(r.skor_2)}</td>
                                        <td className="px-4 py-2 text-slate-600 align-top text-justify">{renderSafely(r.skor_1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>

                  <div>
                    <H2>3. Asesmen Akhir (Sumatif)</H2>
                    <p className="text-left"><BoldText>Instrumen:</BoldText> {renderSafely(assessmentPackage.asesmen_sumatif.instrumen)}</p>
                    <p className="mt-2 text-left"><BoldText>Pertanyaan:</BoldText></p>
                    <ul className="list-decimal list-inside space-y-1 ml-4 text-slate-700 text-left">
                        {assessmentPackage.asesmen_sumatif.pertanyaan?.map((q, i) => <li key={q.id} className="text-left">
                            <EditableField as="span" initialValue={q.pertanyaan} onSave={newValue => onUpdateAssessment('sumatif', ['pertanyaan', i, 'pertanyaan'], newValue)} ariaLabel={`Edit pertanyaan sumatif ${q.id}`}/>
                        </li>)}
                    </ul>
                    <p className="mt-2 text-left"><BoldText>Rubrik Esai:</BoldText></p>
                    <div className="border border-slate-200 rounded-lg overflow-hidden mt-1">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Aspek</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Skor 5 (Sangat Baik)</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Skor 3 (Cukup)</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Skor 1 (Kurang)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {assessmentPackage.asesmen_sumatif.rubrik_esai?.map(r => (
                                    <tr key={r.aspek}>
                                        <td className="px-4 py-2 font-semibold text-slate-800 align-top text-left">{renderSafely(r.aspek)}</td>
                                        <td className="px-4 py-2 text-slate-600 align-top text-justify">{renderSafely(r.skor_5)}</td>
                                        <td className="px-4 py-2 text-slate-600 align-top text-justify">{renderSafely(r.skor_3)}</td>
                                        <td className="px-4 py-2 text-slate-600 align-top text-justify">{renderSafely(r.skor_1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>

                  <div>
                      <H2>4. Validasi Keselarasan Pedagogis</H2>
                      <p className="text-sm text-slate-600 mb-2 text-justify">Pemeriksaan mandiri untuk memastikan setiap item asesmen selaras dengan Tujuan Pembelajaran (TP), Panca Cinta (KBC), dan Dimensi Profil Lulusan (DPL).</p>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-slate-200 text-sm">
                              <thead className="bg-slate-50">
                                  <tr>
                                      <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Item Asesmen</th>
                                      <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">TP Terukur</th>
                                      <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">KBC / DPL Terukur</th>
                                      <th className="px-4 py-2 text-left font-medium text-slate-500 uppercase">Catatan Keselarasan</th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-slate-200">
                                  {assessmentPackage.validasi_keselarasan?.map((v, index) => (
                                      <tr key={index}>
                                          <td className="px-4 py-2 font-semibold text-slate-800 align-top text-left">{renderSafely(v.item_asesmen)}</td>
                                          <td className="px-4 py-2 text-slate-600 align-top text-left">
                                              {v.tp_terukur?.map(tp => (
                                                  <span key={tp} className="inline-block bg-blue-100 text-blue-800 text-xs font-mono px-2 py-1 rounded-full mr-1 mb-1">{tp}</span>
                                              ))}
                                          </td>
                                          <td className="px-4 py-2 text-slate-600 align-top text-left">
                                              {v.kbc_dpl_terukur?.map(kbc => (
                                                  <span key={kbc} className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-1 mb-1">{kbc}</span>
                                              ))}
                                          </td>
                                          <td className="px-4 py-2 text-slate-600 align-top text-justify">{renderSafely(v.catatan_keselarasan)}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
                </div>
             </>
        ) : isLoading && !!learningScenario && <div className="flex items-center mt-6"><Loader large={true}/> <span className="ml-4 text-slate-600">Menghasilkan Paket Asesmen...</span></div>}
    </div>
  );
};
