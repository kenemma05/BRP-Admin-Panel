import React, { useState } from 'react';
import { User, Shield, Key, Clock, CheckCircle2, Save, Camera } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AccountInfoView: React.FC<{ onOpenPhotoModal: () => void }> = ({ onOpenPhotoModal }) => {
  const { currentAdmin, updateAdminProfile, addToast } = useAdmin();

  const [fullName, setFullName] = useState(currentAdmin?.fullName || '');
  const [email, setEmail] = useState(currentAdmin?.email || '');
  const [department, setDepartment] = useState(currentAdmin?.department || '');
  const [bio, setBio] = useState(currentAdmin?.bio || '');

  // Password reset state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({ fullName, email, department, bio });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) {
      addToast({ type: 'error', title: 'Password Error', message: 'New passwords do not match.' });
      return;
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    addToast({ type: 'success', title: 'Password Updated', message: 'Your administrative credentials have been modified.' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Account Information & Security Credentials
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your administrative identity, roles, department assignment, and access tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col: Profile Card with Photo */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center text-center text-xs">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md">
              <img
                src={currentAdmin?.avatarUrl}
                alt={currentAdmin?.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={onOpenPhotoModal}
              className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Change Photo</span>
            </button>
          </div>

          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-3">
            {currentAdmin?.fullName}
          </h3>
          <p className="text-[11px] text-slate-500">{currentAdmin?.email}</p>

          <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>{currentAdmin?.role.replace('_', ' ')}</span>
          </div>

          <div className="w-full mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{currentAdmin?.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Login:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {currentAdmin?.lastLoginAt ? new Date(currentAdmin.lastLoginAt).toLocaleString() : 'Just now'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Security:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                2FA Active
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Edit Info & Password Reset */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Form */}
          <form onSubmit={handleUpdateProfile} className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Directorate / Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Biography & Responsibilities</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Password Reset Form */}
          <form onSubmit={handlePasswordChange} className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Change Password
              </h3>
            </div>

            <div>
              <label className="font-semibold block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!newPass || !confirmPass}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-medium hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
