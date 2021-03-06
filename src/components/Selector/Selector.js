import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function Selector({ title, config, setConfig }) {
    const handleChange = (e) => {
        setConfig({
            ...config,
            market: e.target.value,
        });
    };

    return (
        <div className={`tooltip`} style={{ width: "100%" }}>
            <FormControl fullWidth>
                <a
                    id="demo-simple-select-label"
                    className={`optionHeader noselect`}
                >
                    {title}
                </a>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={config.market}
                    onChange={handleChange}
                >
                    <MenuItem value="S&P500"> S&P 500 </MenuItem>
                    <MenuItem value="KOSPI"> KOSPI + KOSDAQ </MenuItem>
                </Select>
            </FormControl>
            <div className={`tooltip_text`}>
                <span className={`tooltipText`}>
                    Choose "S&P500" for the U.S. market <br></br> "KOSPI+KOSDAQ"
                    for Korean market
                </span>
            </div>
        </div>
    );
}

export default Selector;
