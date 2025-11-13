
import React from 'react';
import type { LearningObjective, LearningFramework, LearningScenario, AssessmentPackage } from '../types';
import { Loader } from './Loader';
import { DownloadIcon } from './icons';

interface OutputDisplayProps {
  learningObjectives: LearningObjective[] | null;
  referencedCP: string | null;
  learningFramework: LearningFramework | null;
  learningScenario: LearningScenario | null;
  assessmentPackage: AssessmentPackage | null;
  isLoading: boolean;
  modelPembelajaran?: string;
  onExport: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; icon: string; subtitle?: string; }> = ({ title, children, icon, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
        <div className="flex items-start mb-4">
            <span className="text-3xl mr-3 mt-1">{icon}</span>
            <div>
                <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500 italic">{subtitle}</p>}
            </div>
        </div>
        {children}
    </div>
);


// Helper to safely render content that might not be a string
const renderSafely = (content: any): React.ReactNode => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <span key={index} className="block">{renderSafely(item)}</span>
    ));
  }
  if (content && typeof content === 'object') {
    return <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>;
  }
  return ''; // Render empty string for null, undefined, etc.
};


export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  learningObjectives,
  referencedCP,
  learningFramework,
  learningScenario,
  assessmentPackage,
  isLoading,
  modelPembelajaran,
  onExport,
}) => {
  if (isLoading && !learningObjectives && !learningScenario && !assessmentPackage) {
      return (
          <div className="flex justify-center items-center p-16">
              <Loader large={true} />
              <p className="ml-4 text-slate-600">Menghasilkan komponen RPP...</p>
          </div>
      )
  }

  if (!learningObjectives && !learningScenario && !assessmentPackage) {
    return (
        <div className="text-center p-10 bg-slate-100/50 rounded-lg border-2 border-dashed border-slate-300">
            <p className="text-slate-500">Hasil RPP Anda akan muncul di sini.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        {assessmentPackage && (
            <div className="flex justify-end">
                <button
                    onClick={onExport}
                    className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                    <DownloadIcon />
                    <span className="ml-2">Ekspor ke Word</span>
                </button>
            </div>
        )}

      {learningObjectives && (
        <Section title="Tujuan Pembelajaran" icon="🎯">
          <ul className="space-y-3 list-decimal list-inside text-slate-700">
            {learningObjectives.map(obj => (
              <li key={obj.id} className="pl-2">{renderSafely(obj.deskripsi)}</li>
            ))}
          </ul>
          {referencedCP && (
              <div className="mt-4 p-3 bg-slate-100 border-l-4 border-slate-300 rounded-r-lg">
                  <p className="text-xs text-slate-600 font-semibold">Selaras dengan Capaian Pembelajaran:</p>
                  <p className="text-sm text-slate-700 italic">"{renderSafely(referencedCP)}"</p>
              </div>
          )}
        </Section>
      )}

      {learningFramework && (
        <Section title="Kerangka Pembelajaran" icon="🏗️">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">a. Praktik Pedagogis</h4>
                    <dl className="text-sm space-y-1 pl-4">
                        <dt className="font-medium text-slate-600">Model Pembelajaran:</dt>
                        <dd className="pl-2 text-slate-700">{renderSafely(learningFramework.praktik_pedagogis.model_pembelajaran)}</dd>
                        <dt className="font-medium text-slate-600">Metode:</dt>
                        <dd className="pl-2 text-slate-700">{learningFramework.praktik_pedagogis.metode.join(', ')}</dd>
                    </dl>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">b. Kemitraan Pembelajaran (Opsional)</h4>
                    <ul className="text-sm list-disc list-inside pl-4 text-slate-700 space-y-1">
                        {learningFramework.kemitraan_pembelajaran.map((item, i) => <li key={i}>{renderSafely(item)}</li>)}
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-semibold text-slate-800 mb-2">c. Lingkungan Pembelajaran</h4>
                    <dl className="text-sm space-y-1 pl-4">
                        <dt className="font-medium text-slate-600">Lingkungan Fisik:</dt>
                        <dd className="pl-2 text-slate-700">{renderSafely(learningFramework.lingkungan_pembelajaran.lingkungan_fisik)}</dd>
                        <dt className="font-medium text-slate-600">Ruang Virtual:</dt>
                        <dd className="pl-2 text-slate-700">{renderSafely(learningFramework.lingkungan_pembelajaran.ruang_virtual)}</dd>
                        <dt className="font-medium text-slate-600">Budaya Belajar:</dt>
                        <dd className="pl-2 text-slate-700">{renderSafely(learningFramework.lingkungan_pembelajaran.budaya_belajar)}</dd>
                    </dl>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-semibold text-slate-800 mb-2">d. Pemanfaatan Digital</h4>
                    <dl className="text-sm space-y-1 pl-4">
                        <dt className="font-medium text-slate-600">Video/Animasi (sebagai stimulus):</dt>
                        <dd className="pl-2 text-slate-700">{renderSafely(learningFramework.pemanfaatan_digital.stimulus)}</dd>
                        <dt className="font-medium text-slate-600">Pencarian Informasi:</dt>
                        <dd className="pl-2 text-slate-700">{renderSafely(learningFramework.pemanfaatan_digital.pencarian_informasi)}</dd>
                        <dt className="font-medium text-slate-600">Pembuatan Produk:</dt>
                        <dd className="pl-2 text-slate-700">{renderSafely(learningFramework.pemanfaatan_digital.pembuatan_produk)}</dd>
                    </dl>
                </div>
            </div>
        </Section>
      )}

      {learningScenario && (
        <Section 
            title="Pengalaman Belajar" 
            icon="🎭"
            subtitle={modelPembelajaran ? `(menggunakan model ${modelPembelajaran})` : ''}
        >
            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-semibold text-blue-700 mb-2">Kegiatan Awal</h4>
                    <p className="text-slate-600 mb-2"><strong className="font-semibold text-slate-800">Apersepsi:</strong> {renderSafely(learningScenario.kegiatan_awal.apersepsi)}</p>
                    <p className="font-semibold text-slate-800 mb-1">Pertanyaan Pemantik:</p>
                    <ul className="space-y-2 list-disc list-inside">
                        {learningScenario.kegiatan_awal.pertanyaan_pemantik.map((q, i) => (
                            <li key={i} className="text-slate-600 pl-2">{renderSafely(q.pertanyaan)} <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">{renderSafely(q.kaitan_kbc)}</span></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-green-700 mb-3">Kegiatan Inti (Pembelajaran Mendalam)</h4>
                    <div className="space-y-6 border-l-2 border-slate-200 pl-4 ml-2">
                        
                        <div className="relative">
                            <div className="absolute -left-[26px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                            <h5 className="font-bold text-slate-800">Tahap 1: Memahami</h5>
                            <p className="text-sm text-slate-600 italic mt-1 mb-3">{renderSafely(learningScenario.kegiatan_inti.memahami.penjelasan)}</p>
                            <ul className="space-y-3">
                                {learningScenario.kegiatan_inti.memahami.aktivitas.map((activity, i) => (
                                   <li key={`memahami-${i}`}>
                                        <strong className="font-semibold text-slate-800">{renderSafely(activity.sintaks)}:</strong>
                                        <p className="text-slate-600 pl-2">{renderSafely(activity.deskripsi)}</p>
                                   </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[26px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                            <h5 className="font-bold text-slate-800">Tahap 2: Mengaplikasi</h5>
                            <p className="text-sm text-slate-600 italic mt-1 mb-3">{renderSafely(learningScenario.kegiatan_inti.mengaplikasi.penjelasan)}</p>
                            <ul className="space-y-3">
                                {learningScenario.kegiatan_inti.mengaplikasi.aktivitas.map((activity, i) => (
                                   <li key={`mengaplikasi-${i}`}>
                                        <strong className="font-semibold text-slate-800">{renderSafely(activity.sintaks)}:</strong>
                                        <p className="text-slate-600 pl-2">{renderSafely(activity.deskripsi)}</p>
                                   </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[26px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                            <h5 className="font-bold text-slate-800">Tahap 3: Merefleksi</h5>
                            <p className="text-sm text-slate-600 italic mt-1 mb-3">{renderSafely(learningScenario.kegiatan_inti.merefleksi.penjelasan)}</p>
                            <ul className="space-y-3">
                                {learningScenario.kegiatan_inti.merefleksi.aktivitas.map((activity, i) => (
                                   <li key={`merefleksi-${i}`}>
                                        <strong className="font-semibold text-slate-800">{renderSafely(activity.sintaks)}:</strong>
                                        <p className="text-slate-600 pl-2">{renderSafely(activity.deskripsi)}</p>
                                   </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-purple-700 mb-2">Kegiatan Penutup</h4>
                    <p className="text-slate-600 mb-2"><strong className="font-semibold text-slate-800">Refleksi:</strong> {renderSafely(learningScenario.kegiatan_penutup.refleksi)}</p>
                    <p className="text-slate-600"><strong className="font-semibold text-slate-800">Tindak Lanjut:</strong> {renderSafely(learningScenario.kegiatan_penutup.tindak_lanjut)}</p>
                </div>
            </div>
        </Section>
      )}
      
      {assessmentPackage && (
        <Section title="Paket Asesmen" icon="📝">
          <div className="space-y-8">
            {/* Asesmen Diagnostik */}
            <div>
                <h4 className="text-xl font-bold text-slate-700 border-b-2 border-amber-400 pb-2 mb-3">Asesmen Diagnostik</h4>
                <p className="font-semibold text-slate-800 mb-2">Instrumen: <span className="font-normal">{renderSafely(assessmentPackage.asesmen_diagnostik.instrumen)}</span></p>
                <p className="font-semibold text-slate-800 mb-1">Pertanyaan:</p>
                <ul className="list-decimal list-inside space-y-1 mb-3 text-slate-600">
                    {assessmentPackage.asesmen_diagnostik.pertanyaan.map(q => <li key={q.id}>{renderSafely(q.pertanyaan)}</li>)}
                </ul>
                <p className="font-semibold text-slate-800 mb-1">Rubrik:</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kategori</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kriteria</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {assessmentPackage.asesmen_diagnostik.rubrik.map(r => <tr key={r.kategori}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 align-top">{renderSafely(r.kategori)}</td><td className="px-6 py-4 text-sm text-slate-500 align-top">{renderSafely(r.kriteria)}</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Asesmen Formatif */}
            <div>
                <h4 className="text-xl font-bold text-slate-700 border-b-2 border-cyan-400 pb-2 mb-3">Asesmen Formatif</h4>
                <p className="font-semibold text-slate-800 mb-2">Instrumen: <span className="font-normal">{renderSafely(assessmentPackage.asesmen_formatif.instrumen)}</span></p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
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
                            {assessmentPackage.asesmen_formatif.rubrik.map(r => (
                                <tr key={r.aspek}>
                                    <td className="px-4 py-2 font-semibold text-slate-800 align-top">{renderSafely(r.aspek)}</td>
                                    <td className="px-4 py-2 text-slate-600 align-top">{renderSafely(r.skor_4)}</td>
                                    <td className="px-4 py-2 text-slate-600 align-top">{renderSafely(r.skor_3)}</td>
                                    <td className="px-4 py-2 text-slate-600 align-top">{renderSafely(r.skor_2)}</td>
                                    <td className="px-4 py-2 text-slate-600 align-top">{renderSafely(r.skor_1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Asesmen Sumatif */}
             <div>
                <h4 className="text-xl font-bold text-slate-700 border-b-2 border-rose-400 pb-2 mb-3">Asesmen Sumatif</h4>
                <p className="font-semibold text-slate-800 mb-2">Instrumen: <span className="font-normal">{renderSafely(assessmentPackage.asesmen_sumatif.instrumen)}</span></p>
                <p className="font-semibold text-slate-800 mb-1">Pertanyaan:</p>
                <ul className="list-decimal list-inside space-y-1 mb-3 text-slate-600">
                    {assessmentPackage.asesmen_sumatif.pertanyaan.map(q => <li key={q.id}>{renderSafely(q.pertanyaan)}</li>)}
                </ul>
                 <p className="font-semibold text-slate-800 mb-1">Rubrik Esai:</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
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
                            {assessmentPackage.asesmen_sumatif.rubrik_esai.map(r => (
                                <tr key={r.aspek}>
                                    <td className="px-4 py-2 font-semibold text-slate-800 align-top">{renderSafely(r.aspek)}</td>
                                    <td className="px-4 py-2 text-slate-600 align-top">{renderSafely(r.skor_5)}</td>
                                    <td className="px-4 py-2 text-slate-600 align-top">{renderSafely(r.skor_3)}</td>
                                    <td className="px-4 py-2 text-slate-600 align-top">{renderSafely(r.skor_1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Validasi Keselarasan */}
            {assessmentPackage.validasi_keselarasan && (
              <div>
                  <h4 className="text-xl font-bold text-slate-700 border-b-2 border-indigo-400 pb-2 mb-3 mt-8 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Validasi Keselarasan Pedagogis
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                      AKD telah melakukan pemeriksaan mandiri untuk memastikan setiap item asesmen selaras dengan Tujuan Pembelajaran (TP), Panca Cinta (KBC), dan Dimensi Profil Lulusan (DPL).
                  </p>
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
                              {assessmentPackage.validasi_keselarasan.map((v, index) => (
                                  <tr key={index}>
                                      <td className="px-4 py-2 font-semibold text-slate-800 align-top">{renderSafely(v.item_asesmen)}</td>
                                      <td className="px-4 py-2 text-slate-600 align-top">
                                          {v.tp_terukur.map(tp => (
                                              <span key={tp} className="inline-block bg-blue-100 text-blue-800 text-xs font-mono px-2 py-1 rounded-full mr-1 mb-1">{tp}</span>
                                          ))}
                                      </td>
                                      <td className="px-4 py-2 text-slate-600 align-top">
                                          {v.kbc_dpl_terukur.map(kbc => (
                                              <span key={kbc} className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-1 mb-1">{kbc}</span>
                                          ))}
                                      </td>
                                      <td className="px-4 py-2 text-slate-600 align-top">{renderSafely(v.catatan_keselarasan)}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
};