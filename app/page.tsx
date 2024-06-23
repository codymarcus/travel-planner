"use client"
import { useState, useEffect } from "react"
import countries from "./countries"

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  TextField,
  Typography,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

import MyAwesomeMap from "./map"

export default function Home() {
  const [country, setCountry] = useState("France")
  const [days, setDays] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchItinerary = async () => {
      setIsLoading(true)
      const itinerary = await fetch("http://localhost:3000/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region: country,
          timeframe: "2 weeks",
        }),
      })
      setDays(await itinerary.json())
      setIsLoading(false)
    }

    fetchItinerary()
  }, [country])

  // Map days to array where the same location on consecutive days is grouped
  // together
  const groupedDays = days.reduce((acc, day, index) => {
    if (index === 0 || days[index - 1].location.name !== day.location.name) {
      acc.push([day])
    } else {
      acc[acc.length - 1].push(day)
    }
    return acc
  }, [])

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", paddingY: 2 }}>
        <Autocomplete
          options={countries}
          renderInput={(params) => <TextField {...params} label="Country" />}
          onChange={(_, value) => setCountry(value)}
          sx={{ width: 300 }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "90%",
        }}
      >
        <Box sx={{ flex: 1, marginRight: 1 }}>
          {!isLoading && (
            <MyAwesomeMap locations={days.map((day) => day.location)} />
          )}
        </Box>
        <Box
          sx={{ flex: 1, marginLeft: 1, overflowY: "auto", paddingBottom: 1 }}
        >
          {isLoading
            ? "Loading..."
            : groupedDays.map((days, index) => (
                <Accordion
                  defaultExpanded
                  sx={{ backgroundColor: "#f0f6ff" }}
                  key={index}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography variant="h5">
                      {days[0].location.name} ({days.length} day
                      {days.length > 1 ? "s" : ""})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {days.map(({ day, description }) => (
                      <Typography key={day}>
                        <b>Day {day}:</b> {description}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
        </Box>
      </Box>
    </Box>
  )
}
