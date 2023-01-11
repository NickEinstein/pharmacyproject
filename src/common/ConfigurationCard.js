import { Card, CardContent, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const ConfigurationCard = (props) => {
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
            maxWidth: 600,
            minHeight: !props.short && 120,
            maxHeight: props.short && 105,
          }}
        >
          <div className="flex justify-between  mt-4 ">
            <Typography
              variant="h5"
              className=" text-primary-main font-bold z-10 m-2 ml-4 "
            >
              {props.firstColumn}
            </Typography>
            <Typography
              variant="h5"
              className=" text-primary-main font-bold z-10 m-2 ml-4"
            >
              {props.secondColumn}{" "}
              {props.dashboard && <KeyboardDoubleArrowRightIcon />}
            </Typography>
            <Typography
              variant="h5"
              className=" text-primary-main font-bold z-10 m-2 ml-4"
            >
              {/* {props.secondColumn}{" "} */}
              {props.dashboard && <KeyboardDoubleArrowRightIcon />}
            </Typography>
          </div>

          <Divider className="my-3" />
          <CardContent className={props.big ? "pr-24" : ""}>
            <div>
              {[1, 2].map(() => (
                <div className="flex py-4 justify-between">
                  <div>
                    <Typography
                      // variant={"h5"}
                      className=" text-primary-main z-10"
                      style={{ zIndex: 100 }}
                    >
                      {"Dashboard"}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      // variant={"h5"}
                      className=" text-primary-main underline underline-offset-4 z-10"
                      style={{ zIndex: 100 }}
                    >
                      {"+ Add Sub Page"}
                    </Typography>
                  </div>

                  <div className="flex gap-6">
                    <Typography
                      // variant={"h5"}
                      className=" text-primary-main z-10"
                      style={{ zIndex: 100 }}
                    >
                      {props.cardLink2}
                    </Typography>
                    <Typography
                      // variant={"h5"}
                      className=" text-primary-main z-10"
                      style={{ zIndex: 100 }}
                    >
                      {props.cardLink}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            <Divider/>

            <Typography className="text-primary-main text-left mt-4" variant="h6"> + Add a new Page</Typography>
          </CardContent>
        </Card>
      </>
    );
}

export default ConfigurationCard;