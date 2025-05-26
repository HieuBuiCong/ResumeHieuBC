{attachments.map((file) => (
  <Box
    key={file.attachment_id}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 1,
      gap: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* If it's an image, show preview; else show a link */}
      {file.file_type && file.file_type.startsWith('image/') ? (
        <a href={file.public_url} target="_blank" rel="noopener noreferrer">
          <img
            src={file.public_url}
            alt={file.file_name}
            style={{
              width: 48,
              height: 48,
              objectFit: 'cover',
              borderRadius: 4,
              border: '1px solid #eee',
              marginRight: 8,
            }}
          />
        </a>
      ) : (
        <a href={file.public_url} target="_blank" rel="noopener noreferrer">
          {file.file_name}
        </a>
      )}
      {/* File name (for images, show below/next to preview) */}
      <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {file.file_name}
      </Typography>
    </Box>
    <IconButton color="error" onClick={() => handleDelete(file.attachment_id)}>
      <DeleteIcon />
    </IconButton>
  </Box>
))}
