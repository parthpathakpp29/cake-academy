import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('video', file);

        setUploading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/upload/video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onUploadComplete(response.data.video.url);
            alert('Video uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept="video/*" />
            <button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
        </div>
    );
};

export default VideoUpload;