import { Box, Typography } from '@mui/material'
import SelfieImg from '../assets/selfie.svg?react'

const EmptyState = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: '40px',
        mx: 'auto',
        width: 'fit-content',
      }}
    >
      <SelfieImg />
      <Typography
        sx={{
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: '24px',
          ml: '-100px',
          '& span': { fontStyle: 'normal' },
        }}
      >
        Empty as my motivation on Monday <span>😅</span>
        <br /> Let’s start adding stuff!
      </Typography>
    </Box>
  )
}

export default EmptyState
