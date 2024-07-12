import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Sidenav from "../components/NavBars/Sidenav";
import JobCard from "../components/Jobs/JobCard";
import AmplitudeEvent from "../components/Amplitude/AmplitudeEvent";
import { Navigate, useNavigate } from "react-router-dom";
import { getCurrentUser, get, post } from "../components/Helper";
import { createUseStyles } from "react-jss";
import bannerImage from "../assets/jobBanner.jpg";
import jobIllustration from "../assets/jobIllustration.png";
import { CssBaseline, Grid, Paper, Tab, Tabs, Typography, createTheme } from "@mui/material";
import { useDeferredValue } from "react";
import SearchComponent, {
  searchInList,
} from "../components/commonComponents/SearchComponent";
import FilterComponent, {
  convertToFilter,
  filterData,
  getObjValueList,
} from "../components/commonComponents/FilterComponent";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "@mui/lab";
import TabContext from "@mui/lab/TabContext";
import axios from "axios";
import SnackbarComponent from "../components/Alerts/SnackbarComponent";

const muiTheme = createTheme();

const useStyles = createUseStyles(() => ({
  bannerContainer: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
  },
  bannerImage: {
    objectFit: "cover",
    width: "100%",
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fcfeff",
  },
  search: {
    position: "absolute",
    bottom: 0,
    transform: "translateY(50%)",
    width: "100%",
    // [muiTheme.breakpoints.down("lg")]: {
    //   width: "70%",
    // },
  },
}));

function a11yProps(index) {
  return {
    id: `jobs-tab-${index}`,
    "aria-controls": `jobs-tabpanel-${index}`,
  };
}

const filterLabels = {
  job_title: "Job Title",
  work_mode: "Work Mode",
  core_skills: "Skills",
};

const baseURL = "https://api.joinuplyft.com";

export default function Jobs() {
  const [allJobs, setAllJobs] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState(null);
  const currentUser = getCurrentUser();
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query?.toLowerCase());
  const [filters, setFilters] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState("success");
  const navigate=useNavigate()

  AmplitudeEvent("/home-loaded");

  const getJobs = () => {
    get("/getAllJobs")
      .then((data) => {
        setAllJobs(data);
        setFilteredJobs(data);
        const { job_title, work_mode, core_skills } = getObjValueList(data);
        setFilters({
          job_title: job_title?.length > 0 ? convertToFilter(job_title) : [],
          work_mode: work_mode?.length > 0 ? convertToFilter(work_mode) : [],
          core_skills:
            core_skills?.length > 0
              ? convertToFilter(core_skills.join(",").split(","))
              : [],
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getJobs();
    if (currentUser?.uid) {
      post("/candidateAppliedJobs", {
        student_id: currentUser.uid,
      })
        .then((data) => {
          setAppliedJobs(data);
          let jobIds = data.map((d) => d.job_id);
          setAppliedJobIds(jobIds);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  useEffect(() => {
    if (allJobs?.length > 0) {
      const filtered = allJobs.filter((job) => {
        const valuesToSearch = [
          JSON.stringify(job?.job_description),
          job?.job_title,
          job?.work_mode,
          job?.core_skills,
          job?.requirement,
          job?.company_name,
          job?.experience,
          job?.job_type,
          job?.work_mode,
        ];
        return searchInList(valuesToSearch, deferredQuery);
      });
      setFilteredJobs(filtered);
    }
  }, [deferredQuery]);

  const filterJobs = (filterItems) => {
    const filtered = filterData(filterItems, allJobs);
    setFilteredJobs([...filtered]);
  };

  const resetFilter = (key) => {
    const { [key]: val } = getObjValueList(allJobs);
    let valList = key === "core_skills" ? val.join(",").split(",") : val;
    const filterItems = { ...filters, [key]: convertToFilter(valList) };
    setFilters({ ...filterItems });
    filterJobs(filterItems);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeTabIndex = (index) => {
    setTabValue(index);
  };

  const applyJob = (id) => {
    if (currentUser?.uid) {
      const req = {
        job_id: id,
        student_id: currentUser.uid,
      };
      axios
        .post(baseURL + "/applyJob", req)
        .then(() => {
          setSnackbarMsg("Applied for job successfully.");
          setSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => {
            getJobs();
          }, 3000);
        })
        .catch((error) => {
          setSnackbarMsg("Job application failed");
          setSeverity("error");
          setSnackbarOpen(true);
        });
    } else {
      navigate(`/signin`);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMsg("");
    setSeverity("success");
  };

  return (
    <Box sx={{ display: "flex", background: "#f3f5f7", pb: 6 }}>
      {currentUser?.uid && <Sidenav />}
      <CssBaseline />

      {snackbarOpen && (
        <SnackbarComponent
          snackbarOpen={snackbarOpen}
          snackbarMsg={snackbarMsg}
          severity={severity}
          handleSnackbarClose={handleSnackbarClose}
        />
      )}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Paper className={classes.bannerContainer} sx={{ height: "40vh" }}>
          <img
            src={bannerImage}
            className={classes.bannerImage}
            alt="fireSpot"
          />

          <Box className={classes.overlayContainer}>
            <Typography
              variant="h3"
              fontWeight={600}
              fontSize={"2rem"}
              sx={{ ml: 4 }}
            >
              Find Your Dream Job
            </Typography>
            <img src={jobIllustration} alt="fireSpot" />
          </Box>
          <Box px={14} className={classes.search}>
            <SearchComponent query={query} setQuery={setQuery}>
              {Object.keys(filters)?.length > 0 && (
                <FilterComponent
                  filters={{ ...filters }}
                  filterList={filterJobs}
                  filterLabels={filterLabels}
                  resetFilter={resetFilter}
                />
              )}
            </SearchComponent>
          </Box>
        </Paper>
        <Box sx={{ px: 12, py: 6 }}>
          <TabContext value={tabValue}>
          {currentUser?.uid &&<Tabs value={tabValue} onChange={handleChangeTab} sx={{ pl: 4 }}>
             <Tab sx={{ fontWeight: 600 }} label="Jobs" {...a11yProps(0)} />
              <Tab
                sx={{ fontWeight: 600 }}
                label="Applied Jobs"
                {...a11yProps(1)}
              />
            </Tabs>}
            <SwipeableViews
              index={tabValue}
              onChangeIndex={handleChangeTabIndex}
            >
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={2}>
                  {filteredJobs?.length > 0 ? (
                    filteredJobs.map((job) => (
                      <JobCard
                        job={job}
                        applyJob={applyJob}
                        applied={
                          appliedJobIds?.length > 0 &&
                          appliedJobIds.includes(job.job_id)
                        }
                      />
                    ))
                  ) : (
                    <Typography>No Results found!</Typography>
                  )}
                </Grid>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={2}>
                  {appliedJobs?.length > 0 ? (
                    appliedJobs.map((job) => (
                      <JobCard job={job} applied={true} />
                    ))
                  ) : (
                    <Typography>No Results found!</Typography>
                  )}
                </Grid>
              </TabPanel>
            </SwipeableViews>
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
}