// Unsplash API Service
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Get from https://unsplash.com/developers

export interface UnsplashImage {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string | null;
    user: {
        name: string;
        username: string;
    };
    width: number;
    height: number;
}

export interface PexelsImage {
    id: number;
    src: {
        original: string;
        large: string;
        medium: string;
        small: string;
    };
    alt: string;
    photographer: string;
    width: number;
    height: number;
}

export class ImageSearchService {
    private unsplashBaseUrl = 'https://api.unsplash.com';
    private pexelsBaseUrl = 'https://api.pexels.com/v1';

    // Unsplash search
    async searchUnsplash(query: string, perPage: number = 30): Promise<UnsplashImage[]> {
        try {
            const response = await fetch(
                `${this.unsplashBaseUrl}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=squarish`,
                {
                    headers: {
                        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Unsplash API error');
            }

            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Unsplash search failed:', error);
            return [];
        }
    }

    // Pexels search (fallback)
    async searchPexels(query: string, perPage: number = 30): Promise<PexelsImage[]> {
        const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY'; // Get from https://www.pexels.com/api/

        try {
            const response = await fetch(
                `${this.pexelsBaseUrl}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=square`,
                {
                    headers: {
                        'Authorization': PEXELS_API_KEY
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Pexels API error');
            }

            const data = await response.json();
            return data.photos;
        } catch (error) {
            console.error('Pexels search failed:', error);
            return [];
        }
    }

    // Combined search with fallback
    async searchAestheticCovers(query: string = 'aesthetic music dark'): Promise<any[]> {
        // Try Unsplash first
        let images = await this.searchUnsplash(query);

        // If no results, try Pexels
        if (images.length === 0) {
            const pexelsImages = await this.searchPexels(query);
            // Normalize Pexels format to Unsplash format
            images = pexelsImages.map(img => ({
                id: img.id.toString(),
                urls: {
                    raw: img.src.original,
                    full: img.src.large,
                    regular: img.src.medium,
                    small: img.src.small,
                    thumb: img.src.small
                },
                alt_description: img.alt,
                user: {
                    name: img.photographer,
                    username: img.photographer
                },
                width: img.width,
                height: img.height
            }));
        }

        return images;
    }

    // Preset aesthetic queries
    getPresetQueries() {
        return [
            { id: 'dark-music', label: 'Dark Music', query: 'dark aesthetic music' },
            { id: 'lofi', label: 'Lo-Fi', query: 'lofi aesthetic cover' },
            { id: 'neon', label: 'Neon', query: 'neon aesthetic dark' },
            { id: 'vinyl', label: 'Vinyl', query: 'vinyl record aesthetic' },
            { id: 'cassette', label: 'Cassette', query: 'cassette tape aesthetic' },
            { id: 'headphones', label: 'Headphones', query: 'headphones aesthetic dark' },
            { id: 'abstract', label: 'Abstract', query: 'abstract music dark' },
            { id: 'minimal', label: 'Minimal', query: 'minimalist music aesthetic' }
        ];
    }
}

export const imageSearchService = new ImageSearchService();
