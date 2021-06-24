import axios from "../axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAlert } from "../redux/alert/alertActions";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CustomTable from "../components/CustomTable";
import ButtonWithLoader from "../components/ButtonWithLoader";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Filter from "../components/Filter";
import { v4 as uuidv4 } from "uuid";
import XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  container: {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: 16,
    margin: "20px auto",
  },
}));

const Details = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [filteredData, setFilteredData] = useState([]);
  const [details, setDetails] = useState(null);
  const [filters, setFilters] = useState([]);
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [previewLoader, setPreviewLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const { data } = await axios({
        method: "GET",
        url: "/details",
      });

      if (data.status !== "success") {
        dispatch(setAlert(data.message.split(",")[0], "error"));
        return history.push("/");
      }

      setDetails(data.data.sheetData);
      setFilteredData(data.data.sheetData);
      setPageLoader(false);
    };

    fetchDetails();
  }, []);

  const handleDownload = async () => {
    setLoader(true);
    let downloadData = details;
    if (checked && filters.length) downloadData = filteredData;

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(downloadData);
    XLSX.utils.book_append_sheet(wb, ws, "Details");
    XLSX.writeFile(wb, "Details.xlsx");
    setLoader(false);
  };
  const handlePreview = async () => {
    setPreviewLoader(true);
    const { data } = await axios({
      method: "POST",
      url: `/details/filter`,
      data: {
        filterData: filters,
      },
    });

    if (data.status !== "success") {
      dispatch(setAlert(data.message.split(",")[0], "error"));
      return history.push("/");
    }
    setFilteredData(data.data.filteredData);
    setPreviewLoader(false);
  };

  const handleAdd = () => {
    setFilters([
      ...filters,
      { id: uuidv4(), index: 22, operator: ">=", value: "60" },
    ]);
  };

  return (
    <Grid container justify="center" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" align="center" color="primary">
          Placement Details
        </Typography>
      </Grid>

      {pageLoader ? (
        <CircularProgress color="primary" style={{ margin: "20px auto" }} />
      ) : (
        <>
          <CustomTable details={details} />
          <Grid item container xs={12} justify="center" spacing={2}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ margin: "10px auto" }}
                    checked={checked}
                    color="primary"
                    onChange={() => setChecked(!checked)}
                    name="filter"
                  />
                }
                label="Apply Filter"
              />
            </Grid>
            {checked && (
              <Grid item container justify="center">
                {filters && filters.length ? (
                  filters.map((filter) => (
                    <Filter
                      key={filter.id}
                      filter={filter}
                      filters={filters}
                      setFilters={setFilters}
                    />
                  ))
                ) : (
                  <Grid item margin={{ margin: "20px auto" }} xs={12}>
                    <Typography gutterBottom variant="h6" align="center">
                      No Filters applied
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <Tooltip title="Add Question" aria-label="add">
                    <Fab
                      color="primary"
                      onClick={handleAdd}
                      className={classes.fab}>
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                </Grid>
              </Grid>
            )}
            <Grid item>
              <ButtonWithLoader
                variant="contained"
                color="primary"
                onClick={() => {
                  if (checked && filters.length) handlePreview();
                }}
                content="Preview"
                loader={previewLoader}
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: 20 }}>
              <Typography variant="h6" align="center">
                Preview:
              </Typography>
            </Grid>
            {checked ? (
              <CustomTable details={filteredData} />
            ) : (
              <CustomTable details={details} />
            )}

            <Grid item>
              <ButtonWithLoader
                variant="contained"
                color="primary"
                onClick={handleDownload}
                content="Download (.xlsx)"
                loader={loader}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Details;
