import { Box, Typography } from '@mui/material'

const Header = ({ isEmpty }: { isEmpty: boolean }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: '20px' }}>
      {!isEmpty ? (
        <Typography variant="h1" component="h1">
          Your tasks
        </Typography>
      ) : (
        <Box sx={{ height: '42px' }} />
      )}
    </Box>
  )
}

export default Header
