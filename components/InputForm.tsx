
import React, { useMemo } from 'react';
import type { LessonDetails } from '../types';
import { Loader } from './Loader';
import { ArrowRightIcon, CheckIcon } from './icons';

interface InputFormProps {
  lessonDetails: LessonDetails;
  setLessonDetails: React.Dispatch<React.SetStateAction<LessonDetails>>;
  onGenerateObjectives: () => void;
  onGenerateScenario: () => void;
  onGenerateAssessments: () => void;
  isObjectivesGenerated: boolean;
  isScenarioGenerated: boolean;
  isLoading: boolean;
  activeGenerator: 'objectives' | 'scenario' | 'assessment' | null;
}

const KBC_OPTIONS = ['Cinta Allah dan Rasul-Nya', 'Cinta Ilmu', 'Cinta Lingkungan', 'Cinta Diri dan Sesama Manusia', 'Cinta Tanah Air'];
const DPL_OPTIONS = ['Keimanan dan Ketakwaan kepada Tuhan YME', 'Kewargaan', 'Penalaran Kritis', 'Kreativitas', 'Kolaborasi', 'Kemandirian', 'Kesehatan', 'Komunikasi'];

const LEARNING_MODELS = [
    { name: 'Cooperative Learning', syntax: 'Siswa bekerja dalam kelompok kecil untuk mencapai tujuan bersama, menekankan pembelajaran kolaboratif dan tanggung jawab individu serta kelompok.' },
    { name: 'Problem-Based Learning', syntax: 'Pembelajaran dimulai dengan masalah otentik. Siswa mengidentifikasi apa yang perlu mereka ketahui untuk menyelesaikan masalah tersebut.' },
    { name: 'Project-Based Learning', syntax: 'Siswa terlibat dalam investigasi mendalam terhadap topik dunia nyata, yang berpuncak pada produk atau presentasi publik.' },
    { name: 'Discovery Learning', syntax: 'Siswa didorong untuk menemukan prinsip atau konsep sendiri melalui eksplorasi aktif dan penyelidikan yang dipandu guru.' },
];


