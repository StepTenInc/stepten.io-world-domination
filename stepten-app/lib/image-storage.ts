/**
 * IndexedDB Image Storage with Size Limits
 * Provides persistent storage for generated images with quota management
 */

import {
    INDEXEDDB_NAME,
    INDEXEDDB_STORE_NAME,
    INDEXEDDB_VERSION,
    MAX_IMAGE_SIZE_BYTES,
    MAX_TOTAL_STORAGE_BYTES,
} from "./constants";

const DB_NAME = INDEXEDDB_NAME;
const STORE_NAME = INDEXEDDB_STORE_NAME;
const DB_VERSION = INDEXEDDB_VERSION;

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Opens or creates the IndexedDB database
 * @returns Promise resolving to database connection
 */
function openDB(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return dbPromise;
}

/**
 * Calculates the size of a data URL in bytes
 * @param dataUrl - Data URL string
 * @returns Size in bytes
 */
function getDataUrlSize(dataUrl: string): number {
    // Rough estimate: base64 encoding adds ~33% overhead
    // More accurate: use Blob
    return new Blob([dataUrl]).size;
}

export const imageStorage = {
    /**
     * Saves an image to IndexedDB with size validation
     * @param id - Unique identifier for the image
     * @param dataUrl - Data URL of the image
     * @throws Error if image is too large or storage quota exceeded
     */
    async saveImage(id: string, dataUrl: string): Promise<void> {
        // Validate image size
        const size = getDataUrlSize(dataUrl);
        if (size > MAX_IMAGE_SIZE_BYTES) {
            const sizeMB = (size / 1024 / 1024).toFixed(2);
            const maxMB = (MAX_IMAGE_SIZE_BYTES / 1024 / 1024).toFixed(0);
            throw new Error(
                `Image too large: ${sizeMB}MB (maximum: ${maxMB}MB). Please use a smaller image.`
            );
        }

        // Check total storage before saving
        const currentSize = await this.getTotalStorageSize();
        if (currentSize + size > MAX_TOTAL_STORAGE_BYTES) {
            const currentMB = (currentSize / 1024 / 1024).toFixed(2);
            const maxMB = (MAX_TOTAL_STORAGE_BYTES / 1024 / 1024).toFixed(0);
            throw new Error(
                `Storage quota exceeded: ${currentMB}MB used of ${maxMB}MB. Please delete some images to free up space.`
            );
        }

        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).put({ id, dataUrl, savedAt: Date.now() });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    /**
     * Retrieves an image from IndexedDB
     * @param id - Unique identifier for the image
     * @returns Data URL of the image or null if not found
     */
    async getImage(id: string): Promise<string | null> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const request = tx.objectStore(STORE_NAME).get(id);
            request.onsuccess = () => resolve(request.result?.dataUrl || null);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Deletes an image from IndexedDB
     * @param id - Unique identifier for the image
     */
    async deleteImage(id: string): Promise<void> {
        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    /**
     * Calculates total storage used by all images
     * @returns Total size in bytes
     */
    async getTotalStorageSize(): Promise<number> {
        const db = await openDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const request = tx.objectStore(STORE_NAME).getAllKeys();
            request.onsuccess = async () => {
                const keys = request.result;
                let totalSize = 0;
                for (const key of keys) {
                    const data = await this.getImage(key as string);
                    if (data) {
                        totalSize += getDataUrlSize(data);
                    }
                }
                resolve(totalSize);
            };
            request.onerror = () => resolve(0);
        });
    },

    /**
     * Gets all stored image IDs
     * @returns Array of image IDs
     */
    async getAllImageIds(): Promise<string[]> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const request = tx.objectStore(STORE_NAME).getAllKeys();
            request.onsuccess = () => resolve(request.result as string[]);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Clears all images from storage
     * @returns Number of images deleted
     */
    async clearAll(): Promise<number> {
        const ids = await this.getAllImageIds();
        const count = ids.length;

        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });

        return count;
    },

    /**
     * Gets storage usage information
     * @returns Object with usage statistics
     */
    async getStorageInfo(): Promise<{
        totalImages: number;
        totalSizeBytes: number;
        totalSizeMB: number;
        remainingBytes: number;
        remainingMB: number;
        usagePercentage: number;
    }> {
        const ids = await this.getAllImageIds();
        const totalSize = await this.getTotalStorageSize();
        const remaining = MAX_TOTAL_STORAGE_BYTES - totalSize;

        return {
            totalImages: ids.length,
            totalSizeBytes: totalSize,
            totalSizeMB: parseFloat((totalSize / 1024 / 1024).toFixed(2)),
            remainingBytes: remaining,
            remainingMB: parseFloat((remaining / 1024 / 1024).toFixed(2)),
            usagePercentage: parseFloat(((totalSize / MAX_TOTAL_STORAGE_BYTES) * 100).toFixed(2)),
        };
    },
};
