/**
 * EchoBeat Download Service
 * Handles music downloads for both Web and Native (APK) platforms
 */
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export interface DownloadResult {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Downloads a song to the device
 * - Web: Uses traditional browser download
 * - APK: Uses Capacitor Filesystem to save locally
 */
export const downloadSong = async (
  url: string,
  filename: string
): Promise<DownloadResult> => {
  // Sanitize filename
  const safeFilename = filename.replace(/[^a-zA-Z0-9\-_. ]/g, '');

  // Web platform: use traditional download
  if (!Capacitor.isNativePlatform()) {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = safeFilename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true };
    } catch (error) {
      console.error('Web download error:', error);
      return { success: false, error: String(error) };
    }
  }

  // Native platform (APK): use Filesystem
  try {
    console.log('📥 Starting native download:', url);
    
    // Fetch the audio file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    // Save to Documents/EchoBeat folder
    const result = await Filesystem.writeFile({
      path: `EchoBeat/${safeFilename}`,
      data: base64,
      directory: Directory.Documents,
      recursive: true
    });

    console.log('✅ File saved:', result.uri);
    return { success: true, path: result.uri };
  } catch (error) {
    console.error('❌ Native download error:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Convert Blob to Base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (data:audio/mpeg;base64,)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
};

/**
 * Check if we're on a native platform
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export default {
  downloadSong,
  isNativePlatform
};
