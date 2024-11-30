import React from "react";
import { Button } from "@mui/material";
export function AddMedicationButton() {
  return (
    <Button
      variant="contained" disableRipple disableFocusRipple
      sx={{
        backgroundColor: "#2a5599",
        color: "#eee",
        width: "100%",
        height: 50,
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: "bold",
        fontSize: 20,
        borderRadius: "25px",
        border: "1px solid #2a5599",
        outline: "none !important",
      }}
    >
      <div style={{ marginRight: '10px', marginTop: '0px', border: "2px black" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="40" viewBox="0 0 53 50" fill="none">
          <g filter="url(#filter0_d_190_2595)">
            <path d="M45.1027 9.3311H37.4301V4.72756C37.4301 2.18603 35.3681 0.124023 32.8266 0.124023H17.4815C14.9399 0.124023 12.8779 2.18603 12.8779 4.72756V9.3311H5.20535C2.66381 9.3311 0.601807 11.3931 0.601807 13.9346V41.5559C0.601807 44.0974 2.66381 46.1594 5.20535 46.1594H45.1027C47.6442 46.1594 49.7062 44.0974 49.7062 41.5559V13.9346C49.7062 11.3931 47.6442 9.3311 45.1027 9.3311ZM19.016 6.26208H31.2921V9.3311H19.016V6.26208ZM34.3611 30.047C34.3611 30.469 34.0158 30.8143 33.5938 30.8143H28.223V36.1851C28.223 36.6071 27.8778 36.9523 27.4558 36.9523H22.8522C22.4303 36.9523 22.085 36.6071 22.085 36.1851V30.8143H16.7142C16.2922 30.8143 15.9469 30.469 15.9469 30.047V25.4435C15.9469 25.0215 16.2922 24.6762 16.7142 24.6762H22.085V19.3054C22.085 18.8834 22.4303 18.5382 22.8522 18.5382H27.4558C27.8778 18.5382 28.223 18.8834 28.223 19.3054V24.6762H33.5938C34.0158 24.6762 34.3611 25.0215 34.3611 25.4435V30.047Z" fill="#eee" />
          </g>
          <defs>
            <filter id="filter0_d_190_2595" x="0.601807" y="0.124023" width="52.1044" height="49.0354" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" result="hardAlpha" />
              <feOffset dx="3" dy="3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_190_2595" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_190_2595" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
      Add Medication
    </Button>
  );
}