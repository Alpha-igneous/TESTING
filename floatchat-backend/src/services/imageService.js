const axios = require('axios');
const unsplashConfig = require('../config/upsplash');

class ImageService {
  constructor() {
    this.client = axios.create({
      baseURL: unsplashConfig.baseUrl,
      headers: {
        'Authorization': `Client-ID ${unsplashConfig.accessKey}`
      }
    });
  }

  async searchImages(query, perPage = 20, page = 1) {
    try {
      const response = await this.client.get(unsplashConfig.searchEndpoint, {
        params: { 
          query, 
          per_page: perPage,
          page,
          orientation: 'squarish' // Better for profile pictures
        }
      });
      
      return {
        success: true,
        images: response.data.results.map(img => ({
          id: img.id,
          url: img.urls.small,
          fullUrl: img.urls.regular,
          description: img.alt_description,
          photographer: {
            name: img.user.name,
            username: img.user.username,
            profileUrl: img.user.links.html
          },
          downloadUrl: `${img.links.download}?force=true`
        })),
        total: response.data.total,
        totalPages: response.data.total_pages
      };
    } catch (error) {
      throw new Error('Failed to fetch images from Unsplash');
    }
  }

  async getImageById(imageId) {
    try {
      const response = await this.client.get(`${unsplashConfig.photoEndpoint}/${imageId}`);

      return {
        id: response.data.id,
        url: response.data.urls.small,
        fullUrl: response.data.urls.regular,
        description: response.data.alt_description,
        photographer: {
          name: response.data.user.name,
          username: response.data.user.username
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch image from Unsplash');
    }
  }

  validateUnsplashUrl(url) {
    return /^https:\/\/images\.unsplash\.com\//.test(url);
  }
}

module.exports = new ImageService();
