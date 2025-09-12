import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'picsum.photos',          // Demo/placeholder images
      'i.redd.it',             // Reddit image hosting
      'preview.redd.it',       // Reddit preview images
      'external-preview.redd.it', // Reddit external previews
      'i.imgur.com',           // Common Reddit image host
      'imgur.com'              // Imgur direct links
    ]
  }
};

export default nextConfig;
