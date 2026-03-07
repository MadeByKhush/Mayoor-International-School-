// src/screens/AdminGallery.jsx

"use client";
import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import Loader from "../ui/Loader";
import { showToast } from "../ui/Toast";
import ConfirmModal from "../ui/ConfirmModal";

export default function AdminGallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [imageFiles, setImageFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStage, setUploadStage] = useState(""); // "", "Processing", "Uploading"
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from("gallery_images")
                .select("*")
                .order("display_order", { ascending: true })
                .order("created_at", { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error("Error fetching gallery images:", error);
            showToast.error("Failed to fetch gallery images.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // Compression Utility Function using Canvas
    const compressImageToWebP = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image();
                img.src = event.target.result;
                img.onload = () => {
                    // Set Max Width (1920px) while maintaining aspect ratio
                    const MAX_WIDTH = 1920;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");

                    // Draw the image on canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to WebP blob (Quality: 0.8)
                    canvas.toBlob((blob) => {
                        if (blob) {
                            // Create a new File from the Blob
                            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                                type: "image/webp",
                                lastModified: Date.now(),
                            });
                            resolve(webpFile);
                        } else {
                            reject(new Error("Canvas toBlob serialization failed"));
                        }
                    }, "image/webp", 0.8);
                };
                img.onerror = (err) => reject(new Error("Failed to load image for compression"));
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const processFiles = (files) => {
        const validFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Validate Type
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                showToast.error(`Skipped ${file.name}: Only JPG, PNG, and WebP are allowed.`);
                continue;
            }
            // Validate Size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast.error(`Skipped ${file.name}: File is larger than 5MB.`);
                continue;
            }
            validFiles.push(file);
        }
        if (validFiles.length > 0) {
            setImageFiles(prev => [...prev, ...validFiles]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const removeFileSelection = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (imageFiles.length === 0) {
            showToast.error("Please select at least one image to upload.");
            return;
        }

        setUploading(true);
        let successCount = 0;
        let failCount = 0;

        for (const file of imageFiles) {
            let uploadedPath = null;
            let fileToUpload = file; // default to original file

            try {
                // Set stage
                setUploadStage("Processing...");

                // Determine if we should attempt compression (JPG/PNG usually benefit; we can also re-compress WebP if it's too large)
                try {
                    fileToUpload = await compressImageToWebP(file);
                } catch (compressionError) {
                    console.warn(`Compression failed for ${file.name}, falling back to original file.`, compressionError);
                    // fileToUpload remains the original `file`
                }

                setUploadStage("Uploading...");

                // 1. Upload to Storage
                const fileExt = fileToUpload.name.split(".").pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`; // bucket is configured to 'gallery'

                const { error: uploadError } = await supabase.storage
                    .from("gallery")
                    .upload(filePath, fileToUpload);

                if (uploadError) throw new Error("Storage upload failed: " + uploadError.message);
                uploadedPath = filePath;

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from("gallery")
                    .getPublicUrl(filePath);

                // 3. Insert into DB
                const { error: dbError } = await supabase.from("gallery_images").insert([
                    {
                        image_url: publicUrl,
                        image_path: filePath,
                        is_visible: true,
                        display_order: 0
                    },
                ]);

                if (dbError) throw new Error("Database insert failed: " + dbError.message);
                successCount++;

            } catch (error) {
                console.error("Error uploading image:", error);
                failCount++;
                showToast.error(`Failed to upload ${file.name}: ${error.message}`);

                // Rollback Storage if DB failed
                if (uploadedPath) {
                    await supabase.storage.from("gallery").remove([uploadedPath]).catch(err =>
                        console.error("Rollback failed for", uploadedPath, err)
                    );
                }
            }
        }

        if (successCount > 0) {
            showToast.success(`Successfully uploaded ${successCount} image(s).`);
        }

        // Reset Form if all succeeded
        if (failCount === 0) {
            setImageFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }

        setUploading(false);
        setUploadStage("");
        fetchImages();
    };

    const handleDeleteClick = (img) => {
        setImageToDelete(img);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!imageToDelete) return;

        try {
            // 1. Delete from Storage using image_path
            const pathToDelete = imageToDelete.image_path;

            // Fallback for old records without image_path
            const finalPath = pathToDelete || imageToDelete.image_url.split("/").pop();

            if (finalPath) {
                const { error: storageError } = await supabase.storage
                    .from("gallery")
                    .remove([finalPath]);

                if (storageError) {
                    console.warn("Storage delete warning/error:", storageError);
                    throw new Error("Failed to delete file from storage.");
                }
            }

            // 2. Delete from DB
            const { error: dbError } = await supabase
                .from("gallery_images")
                .delete()
                .eq("id", imageToDelete.id);

            if (dbError) throw new Error("Failed to delete record from database.");

            showToast.success("Image deleted successfully.");
            fetchImages();
        } catch (error) {
            console.error("Error deleting image:", error);
            showToast.error(error.message || "Failed to delete image.");
        } finally {
            setIsDeleteModalOpen(false);
            setImageToDelete(null);
        }
    };

    const toggleVisibility = async (img) => {
        try {
            const newVisibility = !img.is_visible;
            const { error } = await supabase
                .from("gallery_images")
                .update({ is_visible: newVisibility })
                .eq("id", img.id);

            if (error) throw error;

            showToast.success(`Image is now ${newVisibility ? 'visible' : 'hidden'}.`);
            setImages(images.map(i => i.id === img.id ? { ...i, is_visible: newVisibility } : i));
        } catch (error) {
            console.error("Error toggling visibility:", error);
            showToast.error("Failed to update visibility.");
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Gallery</h1>

            {/* Upload Area */}
            <div className="bg-white p-6 rounded-xl border shadow mb-8">
                <h2 className="text-lg font-semibold mb-4 text-green-700">Upload Photos</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50 bg-gray-50'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/webp"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            onChange={handleFileChange}
                            disabled={uploading}
                            title="Drag & Drop or Click to Upload"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                            <p className="text-gray-600 font-medium">Drag & drop your images here</p>
                            <p className="text-gray-400 text-sm">or click to browse (Max 5MB per image)</p>
                        </div>
                    </div>

                    {/* Preview Selected Files */}
                    {imageFiles.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files ({imageFiles.length})</h3>
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                                {imageFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border text-sm">
                                        <div className="flex items-center space-x-2 truncate">
                                            <span className="text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <span className="truncate max-w-[200px] md:max-w-xs">{file.name}</span>
                                            <span className="text-gray-400 text-xs text-nowrap">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFileSelection(idx)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            disabled={uploading}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={uploading || imageFiles.length === 0}
                    >
                        {uploading && <span className="loading loading-spinner"></span>}
                        {uploading ? (uploadStage || "Uploading Images...") : "Upload Images"}
                    </button>
                </form>
            </div>

            {/* List Images */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Photos</h2>

            {loading ? (
                <div className="flex justify-center py-10"><Loader /></div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                    {images.length === 0 ? (
                        <p className="text-gray-500 col-span-full text-center py-8">No images found in the gallery.</p>
                    ) : (
                        images.map((img) => (
                            <div key={img.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all ${!img.is_visible ? 'opacity-50 saturate-50' : ''}`}>
                                <div className="aspect-square bg-gray-100 overflow-hidden relative group">
                                    <img
                                        src={img.image_url}
                                        loading="lazy"
                                        decoding="async"
                                        alt="Gallery Image"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400?text=Error' }}
                                    />

                                    {/* Action Overlays */}
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.preventDefault(); toggleVisibility(img); }}
                                            className="btn btn-circle btn-xs bg-white/90 hover:bg-white text-gray-800 border-none shadow-sm"
                                            title={img.is_visible ? "Hide from website" : "Show on website"}
                                        >
                                            {img.is_visible ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-green-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleDeleteClick(img); }}
                                            className="btn btn-circle btn-xs btn-error text-white shadow-sm"
                                            title="Delete Image"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {!img.is_visible && (
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] text-center py-1 font-medium z-10">
                                            Hidden
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Image"
                message={`Are you sure you want to delete this image? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                isDangerous={true}
            />
        </AdminLayout>
    );
}
