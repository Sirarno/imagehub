import React, { useContext, useState } from "react";
import UserDataContext from "../context/UserDataContext";
import axios from "axios";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  container: {
    width: 300,
    marginRight: "auto",
    marginLeft: "auto",
  },
  paper: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));

export function Upload() {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(false);

  const userData = useContext(UserDataContext);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = function (e) {
    setLoading(true);

    const form = new FormData();
    form.append("Title", userData.name);
    form.append("Description", description);
    form.append("UploaderId", userData.userID);
    form.append("File", selectedFile);

    axios({
      method: "post",
      url: "https://imagehub.azurewebsites.net/api/v1.0/Image",
      data: form,
    })
      .then((data) => {
        setOpen(true);
        setResult(true);
        setLoading(false);
      })
      .catch((error) => {
        setOpen(true);
        setLoading(false);
      });

    e.preventDefault();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleCloseLoading = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setLoading(false);
  };

  return (
    <div className="main--content">
      <Paper elevation={3} variant="outlined">
        <div className={classes.container}>
          <form onSubmit={handleSubmit}>
            <h1 className={classes.container}> Upload an image</h1>

            <p className={classes.center}>
              <Input
                className={classes.container}
                placeholder="Description"
                inputProps={{ "aria-label": "description" }}
                onChange={(e) => setDescription(e.target.value)}
              />
            </p>

            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <p></p>
            <Button
              className={classes.container}
              type="submit"
              variant="outlined"
              color="primary"
            >
              Upload
            </Button>
            <p></p>
          </form>
        </div>
      </Paper>

      <Backdrop
        className={classes.backdrop}
        open={loading}
        onClick={handleCloseLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={result ? "success" : "error"}>
          {result ? "Successfully uploaded 🎉" : "Upload failed 😭"}
        </Alert>
      </Snackbar>
    </div>
  );
}
