
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

export default function MuiCalendar() {
    const [selectedDate, setSelectedDate] = useState(dayjs()); // Set today's date    

    return (
        <div style={styles.container}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar 
              value={selectedDate} 
              onChange={(newDate) => setSelectedDate(newDate)} 
              sx={styles.calendar} // Apply styles using sx
            />
          </LocalizationProvider>
        </div>
      );
    }
    
    // MUI file Inline styles
    const styles = {
        container: {
          backgroundColor: "#ffffff",
          padding: "15px",
          borderRadius: "12px", // Match reminders widget border radius
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // Match reminders widget shadow
          margin: "auto",
          border: "1px solid #f0f0f0", // Add border like reminders widget
          maxWidth: "350px", // Constrain width to match reminders widget
        },
        calendar: {
          width: "100%",
          "& .MuiPickersCalendarHeader-root": {
            backgroundColor: "#8b1e41", // Match reminders header color
            color: "white",
            padding: "12px 15px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          },
          "& .MuiPickersCalendarHeader-labelContainer": {
            color: "white",
            fontWeight: 600,
          },
          "& .MuiIconButton-root": {
            color: "white",
          },
          "& .MuiPickersDay-root": {
            fontSize: "14px",
            color: "#333",
            transition: "all 0.2s ease",
          },
          "& .Mui-selected": {
            backgroundColor: "#8b1e41 !important", // Match header color for selected
            color: "#fff",
            fontWeight: "bold",
          },
          "& .MuiPickersDay-root:hover": {
            backgroundColor: "#f5f5f5", // Soft hover effect like reminders
          },
          "& .MuiPickersDay-today": {
            border: "2px solid #8b1e41", // Highlight today's date
            backgroundColor: "transparent",
          }
        }
      };
