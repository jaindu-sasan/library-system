import { Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

export const useNotification = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success'|'error'>('success');

  const showNotification = (msg: string, sev: 'success'|'error') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const Notification = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { showNotification, Notification };
};
