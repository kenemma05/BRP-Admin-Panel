import React, { useState, useRef } from 'react';
import { User, Shield, Key, Clock, CheckCircle2, Save, Camera, Phone, Mail, Building, Briefcase, Upload } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AccountInfoView: React.FC<{ onOpenPhotoModal: () => void }> = ({ onOpenPhotoModal }) => {
  const { currentAdmin, currentEmployee, updateAdminProfile, addToast, resetEmployeePassword } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUser = currentEmployee || currentAdmin;

  const [fullName, setFullName] = useState(activeUser?.fullName || '');
  const [email, setEmail] = useState(activeUser?.email || '');
  const [department, setDepartment] = useState(activeUser?.department || '');
  const [jobTitle, setJobTitle] = useState((activeUser as any)?.jobTitle || 'Administrator');
  const [phoneNumber, setPhoneNumber] = useState((activeUser as any)?.phoneNumber || '+44 020 7946 0199');
  const [bio, setBio] = useState((activeUser as any)?.bio || 'Directorate of scientific research operations, regulatory governance, and tenant support.');

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      fullName,
      email,
      department,
      bio,
      phoneNumber,
      ...(jobTitle ? { jobTitle } : {}),
    } as any);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 8) {
      addToast({ type: 'error', title: 'Password Too Short', message: 'New password must contain at least 8 characters.' });
      return;
    }
    if (newPass !== confirmPass) {
      addToast({ type: 'error', title: 'Password Error', message: 'New passwords do not match.' });
      return;
    }

    setIsChangingPass(true);
    // Update password
    updateAdminProfile({ password: newPass });
    if (activeUser?.email) {
      await resetEmployeePassword(activeUser.email, newPass);
    }

    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setIsChangingPass(false);
    addToast({
      type: 'success',
      title: 'Password Updated',
      message: 'Your security credentials have been updated successfully.',
    });
  };

  const handleDirectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast({
          type: 'error',
          title: 'File Too Large',
          message: 'Please select an image file under 5MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateAdminProfile({ avatarUrl: dataUrl });
        addToast({
          type: 'success',
          title: 'Photo Uploaded',
          message: 'New profile photo saved successfully.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Staff Admin Profile & Security Credentials
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your staff identity, direct photo upload, phone number, department assignment, and passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col: Profile Card with Photo */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center text-center text-xs shadow-xs">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-100">
              <img
                src={activeUser?.avatarUrl}
                alt={activeUser?.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleDirectImageUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Upload photo directly"
            >
              <Upload className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-medium">Upload File</span>
            </button>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Upload Picture</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <button
              type="button"
              onClick={onOpenPhotoModal}
              className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" />
              <span>Gallery</span>
            </button>
          </div>

          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">
            {activeUser?.fullName}
          </h3>
          <p className="text-[11px] text-slate-500">{activeUser?.email}</p>

          <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>{(activeUser as any)?.role?.replace('_', ' ') || 'Staff Member'}</span>
          </div>

          <div className="w-full mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{activeUser?.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phone:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Security:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Staff
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Edit Info & Password Reset */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Form */}
          <form onSubmit={handleUpdateProfile} className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 text-xs shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              <span>Personal Information & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+44 020 7946 0199"
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Directorate / Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Position / Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Operational Specialist"
                className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Biography & Responsibilities</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Password Reset Form */}
          <form onSubmit={handlePasswordChange} className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Change Password
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Staff Admin passwords must be at least 8 characters long and updated periodically for security compliance.
            </p>

            <div>
              <label className="font-semibold block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!newPass || !confirmPass || isChangingPass}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white font-medium hover:bg-slate-800 dark:hover:bg-emerald-500 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                {isChangingPass ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
