import React from 'react';
import { getStrapiMediaUrl } from '../../lib/strapi';

export default function ContentWithImage({ data }) {
  if (!data) return null;
  const { title, content, image, imagePosition } = data;
  
  const imageUrl = getStrapiMediaUrl(image);
  
  // Clean up rich text formatting
  const formattedContent = content?.replace(/\n/g, '<br />');

  return (
    <div className="mb-12">
      {title && (
        <h2 className="text-3xl font-semibold text-[#212E62] mb-6 pb-2 border-b border-gray-100">
          {title}
        </h2>
      )}

      <div className={`flex flex-col md:flex-row gap-8 items-start ${imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`}>
        
        {/* Text Content */}
        <div className={`prose max-w-none text-gray-700 leading-relaxed ${imageUrl ? 'md:w-2/3' : 'w-full'}`} 
             dangerouslySetInnerHTML={{ __html: formattedContent }} />

        {/* Image */}
        {imageUrl && imagePosition !== 'none' && (
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="rounded-xl overflow-hidden shadow-md">
              <img 
                src={imageUrl} 
                alt={title || "Section Image"} 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
