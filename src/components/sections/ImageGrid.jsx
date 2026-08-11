import React from 'react';
import { getStrapiMediaUrl } from '../../lib/strapi';

export default function ImageGrid({ data }) {
  if (!data || !data.items || data.items.length === 0) return null;
  const { title, items } = data;

  return (
    <div className="mb-12 mt-8">
      {title && (
        <h3 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-wider">
          {title}
        </h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, idx) => {
          const imageUrl = getStrapiMediaUrl(item.image);
          return (
            <div key={item.id || idx} className="flex flex-col items-center group">
              <div className="w-full h-48 rounded-lg overflow-hidden shadow-sm bg-gray-100 mb-3 border border-gray-200">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={item.label || "Grid Image"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
