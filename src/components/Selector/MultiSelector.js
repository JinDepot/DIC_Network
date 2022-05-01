import React, { useState } from "react";
import {
    Select,
    Input,
    ListItemIcon,
    ListItemText,
    Checkbox,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Typography,
} from "@mui/material";
import "./Selector.css";

function MultiSelector({ title, options, config, setConfig }) {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "center",
        },
        variant: "menu",
    };

    const isAllSelected =
        options.length > 0 && config[title].length === options.length;

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setConfig({
                ...config,
                [title]: config[title].length === options.length ? [] : options,
            });
            return;
        }
        setConfig({
            ...config,
            [title]: value,
        });
    };

    return (
        <div className={`tooltip`} style={{ width: "100%" }}>
            <FormControl
                style={{ display: "flex", padding: "10px 0", width: "inherit" }}
            >
                <a
                    id="demo-mutiple-chip-label"
                    className={`optionHeader noselect`}
                >
                    {title}
                </a>
                <Select
                    labelId="demo-mutiple-chip-label"
                    multiple
                    value={config[title]}
                    onChange={handleChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={() => (
                        <div
                            style={{
                                whiteSpace: "normal",
                                padding: "0px 5px",
                                maxHeight: "150px",
                                overflowY: "auto",
                            }}
                        >
                            {config[title].map((value) => (
                                <Chip
                                    style={{ margin: "5px 0px" }}
                                    key={value}
                                    label={value}
                                />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="all">
                        <ListItemIcon>
                            <Checkbox
                                checked={isAllSelected}
                                indeterminate={
                                    config[title].length > 0 &&
                                    config[title].length < options.length
                                }
                            />
                        </ListItemIcon>
                        <ListItemText primary="Select All" />
                    </MenuItem>
                    {options.map((name) => (
                        <MenuItem key={name} value={name}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={config[title].indexOf(name) > -1}
                                />
                            </ListItemIcon>
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div
                className={`tooltip_text`}
                style={{
                    width: "250px",
                }}
            >
                {title === "DIC" ? (
                    <span className={`tooltipText`}>
                        Choose our data-driven industry group(s) to be included
                        in the network
                    </span>
                ) : (
                    <span className={`tooltipText`}>
                        Choose the GICS sub-industry group(s) to be included in
                        the network
                    </span>
                )}
            </div>
        </div>
    );
}

export default MultiSelector;
