import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/file-upload.css'; // Import the CSS file
import { POOLING_DURATION, StatusTypes, UPLOAD_URL } from '../constants/api-constant';
import { taskStatus } from '../services/api-service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<number | null>(null);
  const [status, setStatus] = useState(-1);
  let toastPProps = {
    position: "top-center",
    autoClose: 2000
  }
  useEffect(() => {
    if (!taskId) return;
    let maxRetry = 10;
    const poolIntervalId = setInterval(() => {
      if (taskId === null || taskId === undefined) {
        clearInterval(poolIntervalId);
        return;
      }
      taskStatus(taskId).then((res) => {
        let { status_id } = res;
        maxRetry -= 1;
        if (status_id === StatusTypes.COMPLETED || status_id === StatusTypes.FAILED || maxRetry === 0) {
          clearInterval(poolIntervalId);
          if (status_id === StatusTypes.COMPLETED) {
            toast.success('Upload Completed Successfully!',toastPProps);
          } else if (status_id === StatusTypes.FAILED) {
            toast.error('File upload failed. Please try again.',toastPProps);
          }
        }
        setStatus(status_id);
      }).catch( (e)=>{ clearInterval(poolIntervalId);});
    }, POOLING_DURATION);

    return () => clearInterval(poolIntervalId);
  }, [taskId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warn('Please select a file before uploading.',toastPProps);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No authentication token found. Please log in.',toastPProps);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setTaskId(response?.data?.task_id);
       toast.info('File upload started. Processing...',toastPProps);
    } catch (error) {
      toast.error('File upload failed',toastPProps);
    }
  };

  return (
    <div className="upload-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="upload-title">Upload File</h2>
      <input className="file-input" type="file" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload}>Upload</button>
      {/* 
      {status === StatusTypes.PENDING || status === StatusTypes.PROCESSING ? <div className="status processing"> Upload processing...</div> : null}
      {status === StatusTypes.FAILED ? <div className="status failed"> Upload Failed</div> : null}
      {status === StatusTypes.COMPLETED ? <div className="status completed"> Upload Completed</div> : null} */}
    </div>
  );
};

export default FileUpload;
