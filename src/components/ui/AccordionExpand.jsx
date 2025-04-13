import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AccordionExpand({ content, title, id }) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${id}-content`}
          id={`panel${id}-header`}
        >
          <Typography component='span'>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component='span'>{content}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
