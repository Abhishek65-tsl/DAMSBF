import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Slide,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import bannerImage from "../assets/tata-steel.png";

const cardData = [
  { name: "Blast Furnace", subPages: ["BF1", "BF2"] },
  { name: "Caster", subPages: ["Caster 1", "Caster 2", "Caster 3"] },
  { name: "Steel Melting Shop", subPages: ["BOF 1", "BOF 2", "BOF 3"] },
];

function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [ripple, setRipple] = useState({});
  const cardRefs = useRef({});
  const navigate = useNavigate();

  const handleMouseEnter = (cardName) => setHoveredCard(cardName);
  const handleMouseLeave = () => setHoveredCard(null);

  const handleSubpageClick = (sub, cardName, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ [sub]: { x, y, show: true } });
    setTimeout(() => setRipple({}), 400);

    const section = cardName.toLowerCase().replace(/\s+/g, "-");
    const unit = sub.toLowerCase();
    navigate(`/${section}/${unit}`);
  };

  const baseShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.18)";
  const activeShadow =
    "0 16px 40px 0 rgba(253,160,133,0.35), 0 2px 8px 0 #f6d36566, 0 0 32px 0 #fda08555";

  const borderGradient = {
    "Blast Furnace": "linear-gradient(120deg, #ff9a9e, #fad0c4)",
    Caster: "linear-gradient(120deg, #a1c4fd, #c2e9fb)",
    "Steel Melting Shop": "linear-gradient(120deg, #d4fc79, #96e6a1)",
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f7f9fc" }}>
      {/* Banner */}
      <Box
        sx={{
          width: "100%",
          height: { xs: 300, md: 450 },
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            px: 2,
            py: 1,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(8px)",
            color: "#ffffff",
            textShadow: "0 2px 4px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.1)",
            letterSpacing: 1.5,
          }}
        >
          TATA STEEL KALINGANAGAR
        </Typography>
      </Box>

      {/* Welcome */}
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: "center" }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            maxWidth: 900,
            mx: "auto",
            background: "#ffffffdd",
            backdropFilter: "blur(6px)",
            borderRadius: 3,
            boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Welcome to DAMSBF TSK
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hello <b>Abhishek Kumar</b>, welcome to Digital Asset Monitoring System (DAMSBF) TSK.
            Here you can check the condition of all major plants and areas of TSK.
          </Typography>
        </Paper>
      </Box>

      {/* Feature Cards */}
      <Box sx={{ px: 4, mb: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "#ffffffaa",
            backdropFilter: "blur(6px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            overflow: "visible",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mb: 3,
              textAlign: "center",
              fontSize: "1.4rem",
              color: "#1a237e",
              textShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            Features
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "center",
              overflow: "visible",
            }}
          >
            {[
              {
                title: "Application Utilization",
                desc: "Check who is using the DAMSBF Application on the regular basis",
                borderColor: "#a5d8ff",
              },
              {
                title: "Cost Saved",
                desc: "This page is used to calculate the total savings via this application.",
                borderColor: "#c3fbd8",
              },
              {
                title: "Data DM",
                desc: "Daily Monitoring of data at each level from IBA to Application UI.",
                borderColor: "#ffdac1",
              },
            ].map((item) => (
              <Paper
                key={item.title}
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  minWidth: 280,
                  maxWidth: 300,
                  border: `2.5px solid ${item.borderColor}`,
                  backgroundColor: "#fff",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: `0 6px 24px ${item.borderColor}88`,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ color: "#1a237e", mb: 1 }}
                  gutterBottom
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Plant Home Section */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          pb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            color: "#1a237e",
            mb: 4,
            textShadow: "0 2px 8px #fff8",
          }}
        >
          Plant Home
        </Typography>

        <Grid container spacing={8} justifyContent="center" sx={{ maxWidth: 1200 }}>
          {cardData.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.name}>
              <Box ref={(el) => (cardRefs.current[card.name] = el)} sx={{ perspective: 1200 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: 5,
                    position: "relative",
                    overflow: "visible",
                    minHeight: 210,
                    background: "rgba(255,255,255,0.25)",
                    backdropFilter: "blur(8px)",
                    border: "2.5px solid",
                    borderImage: `${borderGradient[card.name]} 1`,
                    transition: "transform 0.25s cubic-bezier(.4,2,.3,1), box-shadow 0.3s, border-image 1s",
                    transform: hoveredCard === card.name ? "scale(1.045) translateY(-10px)" : "scale(1)",
                    ...(hoveredCard === card.name
                      ? { boxShadow: activeShadow }
                      : { boxShadow: baseShadow }),
                    "&:hover": {
                      boxShadow:
                        "0 24px 60px 0 rgba(253,160,133,0.40), 0 2px 8px 0 #f6d36588, 0 0 48px 0 #fda08577",
                    },
                  }}
                  onMouseEnter={() => handleMouseEnter(card.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Typography variant="h5" fontWeight="bold" color="#1a237e" gutterBottom>
                    {card.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Click for more details
                  </Typography>

                  <Slide
                    direction="down"
                    in={hoveredCard === card.name}
                    mountOnEnter
                    unmountOnExit
                    timeout={350}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        mt: 2,
                        minWidth: 200,
                        background: "rgba(255,255,255,0.85)",
                        borderRadius: 4,
                        boxShadow: "0 8px 32px 0 rgba(253,160,133,0.18)",
                        border: "2px solid #fda085",
                        zIndex: 100,
                        py: 1,
                        px: 0.5,
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <Box
                        sx={{
                          height: 4,
                          width: "100%",
                          background: "linear-gradient(90deg, #fda085 0%, #f6d365 100%)",
                          borderRadius: 2,
                          mb: 1,
                        }}
                      />
                      <List>
                        {card.subPages.map((sub, idx) => (
                          <Slide
                            key={sub}
                            direction="right"
                            in={hoveredCard === card.name}
                            style={{ transitionDelay: `${idx * 80 + 100}ms` }}
                            mountOnEnter
                            unmountOnExit
                          >
                            <ListItem
                              button
                              onClick={(e) => handleSubpageClick(sub, card.name, e)}
                              sx={{
                                borderRadius: 2,
                                my: 0.5,
                                px: 2,
                                "&:hover": {
                                  background: "linear-gradient(90deg, #fda085 0%, #f6d365 100%)",
                                  color: "#fff",
                                  boxShadow: "0 2px 8px #fda08533",
                                },
                              }}
                            >
                              <ChevronRightIcon sx={{ color: "#fda085", mr: 1 }} />
                              <ListItemText primary={sub} />
                              {ripple[sub]?.show && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    left: ripple[sub].x - 20,
                                    top: ripple[sub].y - 20,
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: "rgba(253,160,133,0.25)",
                                    pointerEvents: "none",
                                    zIndex: 10,
                                  }}
                                />
                              )}
                            </ListItem>
                          </Slide>
                        ))}
                      </List>
                    </Box>
                  </Slide>
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;