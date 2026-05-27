import { Alert, Slide, Snackbar } from '@mui/material';

function SlideLeft(props) {
  return <Slide {...props} direction="left" />;
}

export default function ToastCenter({ toasts, onClose }) {
  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={toast.duration ?? 2800}
          onClose={() => onClose(toast.id)}
          TransitionComponent={SlideLeft}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: `${index * 68}px` }}
        >
          <Alert
            onClose={() => onClose(toast.id)}
            severity={toast.severity || 'info'}
            variant="filled"
            sx={{ minWidth: 280, boxShadow: '0 12px 24px rgba(2,6,23,0.24)' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
