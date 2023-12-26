import "./App.css";

import { Box, Input, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import logo from "./logo.svg";

const incrementHelper = (date, recurrence) => {
  const parsedDate = new Date(date);
  switch (recurrence) {
    case "Yearly":
      return parsedDate.setDate(parsedDate.getDate() + 365);
    case "Monthly":
      return parsedDate.setDate(parsedDate.getDate() + 30);
    case "Weekly":
      return parsedDate.setDate(parsedDate.getDate() + 7);
    default:
      return 0;
  }
};

const cookieHelper = () => {
  const store = (newData) => {
    localStorage.setItem("data", JSON.stringify(newData));
  };

  const load = () => {
    return JSON.parse(localStorage.getItem("data"));
  };

  const resetTo = (newData) => {
    localStorage.setItem("data", JSON.stringify(newData));
  };

  return { store, load, resetTo };
};

const generateRows = (localData) => {
  const handleDateCalculation = () => {};

  return localData.map(({ thingToTrack, date, recurrence, lastCycle }, idx) => {
    const calculatedNextCycle = new Date(
      incrementHelper(lastCycle, recurrence)
    );

    console.log(lastCycle, recurrence);
    console.log(calculatedNextCycle);

    const diff = Math.round(
      Math.abs(Date.now() - calculatedNextCycle) / (1000 * 3600 * 24)
    );

    return {
      id: idx,
      thingToTrack,
      date,
      recurrence,
      daysLeft: diff,
      lastCycle,
      nextCycle: calculatedNextCycle,
    };
  });
};

function App() {
  const [dataFromCookie, setDataFromCookie] = useState([]);
  const { store, load, resetTo } = cookieHelper();

  useEffect(() => {
    setDataFromCookie(load());
  }, []);

  const [thingToTrack, setThingToTrack] = useState("");
  const [dateToTrack, setDateToTrack] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [anchor, setAnchor] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const cols = [
    { field: "thingToTrack", headerName: "Thing to track", width: 250 },
    { field: "date", headerName: "Tracking Start Date", width: 125 },
    { field: "recurrence", headerName: "Recurs every...", width: 125 },
    { field: "daysLeft", headerName: "Days to next cycle", width: 125 },
    { field: "nextCycle", headerName: "Next Cycle", width: 250 },
  ];

  const rows = generateRows(dataFromCookie);

  const reset = () => {
    setThingToTrack("");
    setDateToTrack("");
    setRecurrence("");
  };

  const handleStore = (newData) => {
    const temp = [newData, ...dataFromCookie];
    setDataFromCookie(temp);
    store(temp);
  };

  const resetData = () => {
    const TO_REMOVE_RESET = [
      {
        thingToTrack: "Credit card 5550",
        date: "2023-01-21",
        lastCycle: "2023-12-21",
        recurrence: "Weekly",
      },
      {
        thingToTrack: "item2",
        date: "2023-01-22",
        lastCycle: "2023-12-22",
        recurrence: "Monthly",
      },
    ];
    resetTo(TO_REMOVE_RESET);
    window.location.reload();
  };

  const handleAnchor = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
    setPopupOpen(!popupOpen);
  };

  return (
    <div className="App">
      <div style={{ position: "absolute", right: 40 }}>
        <Button onClick={handleAnchor}>Reset Data</Button>
        <BasePopup
          id={"simple-popper"}
          open={popupOpen}
          anchor={anchor}
          placement="bottom-end"
        >
          <div
            style={{
              background: "white",
              // display: "flex",
              textAlign: "center",
              border: "1px solid #80808025",
              borderShadow: "1px 2px",
              padding: "20px",
            }}
          >
            <h5>
              This reset is irreversible and all your data will be lost.
              <p style={{ color: "red" }}>Proceed with Caution!</p>
            </h5>
            <Button onClick={resetData} variant="contained">
              Proceed to Reset Data
            </Button>
          </div>
        </BasePopup>
      </div>
      <div
        className="body"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 20,
          gap: 20,
          alignItems: "center",
        }}
      >
        <div className="input-block">
          <p>Date today: {Date()}</p>
          <Input
            label="Thing to track"
            value={thingToTrack}
            onChange={(e) => setThingToTrack(e.target.value)}
          ></Input>
          <Select
            label="recurrence schedule"
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <MenuItem value={"Weekly"}>Weekly</MenuItem>
            <MenuItem value={"Monthly"}>Monthly</MenuItem>
            <MenuItem value={"Yearly"}>Yearly</MenuItem>
          </Select>

          <Input
            type="date"
            value={dateToTrack}
            onChange={(e) => setDateToTrack(e.target.value)}
          ></Input>

          <Button
            variant="contained"
            onClick={() => {
              handleStore({
                thingToTrack: thingToTrack,
                date: dateToTrack,
                recurrence,
                lastCycle: dateToTrack,
              });
              reset();
            }}
          >
            Add
          </Button>
        </div>
        <Box sx={{ height: 400, width: "80%" }}>
          <DataGrid
            rows={rows}
            columns={cols}
            disableRowSelectionOnClick
          ></DataGrid>
        </Box>
      </div>
    </div>
  );
}

export default App;
