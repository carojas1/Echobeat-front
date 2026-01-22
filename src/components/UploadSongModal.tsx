import React, { useState, useRef, useCallback } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { cloudUpload, checkmarkCircle } from "ionicons/icons";
import { uploadSong, getSongs } from "../services/api.service";
import { MOODS } from "../config/constants";
import "./UploadSongModal.css";

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onSongsUpdated?: (
    songs: Array<{
      id: string;
      title: string;
      artist: string;
      album?: string;
      duration: number;
      fileUrl: string;
      coverUrl?: string;
      genre?: string;
      playCount: number;
      mood?: string;
    }>,
  ) => void;
}

const UploadSongModal: React.FC<UploadSongModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  onSongsUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    mood: "happy",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Internal toast for status messages
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<"success" | "danger">("success");

  const showErr = (msg: string) => {
    setToastColor("danger");
    setToastMessage(`❌ ${msg}`);
    setShowToast(true);
    onError?.(msg);
  };

  const showOk = (msg: string) => {
    setToastColor("success");
    setToastMessage(msg);
    setShowToast(true);
    onSuccess?.(msg);
  };

  const resetForm = () => {
    setNewSong({ title: "", artist: "", album: "", mood: "happy" });
    setSelectedFile(null);
    // Nota: el input real se limpia cuando vuelves a abrir el selector
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.includes("audio")) {
      setSelectedFile(file);
    } else if (file) {
      showErr("Solo se permiten archivos de audio");
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.includes("audio")) {
        setSelectedFile(file);
      } else if (file) {
        showErr("Solo se permiten archivos de audio");
      }
    },
    [onError],
  );

  // ✅ Lee duración real; si falla -> 180
  const getSafeDurationSeconds = async (file: File): Promise<number> => {
    const blobUrl = URL.createObjectURL(file);
    const audio = new Audio();

    try {
      audio.preload = "metadata";
      audio.src = blobUrl;

      const durationRaw = await new Promise<number>((resolve, reject) => {
        const timer = window.setTimeout(() => {
          reject(new Error("No se pudo leer la duración (timeout)"));
        }, 3000);

        const onLoaded = () => {
          window.clearTimeout(timer);
          // a veces duration sale Infinity o NaN dependiendo del codec
          resolve(audio.duration);
        };

        const onErrorEv = () => {
          window.clearTimeout(timer);
          reject(new Error("No se pudo leer la duración (error metadata)"));
        };

        audio.addEventListener("loadedmetadata", onLoaded, { once: true });
        audio.addEventListener("error", onErrorEv, { once: true });
      });

      const parsed = Number(durationRaw);
      if (Number.isFinite(parsed) && parsed >= 1) {
        return Math.max(1, Math.floor(parsed));
      }
      return 180;
    } catch {
      return 180;
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  };

  // ✅ Normaliza cualquier respuesta a array (evita .map crash)
  const normalizeSongsArray = (data: unknown): Array<{
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    fileUrl: string;
    coverUrl?: string;
    genre?: string;
    playCount: number;
    mood?: string;
  }> => {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.songs)) return d.songs;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return [data as {
      id: string;
      title: string;
      artist: string;
      album?: string;
      duration: number;
      fileUrl: string;
      coverUrl?: string;
      genre?: string;
      playCount: number;
      mood?: string;
    }];
    return [];
  };

  const handleUpload = async () => {
    if (isUploading) return;
    setIsUploading(true);

    try {
      // ✅ VALIDAR PRIMERO (no uses selectedFile! antes)
      if (!selectedFile) throw new Error("Selecciona un archivo");
      if (!newSong.title?.trim()) throw new Error("Título requerido");
      if (!newSong.artist?.trim()) throw new Error("Artista requerido");
      if (!newSong.mood?.trim()) throw new Error("Mood requerido");

      // ✅ duración segura SIEMPRE (int >= 1)
      const safeDuration = await getSafeDurationSeconds(selectedFile);

      // Create FormData - EXACT keys as backend expects
      const fd = new FormData();
      fd.append("file", selectedFile); // ✅ "file"
      fd.append("title", newSong.title.trim());
      fd.append("artist", newSong.artist.trim());
      fd.append("mood", newSong.mood.trim());
      fd.append("duration", String(safeDuration)); // ✅ int as string

      // Upload to backend
      await uploadSong(fd);

      // Reload songs (no asumas estructura)
      const songsResponse = await getSongs({ page: 1, limit: 100 });
      const songsArr = normalizeSongsArray(songsResponse);

      // ✅ manda siempre array
      onSongsUpdated?.(songsArr);

      showOk("✅ Canción subida correctamente");

      resetForm();

      // Close modal after delay to avoid removeChild error
      setTimeout(() => {
        onClose();
      }, 350);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al subir canción";
      showErr(errorMsg);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
      }, 200);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    resetForm();
    onClose();
  };

  return (
    <>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={handleClose}
        keepContentsMounted={true}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>🎵 Subir Canción</IonTitle>
            <IonButton
              slot="end"
              fill="clear"
              onClick={handleClose}
              disabled={isUploading}
            >
              {isUploading ? "Subiendo..." : "Cerrar"}
            </IonButton>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="stacked">Título *</IonLabel>
            <IonInput
              value={newSong.title}
              placeholder="Nombre de la canción"
              onIonChange={(e) =>
                setNewSong({ ...newSong, title: e.detail.value || "" })
              }
              disabled={isUploading}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Artista *</IonLabel>
            <IonInput
              value={newSong.artist}
              placeholder="Nombre del artista"
              onIonChange={(e) =>
                setNewSong({ ...newSong, artist: e.detail.value || "" })
              }
              disabled={isUploading}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Álbum</IonLabel>
            <IonInput
              value={newSong.album}
              placeholder="Nombre del álbum (opcional)"
              onIonChange={(e) =>
                setNewSong({ ...newSong, album: e.detail.value || "" })
              }
              disabled={isUploading}
            />
          </IonItem>

          <IonItem lines="none" className="mood-selector-container">
            <IonLabel position="stacked" style={{ marginBottom: "10px" }}>
              Mood / Estado de Ánimo
            </IonLabel>

            <div
              className="mood-grid-selector"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                width: "100%",
                padding: "5px",
              }}
            >
              {MOODS.map((mood) => (
                <div
                  key={mood.id}
                  onClick={() =>
                    !isUploading &&
                    setNewSong({ ...newSong, mood: mood.id })
                  }
                  style={{
                    background:
                      newSong.mood === mood.id
                        ? mood.color
                        : "rgba(255,255,255,0.05)",
                    border:
                      newSong.mood === mood.id
                        ? `2px solid ${mood.color}`
                        : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "12px 5px",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    opacity: newSong.mood === mood.id ? 1 : 0.7,
                    transform:
                      newSong.mood === mood.id ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                    {mood.emoji}
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: "bold" }}>
                    {mood.name}
                  </div>
                </div>
              ))}
            </div>
          </IonItem>

          {/* Drag & Drop Zone */}
          <div
            className={`upload-zone ${isDragOver ? "drag-over" : ""} ${
              selectedFile ? "has-file" : ""
            }`}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
              disabled={isUploading}
            />

            <IonIcon icon={selectedFile ? checkmarkCircle : cloudUpload} />

            {selectedFile ? (
              <>
                <p>Archivo seleccionado</p>
                <p className="file-name">{selectedFile.name}</p>
                <p className="upload-hint">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <p>Arrastra el archivo aquí o haz clic</p>
                <p className="upload-hint">MP3, WAV, OGG (máx 50MB)</p>
              </>
            )}
          </div>

          <IonButton
            expand="block"
            onClick={handleUpload}
            disabled={isUploading || !newSong.title || !newSong.artist || !selectedFile}
          >
            {isUploading ? (
              <>
                <IonSpinner name="crescent" />
                <span style={{ marginLeft: "8px" }}>Subiendo...</span>
              </>
            ) : (
              <>
                <IonIcon slot="start" icon={cloudUpload} />
                Subir Canción
              </>
            )}
          </IonButton>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
        color={toastColor}
      />
    </>
  );
};

export default UploadSongModal;
