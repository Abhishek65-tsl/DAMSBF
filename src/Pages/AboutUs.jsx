import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TeamGrid from '../Components/AboutUs/TeamGrid';
import FooterContact from '../Components/AboutUs/FooterContact';
import ParticleBackground from '../Components/AboutUs/ParticleBackground';
import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* ✨ Background Particles */}
      <ParticleBackground />

      {/* ✨ Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, px: 4, py: 6 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">

          {/* Tech Stack Card */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, filter: 'blur(6px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0)', y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: '#fce4ec',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'left',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Tech Stack 🔨
                </Typography>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
                  <li>⚛️ React.js</li>
                  <li>🎨 MUI</li>
                  <li>🧠 OpenAI API</li>
                  <li>🗄️ MongoDB</li>
                </ul>
              </Box>
            </motion.div>
          </Grid>

          {/* About Us Center Text */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#005BAC', mb: 2, textAlign: 'center' }}
            >
              About Us
            </Typography>
            <Typography
              variant="body1"
              sx={{ maxWidth: '800px', mx: 'auto', color: '#444', textAlign: 'center' }}
            >
              We are a passionate team of developers who created DAMSBF — a Digital Asset Management
              System designed for Tata Steel. Our platform helps monitor anomalies and resolve issues
              efficiently within the steel plant. With AI integration, a user-friendly UI/UX, insightful
              data visualizations, and an interactive chatbot, DAMSBF brings a smart, streamlined
              approach to industrial problem-solving.
            </Typography>
          </Grid>

          {/* Timeline Card */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, filter: 'blur(6px)', y: -20 }}
              animate={{ opacity: 1, filter: 'blur(0)', y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: '#e3f2fd',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'left',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  📅 Timeline
                </Typography>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
                  <li><strong>13 May 2025:</strong> Team Built</li>
                  <li><strong>27 May 2025:</strong> Requirements discussed</li>
                  <li><strong>1 June 2025:</strong> UI/UX & Frontend design</li>
                  <li><strong>15 June 2025:</strong> Backend & AI integration</li>
                  <li><strong>1 July 2025:</strong> Documentation & Testing</li>
                  <li><strong>15 July 2025:</strong> Successfully Deployed</li>
                </ul>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Grid container spacing={0} alignItems="flex-start" sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <TeamGrid />
          </Grid>
        </Grid>

        {/* Footer */}
        <Box mt={3}>
          <FooterContact />
        </Box>
      </Box>
    </Box>
  );
}
