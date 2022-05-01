import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";

const Input = styled(MuiInput)`
    width: 42px;
`;

export default function InputSlider({ nodes, config, setConfig }) {
    const handleSliderChange = (event, newValue) => {
        setConfig({
            ...config,
            n: newValue,
        });
    };

    const handleInputChange = (event) => {
        setConfig({
            ...config,
            n: event.target.value === "" ? "" : Number(event.target.value),
        });
    };

    const handleBlur = () => {
        if (config.n < 1) {
            setConfig({
                ...config,
                n: 1,
            });
        } else if (config.n > nodes.length) {
            setConfig({
                ...config,
                n: nodes.length,
            });
        }
    };

    return (
        <div style={{ width: "inherit" }}>
            <a id="input-slider" className={`optionHeader noselect`}>
                Top N Node (Marketcap)
            </a>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs className={`inputSlider`}>
                    <Slider
                        min={1}
                        max={nodes.length}
                        value={typeof config.n === "number" ? config.n : 1}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                    <div
                        className={`inputSlider_tooltip`}
                        style={{
                            padding: "2px 8px",
                        }}
                    >
                        <span className={`tooltipText`}>
                            Choose the number of nodes N (top-N by market cap
                            size) to be included in the network
                        </span>
                    </div>
                </Grid>
                <Grid item className={`inputSlider`}>
                    <Input
                        style={{ width: "60px", alignItems: "center" }}
                        className={""}
                        value={config.n}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 1,
                            max: nodes.length,
                            type: "number",
                            "aria-labelledby": "input-slider",
                        }}
                    />
                    <div
                        className={`inputSlider_tooltip`}
                        style={{
                            left: "230%",
                            padding: "2px 8px",
                        }}
                    >
                        <span className={`tooltipText`}>
                            Type the number of nodes N (top-N by market cap
                            size) to be included in the network
                        </span>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

{
    /* <div style={{ width: "inherit" }}>
<a id="input-slider" className={`optionHeader noselect`}>
	Top N Node (Marketcap)
</a>
<Grid container spacing={2} alignItems="center">
	<div className={`tooltip`} style={{ width: "90%" }}>
		<Grid item xs>
			<Slider
				min={1}
				max={nodes.length}
				value={typeof config.n === "number" ? config.n : 1}
				onChange={handleSliderChange}
				aria-labelledby="input-slider"
			/>
		</Grid>
		<div className={`tooltip_text`}>
			<span>
				Choose "S&P500" for the U.S. market; "KOSPI+KOSDAQ"
				for Korean market
			</span>
		</div>
	</div>
	<div className={`tooltip`} style={{ width: "10%" }}>
		<Grid item>
			<Input
				style={{ width: "60px", alignItems: "center" }}
				className={""}
				value={config.n}
				margin="dense"
				onChange={handleInputChange}
				onBlur={handleBlur}
				inputProps={{
					step: 10,
					min: 1,
					max: nodes.length,
					type: "number",
					"aria-labelledby": "input-slider",
				}}
			/>
		</Grid>
		<div className={`tooltip_text`}>
			<span>
				Choose "S&P500" for the U.S. market; "KOSPI+KOSDAQ"
				for Korean market
			</span>
		</div>
	</div>
</Grid>
</div> */
}
