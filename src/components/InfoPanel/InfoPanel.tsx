import { Card, CardContent, Typography } from "@mui/material";
import { WarningOutlined } from "@material-ui/icons";
import React from "react";

type Props = {
  bodyCopy: string;
};

function InfoPanel({ bodyCopy }: Props) {
  return (
    <div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "16px",
            backgroundColor: "#e1b5b5",
          }}
        >
          <WarningOutlined style={{ marginRight: "1rem", color: "#a22c2c" }} />
          <Typography
            sx={{ fontSize: 14 }}
            style={{ color: "#a22c2c" }}
            gutterBottom
          >
            {bodyCopy}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoPanel;
