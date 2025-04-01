import React, { useState } from 'react';
import { Button } from '@mui/material';
import AttachmentModal from './components/AttachmentModal';

const App = () => {
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setAttachmentModalOpen(true)}>Manage Attachments</Button>

      <AttachmentModal
        open={attachmentModalOpen}
        onClose={() => setAttachmentModalOpen(false)}
        cid_id={123} // or cid_task_id={456}
      />
    </>
  );
};

export default App;
