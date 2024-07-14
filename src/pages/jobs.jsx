import React from 'react';
import { CssBaseline, Grid, Paper, Typography, createTheme, ThemeProvider } from "@mui/material";
import { Navigation } from "../components/LandingPage/navigation";
import { Header } from "../components/LandingPage/header";

const caseStudies = [
  {
    title: "Data Analyst",
    largeImage: "img/portfolio/01.large.jpg",
    smallImage: "img/portfolio/01.small.jpg"
  },
  {
    title: "AI Engineer",
    largeImage: "img/portfolio/02.large.jpeg",
    smallImage: "img/portfolio/02.small.jpeg"
  },
  {
    title: "Senior AI Engineer",
    largeImage: "img/portfolio/03-large.jpg",
    smallImage: "img/portfolio/03-small.jpg"
  },
  {
    title: "Social Media Analyst",
    largeImage: "img/portfolio/04.large.jpg",
    smallImage: "img/portfolio/04.small.jpg"
  }
];

const theme = createTheme();

const CaseStudies = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="website-page">
        <Navigation />
        <br></br>
        <br></br>
        <br></br>
        <Grid container spacing={4} style={{ padding: 24 }}>
          {caseStudies.map((caseStudy, index) => (
            <Grid item xs={12} key={index}>
              <Paper style={{ padding: 16 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <img src={caseStudy.largeImage} alt={caseStudy.title} style={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>{caseStudy.title}</Typography>
                    <Typography variant="body1">
                      This is a brief description of the {caseStudy.title.toLowerCase()}. It highlights the key aspects and outcomes of the project, providing insights into how our solutions helped achieve the desired results.
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>

      </div>
      <CssBaseline />

    </ThemeProvider>
  );
};

export default CaseStudies;
