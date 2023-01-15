import React, { useState } from "react";
import UserApi from "apis/UserApi";
import { useFormik } from "formik";
import { MdRefresh, MdOutlineSearch, MdSearch } from "react-icons/md";
import * as yup from "yup";
import { useSnackbar } from "notistack";
// import { Button, TextField, Typography } from "@mui/material";
import PasswordTextField from "common/PasswordTextField";
import { getTextFieldFormikProps } from "utils/FormikUtils";
import useAuthUser from "hooks/useAuthUser";
import CompanyRiderCard from "common/CompanyRiderCard";
import StatusCard from "common/StatusCard";
import { Navigate } from "react-router-dom";
import { RouteEnum } from "constants/RouteConstants";
import LoginHeader from "common/LoginHeader";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import toDoorLogo from "images/Ellipse 30.png";
import background from "images/background.png";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { RouteEnum } from "constants/RouteConstants";
// import ReactDOM from 'react-dom';
// import trustedBy1 from './images/Vector.png'
import trustedBy2 from "images/Rectangle 7.png";
import trustedBy3 from "images/Rectangle 106.png";
// import LoginHeader from './LoginHeader';
// import trustedBy3 from './images/trustedBy-3.png'
// import trustedBy4 from './images/trustedBy-4.png'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import WallCards from "common/WallCards";
import { AccountCircle } from "@mui/icons-material";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ToDoorSearch from "common/ToDoorSearch";
import ManageCompanyCard from "features/manageCompanies/ManageCompanyCard";

function Signup(props) {
  const [age, setAge] = React.useState("");
  const [show, setshow] = React.useState();
  const handleChange = (event) => {
    setAge(event.target.value);
    console.log(event);
  };
  const history = useNavigate();

  const redirect = () => {
    history("/complete-signUp");
  };

  const authUser = useAuthUser();

  const { enqueueSnackbar } = useSnackbar();
  const [loginMuation, loginMutationResult] = UserApi.useLoginMutation();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup.string().trim().required(),
      password: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      console.log(values);
      // localStorage.setItem('location', values.location)
      redirect();

      try {
        const data = await loginMuation({ data: values }).unwrap();
        // TODO extra login
        // redirect()
        enqueueSnackbar("Logged in successful", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(error?.data?.message, "Failed to login", {
          variant: "error",
        });
      }
    },
  });

  // if (authUser.accessToken) {
  //   return <Navigate to={RouteEnum.HOME} />;
  // }

  return (
    <div className="w-full">
      <div className="">
        {/* <span className="text-xs mr-1 opacity-50">
          <MdRefresh />
        </span> */}
        <div className="flex justify-between ">
          <div>
            <Typography variant="h4" className="font-bold">
              Dashboard
            </Typography>
            <Typography variant="h6" className="font-bold">
              A quick overview of the inventory
            </Typography>
          </div>
          <div>
            <Button
              style={{
                width: "250px",
                height: "50px",
                backgroundColor: "white",
              }}
              variant="contained"
              endIcon={<ExpandMoreIcon />}
            >
              <Typography className="text-black" variant="h6">
                Download Report
              </Typography>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          <WallCards
            mainInfo="Good"
            subInfo="Inventory Status"
            icon={
              <HealthAndSafetyIcon
                sx={{ fontSize: "xxx-large", color: "#01A7684D" }}
              />
            }
            bottom="View Detailed Report"
            color="#01A7684D"
          />
          <WallCards
            mainInfo="Good"
            subInfo="Inventory Status"
            icon={
              <HealthAndSafetyIcon
                sx={{ fontSize: "xxx-large", color: "#FED600" }}
              />
            }
            bottom="View Detailed Report"
            color="#FED600"
          />
          <WallCards
            mainInfo="Good"
            subInfo="Inventory Status"
            icon={
              <HealthAndSafetyIcon
                sx={{ fontSize: "xxx-large", color: "#03A9F5" }}
              />
            }
            bottom="View Detailed Report"
            color="#03A9F5"
          />
          <WallCards
            mainInfo="Good"
            subInfo="Inventory Status"
            icon={
              <HealthAndSafetyIcon
                sx={{ fontSize: "xxx-large", color: "#F0483E" }}
              />
            }
            bottom="View Detailed Report"
            color="#F0483E"
          />
        </div>
      </div>
      <div>
        <div className="w-full flex justify-between mt-4">
          {/* <div
            className="flex-between px-2 w-full text-xs absolute "
            style={{ top: "-20px" }}
          >
            <p className="font-bold flextext-xs self-end">Today</p>
            <div className="flex items-center">
              <span className="text-xs mr-1 opacity-50">
                <MdRefresh />
              </span>
              <span className="text-xs opacity-50">Refresh</span>
            </div>
          </div> */}
          <StatusCard
            cardTitle="Inventory"
            cardLink={"Go to Configuration"}
            numberOfMedicine="298"
            medicineGroups="24"
            dashboard={true}
            pharmacyName="Total no of Suppliers"
            PharmacyId="Total no of users"
          />
          <StatusCard
            cardTitle="Quick Report"
            cardLink="January 2022"
            numberOfMedicine="70,856"
            medicineGroups="5,288"
            dashboard={true}
            pharmacyName="Total no of Suppliers"
            PharmacyId="Total no of users"
          />
        </div>
        <div className="w-full flex justify-between mt-4">
          <StatusCard
            cardTitle="My Pharmacy"
            cardLink="Go to User Management"
            numberOfMedicine="04"
            medicineGroups="05"
            dashboard={true}
            pharmacyName="Total no of Suppliers"
            PharmacyId="Total no of users"
          />
          <StatusCard
            cardTitle="Customers"
            cardLink="Go to Customers Page"
            numberOfMedicine="845"
            medicineGroups="Paracetamol"
            pharmacyName="Total no of Suppliers"
            PharmacyId="Total no of users"
            dashboard={true}
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
