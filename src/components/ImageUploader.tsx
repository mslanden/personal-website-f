'use client';

import { useState } from 'react';
import { storage } from '../lib/supabase-client';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  defaultImageUrl?: string;
}

export default function ImageUploader({ onImageUploaded, defaultImageUrl }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageUrl, setImageUrl] = useState(defaultImageUrl || '');
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    // Validate file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    
    try {
      const { url, error } = await storage.uploadImage(file);
      
      if (error) {
        throw error;
      }
      
      if (url) {
        setImageUrl(url);
        onImageUploaded(url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection through the file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle manual URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageUploaded(url);
  };

  return (
    <div className={styles.uploader}>
      <div 
        className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {imageUrl ? (
          <div className={styles.preview}>
            <img src={imageUrl} alt="Preview" />
            <button 
              type="button" 
              className={styles.changeButton}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Change image
            </button>
          </div>
        ) : (
          <>
            <p>Drag and drop an image here, or click to select</p>
            {isUploading && <p className={styles.uploading}>Uploading...</p>}
          </>
        )}
        
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {!imageUrl && (
          <button 
            type="button" 
            className={styles.browseButton}
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
          >
            Browse files
          </button>
        )}
      </div>
      
      {uploadError && <p className={styles.error}>{uploadError}</p>}
      
      <div className={styles.urlInput}>
        <label htmlFor="image-url">Or enter image URL:</label>
        <input
          id="image-url"
          type="text"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
}