export const InputForm: React.FC<InputFormProps> = ({
  lessonDetails,
  setLessonDetails,
  onGenerateObjectives,
  onGenerateScenario,
  onGenerateAssessments,
  isObjectivesGenerated,
  isScenarioGenerated,
  isLoading,
  activeGenerator,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLessonDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: 'kbc' | 'dpl', value: string) => {
    const key = category === 'kbc' ? 'list_kbc_terpilih' : 'list_dpl_terpilih';
    const currentList = lessonDetails[key];
    const newList = currentList.includes(value)
      ? currentList.filter(item => item !== value)
      : [...currentList, value];
    setLessonDetails(prev => ({ ...prev, [key]: newList }));
  };

  const selectedModelSyntax = useMemo(() => {
    return LEARNING_MODELS.find(model => model.name === lessonDetails.model_pembelajaran)?.syntax || '';
  }, [lessonDetails.model_pembelajaran]);


  const commonButtonClasses = "w-full flex items-center justify-center px-4 py-3 text-base font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const disabledButtonClasses = "bg-slate-200 text-slate-500 cursor-not-allowed";
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-3">1. Detail Pelajaran</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="madrasah" className="block text-sm font-medium text-slate-700 mb-1">Nama Madrasah</label>
          <input type="text" name="madrasah" id="madrasah" value={lessonDetails.madrasah} onChange={handleInputChange} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="mapel" className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
          <input type="text" name="mapel" id="mapel" value={lessonDetails.mapel} onChange={handleInputChange} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
         <div>
          <label htmlFor="kelas" className="block text-sm font-medium text-slate-700 mb-1">Kelas / Semester</label>
          <input type="text" name="kelas" id="kelas" value={lessonDetails.kelas} onChange={handleInputChange} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="topik" className="block text-sm font-medium text-slate-700 mb-1">Topik Pembelajaran</label>
          <input type="text" name="topik" id="topik" value={lessonDetails.topik} onChange={handleInputChange} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="stimulus_url" className="block text-sm font-medium text-slate-700 mb-1">
            Tautan Video/Animasi Stimulus <span className="text-slate-500 font-normal">(Opsional)</span>
          </label>
          <input
            type="url"
            name="stimulus_url"
            id="stimulus_url"
            value={lessonDetails.stimulus_url}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="namaGuru" className="block text-sm font-medium text-slate-700 mb-1">Nama Guru</label>
          <input type="text" name="namaGuru" id="namaGuru" value={lessonDetails.namaGuru} onChange={handleInputChange} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="namaKepalaMadrasah" className="block text-sm font-medium text-slate-700 mb-1">Nama Kepala Madrasah</label>
          <input type="text" name="namaKepalaMadrasah" id="namaKepalaMadrasah" value={lessonDetails.namaKepalaMadrasah} onChange={handleInputChange} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="tempat" className="block text-sm font-medium text-slate-700 mb-1">Tempat Pembuatan RPP (Kota)</label>
          <input type="text" name="tempat" id="tempat" value={lessonDetails.tempat} onChange={handleInputChange} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Pilih Topik Panca Cinta (KBC)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {KBC_OPTIONS.map(option => (
            <label key={option} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={lessonDetails.list_kbc_terpilih.includes(option)} onChange={() => handleCheckboxChange('kbc', option)} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Pilih Dimensi Profil Lulusan (DPL)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {DPL_OPTIONS.map(option => (
            <label key={option} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={lessonDetails.list_dpl_terpilih.includes(option)} onChange={() => handleCheckboxChange('dpl', option)} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Model Pembelajaran (Kegiatan Inti)</h3>
        <label htmlFor="model_pembelajaran" className="block text-sm text-slate-600 mb-1">
            Pilih model untuk merancang alur kegiatan inti.
        </label>
         <select
            id="model_pembelajaran"
            name="model_pembelajaran"
            value={lessonDetails.model_pembelajaran}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
        >
            {LEARNING_MODELS.map(model => (
                <option key={model.name} value={model.name}>{model.name}</option>
            ))}
        </select>
        <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded-md">
            <strong>Deskripsi Sintaks:</strong> {selectedModelSyntax}
        </p>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 pt-4">2. Hasilkan Komponen RPP</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Step 1: Objectives */}
        <div className="flex flex-col items-center space-y-2">
            <button 
                onClick={onGenerateObjectives}
                disabled={isLoading}
                className={`${commonButtonClasses} ${isLoading ? disabledButtonClasses : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`}
            >
                {isLoading && activeGenerator === 'objectives' ? <Loader /> : isObjectivesGenerated ? <CheckIcon/> : <ArrowRightIcon/>}
                <span className="ml-2">{isObjectivesGenerated ? 'Tujuan Dihasilkan' : 'Hasilkan Tujuan'}</span>
            </button>
            <p className="text-xs text-slate-500 text-center">Langkah 1: Tentukan tujuan pembelajaran.</p>
        </div>
        {/* Step 2: Scenario */}
        <div className="flex flex-col items-center space-y-2">
            <button 
                onClick={onGenerateScenario}
                disabled={!isObjectivesGenerated || isLoading}
                className={`${commonButtonClasses} ${!isObjectivesGenerated || isLoading ? disabledButtonClasses : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'}`}
            >
                {isLoading && activeGenerator === 'scenario' ? <Loader /> : isScenarioGenerated ? <CheckIcon/> : <ArrowRightIcon/>}
                <span className="ml-2">{isScenarioGenerated ? 'Skenario Dihasilkan' : 'Hasilkan Skenario'}</span>
            </button>
             <p className="text-xs text-slate-500 text-center">Langkah 2: Rancang skenario kegiatan.</p>
        </div>
        {/* Step 3: Assessment */}
        <div className="flex flex-col items-center space-y-2">
            <button 
                onClick={onGenerateAssessments}
                disabled={!isScenarioGenerated || isLoading}
                className={`${commonButtonClasses} ${!isScenarioGenerated || isLoading ? disabledButtonClasses : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'}`}
            >
                {isLoading && activeGenerator === 'assessment' ? <Loader /> : <ArrowRightIcon/>}
                <span className="ml-2">Hasilkan Asesmen</span>
            </button>
             <p className="text-xs text-slate-500 text-center">Langkah 3: Buat paket asesmen lengkap.</p>
        </div>
      </div>
    </div>
  );
};
