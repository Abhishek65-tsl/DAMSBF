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

const cardData = [
  {
    name: "Blast Furnace",
    subPages: ["BF1", "BF2"],
  },
  {
    name: "Caster",
    subPages: ["Caster 1", "Caster 2", "Caster 3"],
  },
  {
    name: "Steel Melting Shop",
    subPages: ["BOF 1", "BOF 2", "BOF 3"],
  },
];

// Optional Sparkle component (currently unused)
const Sparkle = ({ x, y, keyId }) => (
  <Box
    key={keyId}
    className="sparkle-burst"
    sx={{
      position: "absolute",
      left: x,
      top: y,
      width: 10,
      height: 10,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, #fffbe7 0%, #fda085 80%, transparent 100%)",
      opacity: 0.8,
      pointerEvents: "none",
      zIndex: 200,
    }}
  />
);

function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [ripple, setRipple] = useState({});
  const cardRefs = useRef({});
  const navigate = useNavigate();

  const handleMouseEnter = (cardName) => {
    setHoveredCard(cardName);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

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

  // const handleCardClick = (card) => {
  //   // optional click handling
  // };

  const baseShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.18)";
  const activeShadow =
    "0 16px 40px 0 rgba(253,160,133,0.35), 0 2px 8px 0 #f6d36566, 0 0 32px 0 #fda08555";

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
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
          mt: 2,
          textShadow: "0 2px 8px #fff8",
        }}
      >
        Plant Home
      </Typography>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ width: "100%", maxWidth: 1200 }}
      >
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
                  borderImage:
                    hoveredCard === card.name
                      ? "linear-gradient(270deg, #f6d365, #fda085, #f6d365, #fda085) 1"
                      : "linear-gradient(120deg, #f6d365 0%, #fda085 100%) 1",
                  transition:
                    "transform 0.25s cubic-bezier(.4,2,.3,1), box-shadow 0.3s, border-image 1s",
                  boxSizing: "border-box",
                  transform:
                    hoveredCard === card.name ? "scale(1.045) translateY(-10px)" : "scale(1)",
                  ...(hoveredCard === card.name
                    ? { boxShadow: activeShadow }
                    : { boxShadow: baseShadow }),
                  "&:hover": {
                    boxShadow:
                      "0 24px 60px 0 rgba(253,160,133,0.40), 0 2px 8px 0 #f6d36588, 0 0 48px 0 #fda08577",
                  },
                  mt: { xs: 2, sm: 0 },
                }}
                // onClick={() => handleCardClick(card)}
                onMouseEnter={() => handleMouseEnter(card.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      color: "#1a237e",
                      textShadow: "0 1px 8px #fff6",
                    }}
                  >
                    {card.name}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#5c5c5c",
                    mb: 2,
                    fontWeight: 500,
                    letterSpacing: 0.2,
                  }}
                >
                  Click for more details
                </Typography>

                {/* Dropdown with Subpages */}
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
                      transition: "all 0.2s",
                      overflow: "hidden",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <Box
                      sx={{
                        height: 4,
                        width: "100%",
                        background:
                          "linear-gradient(90deg, #fda085 0%, #f6d365 100%)",
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
                            onClick={(e) =>
                              handleSubpageClick(sub, card.name, e)
                            }
                            sx={{
                              borderRadius: 2,
                              my: 0.5,
                              px: 2,
                              transition: "background 0.18s, color 0.18s",
                              display: "flex",
                              alignItems: "center",
                              fontWeight: 600,
                              position: "relative",
                              overflow: "hidden",
                              "&:hover": {
                                background:
                                  "linear-gradient(90deg, #fda085 0%, #f6d365 100%)",
                                color: "#fff",
                                boxShadow: "0 2px 8px #fda08533",
                              },
                            }}
                          >
                            <ChevronRightIcon
                              sx={{ color: "#fda085", mr: 1, fontSize: 22 }}
                            />
                            <ListItemText
                              primary={sub}
                              sx={{
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: 18,
                              }}
                            />
                            {ripple[sub]?.show && (
                              <Box
                                className="ripple-anim"
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
  );
}

export default Home;
