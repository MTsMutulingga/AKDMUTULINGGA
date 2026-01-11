
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateInitialComponents, generateSkenarioKegiatan, generatePaketAsesmen } from './services/geminiService';
import { exportToWord } from './utils/exportToWord';
import { HeartIcon } from './components/icons';
import type { LessonDetails, LearningObjective, LearningFramework, LearningScenario, AssessmentPackage } from './types';

const initialLessonDetails: LessonDetails = {
    topik: 'Kiamat Sudah Dekat: Siapkan Amal sebagai Bekal',
    mapel: 'Akidah Akhlak',
    kelas: 'VII / Gasal',
    madrasah: 'MTs Muhammadiyah 01 Purbalingga',
    namaGuru: 'Arif Nurokhman, S.Pd',
    namaKepalaMadrasah: 'Siswogo, S.Si., M.Pd.',
    tempat: 'Purbalingga',
    list_kbc_terpilih: ['Cinta Allah dan Rasul-Nya', 'Cinta Diri dan Sesama Manusia'],
    list_dpl_terpilih: ['Keimanan dan Ketakwaan kepada Tuhan YME', 'Penalaran Kritis'],
    model_pembelajaran: 'Cooperative Learning',
    stimulus_url: '',
};

const App: React.FC = () => {
  const [lessonDetails, setLessonDetails] = useState<LessonDetails>(() => {
      try {
          const savedDraft = localStorage.getItem('akd_lesson_draft');
          return savedDraft ? JSON.parse(savedDraft) : { ...initialLessonDetails };
      } catch (error) {
          console.error("Gagal memuat draf dari localStorage:", error);
          return { ...initialLessonDetails };
      }
  });
  
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const saveTimeoutRef = useRef<number | null>(null);

  const [learningObjectives, setLearningObjectives] = useState<LearningObjective[] | null>(null);
  const [referencedCP, setReferencedCP] = useState<string | null>(null);
  const [alokasiWaktu, setAlokasiWaktu] = useState<string | null>(null);
  const [learningFramework, setLearningFramework] = useState<LearningFramework | null>(null);
  const [learningScenario, setLearningScenario] = useState<LearningScenario | null>(null);
  const [assessmentPackage, setAssessmentPackage] = useState<AssessmentPackage | null>(null);
  
  const [activeGenerator, setActiveGenerator] = useState<'objectives' | 'scenario' | 'assessment' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-save lesson details with debouncing
  useEffect(() => {
      setSaveStatus('unsaved');
      if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = window.setTimeout(() => {
          setSaveStatus('saving');
          try {
              localStorage.setItem('akd_lesson_draft', JSON.stringify(lessonDetails));
              setSaveStatus('saved');
          } catch (error) {
              console.error("Gagal menyimpan draf ke localStorage:", error);
              setSaveStatus('unsaved');
          }
      }, 1500); 
  }, [lessonDetails]);

  const handleClearFormAndReset = useCallback(() => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua input dan memulai dari awal? Draf yang tersimpan akan dihapus.")) {
        setIsLoading(false);
        setError(null);
        setActiveGenerator(null);
        setLearningObjectives(null);
        setReferencedCP(null);
        setAlokasiWaktu(null);
        setLearningFramework(null);
        setLearningScenario(null);
        setAssessmentPackage(null);
        setLessonDetails({ ...initialLessonDetails });
        localStorage.removeItem('akd_lesson_draft');
        setSaveStatus('saved');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleGenerateObjectives = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setActiveGenerator('objectives');
    
    // Reset state sebelumnya
    setLearningObjectives(null); 
    setReferencedCP(null);
    setAlokasiWaktu(null);
    setLearningFramework(null); 
    setLearningScenario(null); 
    setAssessmentPackage(null);

    try {
      // Menggunakan fungsi tunggal yang jauh lebih efisien
      const result = await generateInitialComponents(lessonDetails);
      
      setLearningObjectives(result.tujuan_pembelajaran);
      setReferencedCP(result.ref_cp);
      setAlokasiWaktu(result.alokasi_waktu);
      setLearningFramework(result.kerangka);

    } catch (e: any) {
      const msg = e.message || "Unknown error";
      setError(`Gagal menghasilkan Tujuan & Kerangka: ${msg}. Silakan coba lagi.`);
      console.error(e);
    } finally {
      setIsLoading(false);
      setActiveGenerator(null);
    }
  }, [lessonDetails]);

  const handleGenerateScenario = useCallback(async () => {
    if (!learningObjectives) {
      setError('Harap hasilkan Tujuan Pembelajaran terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveGenerator('scenario');
    setAssessmentPackage(null); 

    try {
      const result = await generateSkenarioKegiatan({
        ...lessonDetails,
        tujuan_pembelajaran: learningObjectives,
        alokasi_waktu: alokasiWaktu || "2 x 40 Menit"
      });
      setLearningScenario(result);
    } catch (e: any) {
      const msg = e.message || "Unknown error";
      setError(`Gagal menghasilkan Skenario Kegiatan: ${msg}. Silakan coba lagi.`);
      console.error(e);
    } finally {
      setIsLoading(false);
      setActiveGenerator(null);
    }
  }, [lessonDetails, learningObjectives, alokasiWaktu]);
  
  const handleGenerateAssessments = useCallback(async () => {
    if (!learningObjectives || !learningScenario) {
        setError('Harap hasilkan Tujuan Pembelajaran dan Skenario Kegiatan terlebih dahulu.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setActiveGenerator('assessment');
    
    const allIntiActivities = [
        ...learningScenario.kegiatan_inti.memahami.aktivitas,
        ...learningScenario.kegiatan_inti.mengaplikasi.aktivitas,
        ...learningScenario.kegiatan_inti.merefleksi.aktivitas
    ];

    try {
        const result = await generatePaketAsesmen({
            tujuan_pembelajaran: learningObjectives,
            kegiatan_inti: allIntiActivities,
            list_kbc_terpilih: lessonDetails.list_kbc_terpilih,
            list_dpl_terpilih: lessonDetails.list_dpl_terpilih,
        });
        setAssessmentPackage(result);
    } catch (e: any) {
      const msg = e.message || "Unknown error";
      setError(`Gagal menghasilkan Paket Asesmen: ${msg}. Silakan coba lagi.`);
      console.error(e);
    } finally {
        setIsLoading(false);
        setActiveGenerator(null);
    }
  }, [learningObjectives, learningScenario, lessonDetails]);

  const handleExportToWord = useCallback(() => {
    if (!learningObjectives || !learningFramework || !learningScenario || !assessmentPackage) {
        alert("Harap hasilkan semua komponen RPP sebelum mengekspor.");
        return;
    }
    exportToWord({
        lessonDetails,
        learningObjectives,
        alokasiWaktu: alokasiWaktu || "2 x 40 Menit",
        learningFramework,
        learningScenario,
        assessmentPackage,
    });
  }, [lessonDetails, learningObjectives, alokasiWaktu, learningFramework, learningScenario, assessmentPackage]);

  const handleUpdateObjective = useCallback((id: string, newDeskripsi: string) => {
    setLearningObjectives(prev => 
      prev?.map(obj => obj.id === id ? { ...obj, deskripsi: newDeskripsi } : obj) || null
    );
  }, []);

  const handleUpdateScenario = useCallback((path: (string | number)[], newValue: string) => {
      setLearningScenario(prev => {
          if (!prev) return null;
          const newScenario = JSON.parse(JSON.stringify(prev));
          let current: any = newScenario;
          for (let i = 0; i < path.length - 1; i++) {
              current = current[path[i]];
          }
          current[path[path.length - 1]] = newValue;
          return newScenario;
      });
  }, []);

  const handleUpdateAssessment = useCallback((type: 'diagnostik' | 'sumatif', path: (string | number)[], newValue: string) => {
      setAssessmentPackage(prev => {
          if (!prev) return null;
          const newPackage = JSON.parse(JSON.stringify(prev));
          let current: any = newPackage[type === 'diagnostik' ? 'asesmen_diagnostik' : 'asesmen_sumatif'];
          for (let i = 0; i < path.length - 1; i++) {
              current = current[path[i]];
          }
          current[path[path.length - 1]] = newValue;
          return newPackage;
      });
  }, []);


  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Menambahkan class no-print agar teks ini tidak ikut dicetak */}
          <p className="text-center text-slate-600 mb-8 no-print">
            Selamat datang di Asisten Kurikulum Digital. Mulailah dengan mengisi detail pelajaran Anda, lalu hasilkan komponen RPP secara bertahap.
          </p>
          
          <div id="input-form-container" className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
            <InputForm
              lessonDetails={lessonDetails}
              setLessonDetails={setLessonDetails}
              onGenerateObjectives={handleGenerateObjectives}
              onGenerateScenario={handleGenerateScenario}
              onGenerateAssessments={handleGenerateAssessments}
              isObjectivesGenerated={!!learningObjectives}
              isScenarioGenerated={!!learningScenario}
              isLoading={isLoading}
              activeGenerator={activeGenerator}
              saveStatus={saveStatus}
              onClearForm={handleClearFormAndReset}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl shadow-sm mb-8 flex items-start" role="alert">
              <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
              </div>
              <div className="ml-3">
                <p className="font-bold text-red-800">Terjadi Kesalahan</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          <OutputDisplay
            lessonDetails={lessonDetails}
            learningObjectives={learningObjectives}
            referencedCP={referencedCP}
            alokasiWaktu={alokasiWaktu}
            setAlokasiWaktu={setAlokasiWaktu}
            learningFramework={learningFramework}
            learningScenario={learningScenario}
            assessmentPackage={assessmentPackage}
            isLoading={isLoading}
            onExport={handleExportToWord}
            onUpdateObjective={handleUpdateObjective}
            onUpdateScenario={handleUpdateScenario}
            onUpdateAssessment={handleUpdateAssessment}
          />
        </div>
      </main>
      <footer className="text-center p-8 text-sm text-slate-500 border-t border-slate-200 mt-auto bg-white">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          <p>&copy; {new Date().getFullYear()} Asisten Kurikulum Digital (AKD)</p>
          <div className="flex items-center justify-center gap-1.5 text-slate-600">
            <span>Dibuat dengan</span>
            <HeartIcon className="text-red-500 w-5 h-5 fill-current" />
            <span>oleh</span>
            <span className="font-bold text-blue-600">Siswogo.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
