import { useState } from 'react';

interface CarGalleryProps {
  mainImage: string;
  thumbnails: string[];
  altText: string;
}

export const CarGallery = ({ mainImage, thumbnails, altText }: CarGalleryProps) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [displayImage, setDisplayImage] = useState(thumbnails[0] || mainImage);

  const handleThumbnailClick = (index: number, imageUrl: string) => {
    setSelectedThumbnail(index);
    setDisplayImage(imageUrl);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      {/* Left column with thumbnails */}
      <div className="flex md:flex-col gap-2 order-2 md:order-1 md:w-1/6">
        {thumbnails.map((thumb, index) => (
          <div 
            key={index}
            className={`cursor-pointer rounded-md overflow-hidden md:mt-1.5 mr-2 ${
              selectedThumbnail === index ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleThumbnailClick(index, thumb)}
          >
            <img 
              src={thumb} 
              alt={`${altText} view ${index + 1}`} 
              className="w-full h-16 object-cover" 
            />
          </div>
        ))}
      </div>
      
      {/* Right column with main image */}
      <div className="relative order-1 md:order-2 md:flex-1">
        <div className="bg-gray-100 rounded overflow-hidden">
          <img
            src={displayImage}
            alt={altText}
            className="w-full h-64 md:h-96 object-cover"
          />
          <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-sm font-normal text-center">
            Available
          </span>
        </div>
      </div>
    </div>
  );
};