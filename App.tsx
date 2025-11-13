
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateTujuanPembelajaran, generateKerangkaPembelajaran, generateSkenarioKegiatan, generatePaketAsesmen } from './services/geminiService';
import { exportToWord } from './utils/exportToWord';
import type { LessonDetails, LearningObjective, LearningFramework, LearningScenario, AssessmentPackage } from './types';

const App: React.FC = () => {
  const [lessonDetails, setLessonDetails] = useState<LessonDetails>({
    topik: 'Kiamat Sudah Dekat: Siapkan Amal sebagai Bekal',
    mapel: 'Akidah Akhlak',
    kelas: 'IX / Gasal',
    madrasah: 'MTs Negeri 1 Contoh',
    namaGuru: 'Ahmad, S.Pd.',
    namaKepalaMadrasah: 'Dr. Siti, M.Pd.',
    tempat: 'Jakarta',
    list_kbc_terpilih: ['Cinta Allah dan Rasul-Nya', 'Cinta Diri dan Sesama Manusia'],
    list_dpl_terpilih: ['Keimanan dan Ketakwaan kepada Tuhan YME', 'Penalaran Kritis'],
    model_pembelajaran: 'Cooperative Learning',
    stimulus_url: '',
  });

  const [learningObjectives, setLearningObjectives] = useState<LearningObjective[] | null>(null);
  const [referencedCP, setReferencedCP] = useState<string | null>(null);
  const [learningFramework, setLearningFramework] = useState<LearningFramework | null>(null);
  const [learningScenario, setLearningScenario] = useState<LearningScenario | null>(null);
  const [assessmentPackage, setAssessmentPackage] = useState<AssessmentPackage | null>(null);
  
  const [activeGenerator, setActiveGenerator] = useState<'objectives' | 'scenario' | 'assessment' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateObjectives = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setActiveGenerator('objectives');
    setLearningObjectives(null); // Reset current objectives
    setReferencedCP(null);
    setLearningFramework(null); // Reset framework
    setLearningScenario(null); // Reset subsequent steps
    setAssessmentPackage(null);

    try {
      // Step 1: Generate Objectives
      const objectivesResult = await generateTujuanPembelajaran(lessonDetails);
      const newObjectives = objectivesResult.tujuan_pembelajaran;
      setLearningObjectives(newObjectives);
      setReferencedCP(objectivesResult.ref_cp);
      
      // Step 2: Automatically generate the framework
      const frameworkResult = await generateKerangkaPembelajaran({
        ...lessonDetails,
        tujuan_pembelajaran: newObjectives,
      });
      setLearningFramework(frameworkResult);

    } catch (e) {
      setError('Gagal menghasilkan Tujuan & Kerangka Pembelajaran. Silakan coba lagi.');
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
    setAssessmentPackage(null); // Reset subsequent step

    try {
      const result = await generateSkenarioKegiatan({
        ...lessonDetails,
        tujuan_pembelajaran: learningObjectives,
      });
      setLearningScenario(result);
    } catch (e) {
      setError('Gagal menghasilkan Skenario Kegiatan. Silakan coba lagi.');
      console.error(e);
    } finally {
      setIsLoading(false);
      setActiveGenerator(null);
    }
  }, [lessonDetails, learningObjectives]);
  
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
    } catch (e) {
        setError('Gagal menghasilkan Paket Asesmen. Silakan coba lagi.');
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
        learningFramework,
        learningScenario,
        assessmentPackage,
    });
  }, [lessonDetails, learningObjectives, learningFramework, learningScenario, assessmentPackage]);


  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-slate-600 mb-8">
            Selamat datang di Asisten Kurikulum Digital. Mulailah dengan mengisi detail pelajaran Anda, lalu hasilkan komponen RPP secara bertahap.
          </p>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
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
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8" role="alert">
              <p className="font-bold">Terjadi Kesalahan</p>
              <p>{error}</p>
            </div>
          )}

          <OutputDisplay
            learningObjectives={learningObjectives}
            referencedCP={referencedCP}
            learningFramework={learningFramework}
            learningScenario={learningScenario}
            assessmentPackage={assessmentPackage}
            isLoading={isLoading}
            modelPembelajaran={lessonDetails.model_pembelajaran}
            onExport={handleExportToWord}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Asisten Kurikulum Digital (AKD)</p>
      </footer>
    </div>
  );
};

export default App;
