import React, { useState } from 'react';
import { Camera, X, Check, Upload, User } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_AVATAR_PATH } from '../../lib/initialData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentAdmin, updateAdminProfile } = useAdmin();
  const [selectedAvatar, setSelectedAvatar] = useState(currentAdmin?.avatarUrl || ADMIN_AVATAR_PATH);
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const presets = [
    { label: 'Dr. Elena Vance (CSO Lab Coat)', url: ADMIN_AVATAR_PATH },
    { label: 'Executive Scientist (Marcus Chen)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Bioengineer (Sarah Jenkins)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Clinical Director', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Chief Investigator', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80' },
  ];

  const handleSave = () => {
    const finalUrl = customUrl.trim() || selectedAvatar;
    updateAdminProfile({ avatarUrl: finalUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Change Admin Profile Picture
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Active Preview */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md">
              <img
                src={customUrl || selectedAvatar}
                alt="Selected Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-2">{currentAdmin?.fullName}</p>
            <p className="text-[11px] text-slate-400">{currentAdmin?.role.replace('_', ' ')}</p>
          </div>

          {/* Preset Choices */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Select Scientific Personnel Avatar:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(p.url);
                    setCustomUrl('');
                  }}
                  title={p.label}
                  className={`relative aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedAvatar === p.url && !customUrl
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  {selectedAvatar === p.url && !customUrl && (
                    <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white stroke-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL or upload simulation */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Or Enter Custom Image URL:
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
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
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
          >
            Update Photo
          </button>
        </div>
      </div>
    </div>
  );
};
