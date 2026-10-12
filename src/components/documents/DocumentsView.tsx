import React, { useState } from 'react';
import { FolderArchive, Upload, Download, Trash2, FileText, CheckCircle2, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { DocumentResource } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, uploadDocument, deleteDocument, addToast } = useAdmin();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<DocumentResource['category']>('Biosafety Protocols');
  const [fileSizeKb, setFileSizeKb] = useState(2400);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName.trim()) return;

    uploadDocument({
      title,
      fileName,
      category,
      fileSizeKb: Number(fileSizeKb) || 1200,
      fileUrl: '#',
    });

    setShowUploadModal(false);
    setTitle('');
    setFileName('');
  };

  const handleDownload = (doc: DocumentResource) => {
    addToast({
      type: 'info',
      title: 'Downloading Document',
      message: `Fetching ${doc.fileName} from secure BRP cloud storage...`,
    });
  };

  const columns: ColumnDef<DocumentResource>[] = [
    {
      key: 'title',
      label: 'Document Title & File',
      render: (d) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{d.title}</p>
            <p className="font-mono text-[11px] text-slate-500">{d.fileName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Classification',
      render: (d) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          {d.category}
        </span>
      ),
    },
    {
      key: 'fileSizeKb',
      label: 'File Size',
      render: (d) => (
        <span className="font-mono tabular-nums text-xs text-slate-500">
          {(d.fileSizeKb / 1024).toFixed(1)} MB
        </span>
      ),
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      render: (d) => (
        <div className="text-xs">
          <p className="text-slate-800 dark:text-slate-200">{d.uploadedBy}</p>
          <p className="font-mono text-[10px] text-slate-400">{new Date(d.uploadedAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (d) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleDownload(d)}
            className="p-1.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded cursor-pointer"
            title="Download Document"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteDocument(d.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
            title="Delete Document"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Document Repository & Compliance Vault
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized archive for biosafety SOPs, research preprints, investor decks, and lease agreements.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <DataTable
        title="Institutional Documents"
        data={documents}
        columns={columns}
        exportFilename="brp_documents"
      />

      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Upload Institutional Resource</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-5 space-y-3">
              <div>
                <label className="font-semibold block mb-1">Document Display Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSL-3 Chemical Hygiene & Waste Plan 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">File Name (with extension)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BRP_BSL3_Hygiene_Plan_2026.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Category Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="Biosafety Protocols">Biosafety Protocols</option>
                  <option value="Research Papers">Research Papers</option>
                  <option value="Brochures">Brochures</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 cursor-pointer"
                >
                  Save to Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
