import { Card, CardContent, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const StatusCard = (props) => {
    return (
      <>
        <Card
          className={
            props.rider
              ? "riders-bg text-white text-center mr-3"
              : props.plain
              ? "plain-bg"
              : props.green
              ? "bg-primary-main text-white"
              : props.big
              ? "text-left border "
              : " text-white text-center"
          }
          sx={{
            minWidth: "48%",
            minHeight: !props.short && 120,
            maxHeight: props.short && 105,
          }}
        >
          <div className="flex justify-between mt-4 ">
            <Typography
              variant="h5"
              className=" text-primary-main font-bold z-10 m-2 ml-4"
            >
              {props.cardTitle}
            </Typography>
            <Typography className=" text-primary-main font-bold z-10 m-2">
              {props.cardLink}{" "}
              {props.dashboard && <KeyboardDoubleArrowRightIcon />}
            </Typography>
          </div>

          <Divider className="my-3" />
          <CardContent className={props.big ? "pr-24" : ""}>
            <div>
              <div className="flex justify-between ">
                <div>
                  {!props.small ? (
                    <Typography
                      variant={"h5"}
                      className=" text-primary-main font-bold z-10"
                      style={{ zIndex: 100 }}
                    >
                      {props.numberOfMedicine }
                    </Typography>
                  ) : (
                    <Typography
                      className=" text-primary-main font-bold z-10"
                      style={{ zIndex: 100 }}
                    >
                      {props.numberOfMedicine }
                    </Typography>
                  )}
                  <Typography
                    // variant={"h5"}
                    className=" text-primary-main text-left z-10"
                    style={{ zIndex: 100 }}
                  >
                    {props.pharmacyName}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant={"h5"}
                    className=" text-primary-main text-left font-bold z-10"
                    style={{ zIndex: 100 }}
                  >
                    {props.medicineGroups || ""}
                  </Typography>
                  <Typography
                    // variant={"h5"}
                    className=" text-primary-main text-left z-10"
                    style={{ zIndex: 100 }}
                  >
                    {props.PharmacyId}
                  </Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
}

export default StatusCard;