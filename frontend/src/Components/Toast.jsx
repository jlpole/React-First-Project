import { Toast } from 'primereact/toast';
import { forwardRef } from 'react';

const AppToast = forwardRef((onSuccess, ref) => {
  return <Toast ref={ref} position="top-right" />;
});

export default AppToast;
