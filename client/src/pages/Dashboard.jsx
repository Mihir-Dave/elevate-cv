import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

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
      // 1. Upload Resume
      const res = await axios.post(`${API_URL}/resume/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const resumeId = res.data.resume._id;
      
      // 2. Head to Results Page where analysis will happen
      navigate(`/results/${resumeId}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container animate-slide-up">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Analyze Your <span className="gradient-text">Resume</span></h1>
        <p className="dashboard-subtitle">Upload your PDF resume to let our AI scan, review, and score your profile against modern ATS standards.</p>
      </div>

      <GlassCard className="upload-card">
        <div 
          className={`drop-zone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
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
            style={{ display: "none" }}
          />

          {!file ? (
            <div className="drop-content">
              <div className="upload-icon-wrapper">
                <UploadCloud size={48} className="upload-icon" />
              </div>
              <h3>Drag & drop your resume here</h3>
              <p>or click to browse your files (PDF only)</p>
            </div>
          ) : (
            <div className="file-content">
              <FileText size={48} className="file-icon gradient-text" />
              <h3>{file.name}</h3>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              
              <button 
                className="remove-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <XCircle size={20} />
                Remove file
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="upload-error">
            <XCircle size={18} />
            {error}
          </div>
        )}

        <div className="upload-actions">
          <Button 
            className="analyze-btn" 
            disabled={!file || loading} 
            isLoading={loading}
            onClick={handleUpload}
          >
            {loading ? 'Uploading...' : 'Scan & Analyze'}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
