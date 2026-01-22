import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { IonContent, IonPage, IonSearchbar, IonIcon, IonSpinner } from '@ionic/react';
import { closeOutline, checkmarkCircle } from 'ionicons/icons';
import { imageSearchService } from '../../services/image-search.service';
import './AestheticSearch.css';

interface AestheticSearchProps {
    onSelectCover?: (imageUrl: string) => void;
}

export const AestheticSearch: React.FC<AestheticSearchProps> = ({ onSelectCover }) => {
    const [searchQuery, setSearchQuery] = useState('aesthetic music dark');
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('dark-music');

    const filters = imageSearchService.getPresetQueries();

    useEffect(() => {
        searchImages(searchQuery);
    }, []);

    const searchImages = async (query: string) => {
        setLoading(true);
        try {
            const results = await imageSearchService.searchAestheticCovers(query);
            setImages(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterClick = (filter: any) => {
        setActiveFilter(filter.id);
        setSearchQuery(filter.query);
        searchImages(filter.query);
    };

    const handleSearch = (e: any) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            searchImages(query);
        }
    };

    const handleImageClick = (image: any) => {
        setSelectedImage(image.urls.regular);
    };

    const handleSetCover = () => {
        if (selectedImage && onSelectCover) {
            onSelectCover(selectedImage);
            setSelectedImage(null);
        }
    };

    const breakpointColumns = {
        default: 3,
        1100: 3,
        700: 2,
        500: 2
    };

    return (
        <IonPage>
            <IonContent>
                <div className="aesthetic-search">
                    {/* Header */}
                    <div className="aesthetic-header">
                        <h2>Aesthetic Cover Search</h2>
                        <p>Esto es lo que hemos encontrado para música aesthetic...</p>
                    </div>

                    {/* Search Bar */}
                    <div className="aesthetic-search-bar">
                        <IonSearchbar
                            value={searchQuery}
                            onIonInput={handleSearch}
                            placeholder="Buscar aesthetic covers..."
                            mode="ios"
                            className="aesthetic-searchbar"
                        />
                    </div>

                    {/* Filters */}
                    <div className="aesthetic-filters">
                        <div className="filter-chips">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(filter)}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="aesthetic-loading">
                            <IonSpinner name="crescent" />
                            <p>Buscando imágenes aesthetic...</p>
                        </div>
                    )}

                    {/* Masonry Grid */}
                    {!loading && images.length > 0 && (
                        <Masonry
                            breakpointCols={breakpointColumns}
                            className="masonry-grid"
                            columnClassName="masonry-column"
                        >
                            {images.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    className={`masonry-item ${selectedImage === image.urls.regular ? 'selected' : ''}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    onClick={() => handleImageClick(image)}
                                >
                                    <img
                                        src={image.urls.small}
                                        alt={image.alt_description || 'Aesthetic cover'}
                                        loading="lazy"
                                    />
                                    <div className="masonry-overlay">
                                        <p className="masonry-photographer">
                                            by {image.user.name}
                                        </p>
                                    </div>
                                    {selectedImage === image.urls.regular && (
                                        <div className="masonry-selected-badge">
                                            <IonIcon icon={checkmarkCircle} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </Masonry>
                    )}

                    {/* Empty State */}
                    {!loading && images.length === 0 && (
                        <div className="aesthetic-empty">
                            <p>No se encontraron imágenes</p>
                            <p className="aesthetic-empty-hint">Intenta con otra búsqueda</p>
                        </div>
                    )}

                    {/* Set Cover Button */}
                    {selectedImage && (
                        <motion.div
                            className="set-cover-container"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <button className="set-cover-btn" onClick={handleSetCover}>
                                Usar como portada
                            </button>
                        </motion.div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};
