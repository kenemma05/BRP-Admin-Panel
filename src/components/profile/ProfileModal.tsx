import React, { useState, useRef } from 'react';
import { Camera, X, Check, Upload, User, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_AVATAR_PATH } from '../../lib/initialData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentAdmin, currentEmployee, updateAdminProfile, addToast } = useAdmin();
  const activeUser = currentEmployee || currentAdmin;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAvatar, setSelectedAvatar] = useState(activeUser?.avatarUrl || ADMIN_AVATAR_PATH);
  const [customUrl, setCustomUrl] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    { label: 'Dr. Elena Vance (CSO Lab Coat)', url: ADMIN_AVATAR_PATH },
    { label: 'Executive Scientist (Marcus Chen)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Bioengineer (Sarah Jenkins)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Clinical Director', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Chief Investigator', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast({
          type: 'error',
          title: 'File Too Large',
          message: 'Please choose an image file smaller than 5MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedPreview(dataUrl);
        setCustomUrl('');
        setSelectedAvatar(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const finalUrl = uploadedPreview || customUrl.trim() || selectedAvatar;
    updateAdminProfile({ avatarUrl: finalUrl });
    onClose();
  };

  const activeDisplayAvatar = uploadedPreview || customUrl || selectedAvatar;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Change Staff Profile Picture
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Active Preview */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md">
              <img
                src={activeDisplayAvatar}
                alt="Selected Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-2 text-sm">
              {activeUser?.fullName}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              {(activeUser as any)?.role?.replace('_', ' ') || 'Staff Member'}
            </p>
          </div>

          {/* Option 1: Direct File Upload */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Upload New Image File:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">PNG, JPG, WEBP &le; 5MB</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              <Upload className="w-4 h-4" />
              <span>{uploadedPreview ? 'Choose Different File' : 'Browse Local Image File'}</span>
            </button>
          </div>

          {/* Option 2: Preset Scientific Avatars */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Or Select Scientific Personnel Preset:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(p.url);
                    setCustomUrl('');
                    setUploadedPreview(null);
                  }}
                  title={p.label}
                  className={`relative aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedAvatar === p.url && !customUrl && !uploadedPreview
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  {selectedAvatar === p.url && !customUrl && !uploadedPreview && (
                    <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white stroke-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Option 3: Custom URL */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Or Enter Custom Image URL:
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={customUrl}
              onChange={(e) => {
                setCustomUrl(e.target.value);
                setUploadedPreview(null);
              }}
              className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer shadow-xs"
          >
            Save Profile Photo
          </button>
        </div>
      </div>
    </div>
  );
};
