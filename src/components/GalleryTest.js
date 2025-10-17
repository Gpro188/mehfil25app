import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { loadFromLocalStorage } from '../utils/dataStorage';

const GalleryContainer = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  margin-top: 30px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  color: gold;
`;

const GalleryTest = () => {
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    // Load gallery images from localStorage
    const savedGalleryImages = loadFromLocalStorage('galleryImages', []);
    setGalleryImages(savedGalleryImages);
  }, []);

  return (
    <GalleryContainer>
      <SectionTitle>Gallery Test</SectionTitle>
      {galleryImages.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          {galleryImages.map((image, index) => (
            <div key={index} style={{ 
              borderRadius: '10px', 
              overflow: 'hidden', 
              height: '200px' 
            }}>
              <img 
                src={image} 
                alt={`Gallery ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No gallery images found.</p>
      )}
    </GalleryContainer>
  );
};

export default GalleryTest;