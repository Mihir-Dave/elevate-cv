import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Only PDF files are allowed.");
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Only PDF files are allowed.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/resume/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const resumeId = res.data.resume._id;
      navigate(`/results/${resumeId}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-10">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-white">
          Analyze Your <span className="text-gradient">Resume</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Upload your PDF resume to let our AI scan, review, and score your profile against modern ATS standards.
        </p>
      </div>

      <Card className="!p-8 sm:!p-12 relative overflow-hidden">
        {/* Subtle background glow inside the card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div 
          className={`relative z-10 border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[360px] bg-slate-900/50 ${
            dragActive ? 'border-blue-500 bg-blue-500/5 scale-[1.01]' : 'border-slate-700 hover:border-blue-400/50 hover:bg-slate-800/80'
          } ${file ? 'border-solid border-blue-500/50 bg-blue-500/5' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input 
            ref={inputRef}
            type="file" 
            accept="application/pdf"
            onChange={handleChange}
            className="hidden"
          />

          {!file ? (
            <div className="flex flex-col items-center space-y-4 pointer-events-none">
              <div className="bg-slate-800 p-4 rounded-full border border-slate-700 shadow-lg mb-2">
                <UploadCloud size={40} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Drag & drop your resume here</h3>
              <p className="text-slate-400 text-sm">or click to browse your files (PDF only)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20 mb-2">
                <FileText size={40} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{file.name}</h3>
              <p className="text-slate-400 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              
              <button 
                className="mt-4 flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors px-4 py-2 hover:bg-red-500/10 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <XCircle size={18} />
                <span>Remove file</span>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400">
            <XCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button 
            className="w-full sm:w-auto min-w-[200px]" 
            size="lg"
            disabled={!file || loading} 
            isLoading={loading}
            onClick={handleUpload}
          >
            {loading ? 'Analyzing Profile...' : 'Scan & Analyze'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
