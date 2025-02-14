/** @format */

import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const access_key = "9a449f25d491aa7dc2d3ae7ba4f1e75c";

app.get("/", async (req, res) => {
	res.render("index.ejs", {
		weather: {
			error: null,
			location: null,
			current: null,
		},
	});
});

app.post("/weather", async (req, res) => {
	const city = req.body.location;

	try {
		const result = await axios.get("https://api.weatherstack.com/forecast", {
			params: {
				access_key: access_key,
				query: city,
				units: "m",
			},
		});

		res.render("index.ejs", {
			weather: result.data,
			weatherDescription: result.data.current.weather_descriptions[0].toLowerCase(),
		});
	} catch (error) {
		console.log(error);
		res.render("index.ejs", {
			weatherError: "Error fetching weather data",
		});
		res.status(500).send("Error fetching weather data");
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
