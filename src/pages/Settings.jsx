import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, saveSettings } from '../store/slices/settingsSlice';
import { Settings as SettingsIcon, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const dispatch = useDispatch();
  const { data: settings, loading } = useSelector((s) => s.settings);
  const [form, setForm] = useState({});

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    setForm(settings || {});
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(saveSettings(form));
    if (saveSettings.fulfilled.match(result)) {
      toast.success('Settings saved');
    } else {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-5 h-5 text-emerald-400" />
        <h1 className="text-xl font-bold text-slate-100">Settings</h1>
      </div>

      {loading && !form.apiUrl ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">API URL</label>
            <input
              className="input-field"
              value={form.apiUrl || ''}
              onChange={(e) => setForm((f) => ({ ...f, apiUrl: e.target.value }))}
              placeholder="http://localhost:8000/api"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Name</label>
            <input
              className="input-field"
              value={form.companyName || ''}
              onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
              placeholder="DispatchWares Co."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Timezone</label>
            <input
              className="input-field"
              value={form.timezone || ''}
              onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
              placeholder="America/New_York"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
}
