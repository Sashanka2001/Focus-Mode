import React, { useEffect, useState } from 'react';
import auth from '../lib/auth';

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(auth.getState().isOwner);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = auth.subscribe((v) => setIsOwner(Boolean(v)));
    return unsub;
  }, []);

  const handleLogin = () => {
    setError(null);
    if (auth.login(password)) {
      setPassword('');
      setOpen(false);
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div className="flex items-center gap-3">
      {isOwner ? (
        <>
          <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-md bg-slate-200">Owner</button>
          <button onClick={handleLogout} className="px-3 py-2 rounded-md bg-red-500 text-white">Logout</button>
        </>
      ) : (
        <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-md bg-slate-200">Login</button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg p-6 z-60 w-full max-w-sm">
            <h3 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Owner Login</h3>
            <p className="text-xs text-slate-500 mb-3">Enter owner password to view your personal data.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 mb-3"
            />
            {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md">Cancel</button>
              <button onClick={handleLogin} className="px-3 py-2 rounded-md bg-brand text-white">Sign In</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
