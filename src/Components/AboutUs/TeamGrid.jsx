// src/components/AboutUs/TeamGrid.jsx
import { motion as Motion } from 'framer-motion';
import { Box, Typography, Avatar, Grid, Link, Stack, Tooltip } from '@mui/material';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import abhishekimg from '../../assets/images/abhishek.jpeg';
import lisaImg from '../../assets/images/lisa.jpeg';
import advaitImg from '../../assets/images/advait.jpeg';
import muskanImg from '../../assets/images/muskan.jpeg';
import krishImg from '../../assets/images/krish.jpeg';
import priyanshuImg from '../../assets/images/priyanshu.jpeg';
import suvidyaImg from '../../assets/images/suvidya.jpeg';





const team = [
  {
    name: 'Abhishek Kumar',
    role: 'Project Mentor',
    github: 'https://github.com/Abhishek65-tsl/DAMSBF',
    linkedin: 'https://www.linkedin.com/in/abhishek-kumar-a4586b190?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    img: abhishekimg,
    color: '#d6e0f0',
    bio: 'Guided us throughout with invaluable insights and support.',
  },
  {
    name: 'Lisa Das',
    role: 'Frontend & Documentation',
    github: 'https://github.com/lisadascse72',
    linkedin: 'https://linkedin.com/in/lisa-das-9aab0a244',
    img: lisaImg,
    color: '#e0e7ff',
    bio: 'Passionate about building clean UIs & writing clear documentation.',
  },
  {
    name: 'Advaita Vedanta',
    role: 'Frontend & Backend',
    github: 'https://github.com/Advaita151',
    linkedin: 'https://www.linkedin.com/in/atpack/',
    img: advaitImg,
    color: '#defde0',
    bio: 'Handles server-side logic and database integration.',
  },
  {
    name: 'Muskan Singh',
    role: 'UI/UX Designer',
    github: 'https://github.com/Muskan-singh2005',
    linkedin: 'https://www.linkedin.com/in/muskan-951331355',
    img: muskanImg,
    color: '#ffe3ec',
    bio: 'Designs user interfaces that are both aesthetic and intuitive.',
  },
  {
    name: 'Krish Kumar',
    role: 'Frontend & Backend',
    github: 'https://github.com/krishkumar001',
    linkedin: 'https://www.linkedin.com/in/krish-kumar-74b05b143/',
    img: krishImg,
    color: '#ffd6d6',
    bio: 'Ensures bug-free releases through rigorous testing.',
  },
  {
    name: 'Priyanshu Bhusan',
    role: 'AI Integration',
    github: 'https://github.com/vi-jigishu',
    linkedin: 'https://www.linkedin.com/in/priyanshu-bhusan-457188254?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    img: priyanshuImg,
    color: '#fff9db',
    bio: 'Brings intelligent solutions to life through AI integration.',
  },
  {
    name: 'Suvidya Tiwari',
    role: 'UI/UX Designer',
    github: 'https://github.com/suviivanillin',
    linkedin: 'https://www.linkedin.com/in/suvidya-tiwari-564621341?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    img: suvidyaImg,
    color: '#daf0f7',
    bio: 'Strives for seamless and joyful user experiences.',
  },
];

export default function TeamGrid() {
  return (
    <Box sx={{ textAlign: 'center', py: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#003366', fontWeight: 'bold' }}>
        Our Team
      </Typography>
      <Grid container spacing={2} justifyContent="center" wrap="nowrap" sx={{ overflowX: 'auto', paddingX: 2 }}>
        {team.map((member, index) => (
          <Grid item key={index} sx={{ flex: '0 0 auto', maxWidth: 230 }}>
            <Motion.div
              initial={{ opacity: 0, y: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  backgroundColor: member.color,
                  boxShadow: '0 6px 12px rgba(0, 51, 102, 0.1)',
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 20px rgba(0, 51, 102, 0.4)',
                  },
                }}
              >
                <Avatar
                  src={member.img}
                  alt={member.name}
                  sx={{ width: 80, height: 80, mb: 2, border: '3px solid #003366' }}
                />
                <Typography variant="h6" sx={{ color: '#003366' }}>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
                <Tooltip title={member.bio} arrow placement="top">
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, color: '#333', fontStyle: 'italic' }}
                  >
                    Hover to know more
                  </Typography>
                </Tooltip>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                  <Link href={member.github} target="_blank" sx={{ color: '#333' }}>
                    <FaGithub size={22} />
                  </Link>
                  <Link href={member.linkedin} target="_blank" sx={{ color: '#0e76a8' }}>
                    <FaLinkedin size={22} />
                  </Link>
                </Stack>
              </Box>
            </Motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
