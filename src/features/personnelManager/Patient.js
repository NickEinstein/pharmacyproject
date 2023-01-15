import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Slide from "@mui/material/Slide";
import { visuallyHidden } from "@mui/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { del, get, post } from "services/fetch";
import UserApi from "apis/UserApi";
import { useSnackbar } from "notistack";
// import { LoadingButton } from "@mui/lab";

function createData(
  name,
  calories,
  fat,
  carbs,
  vitamins,
  driversLicenseNo,
  insuranceNumber,
  protein
) {
  return {
    name,
    calories,
    fat,
    carbs,
    vitamins,
    driversLicenseNo,
    insuranceNumber,
    protein,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Patient Name",
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: "SSN",
  },
  {
    id: "fat",
    numeric: false,
    disablePadding: false,
    label: "Gender",
  },
 {
    id: "carbs",
    numeric2: true,
    disablePadding: false,
    label: "Address",
  },
  {
    id: "vitamins",
    numeric: false,
    disablePadding: false,
    label: "Date Of Birth",
  },
 

  {
    id: "driversLicenseNo",
    numeric: false,
    disablePadding: false,
    label: "Drivers Liscence No.",
  },

  {
    id: "insuranceNumber",
    numeric: false,
    disablePadding: false,
    label: "Insurance Number",
  },

  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        {headCells?.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={
              headCell.numeric ? "right" : headCell.numeric2 ? "center" : "left"
            }
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function ListOfMedicines() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState(null);
  const [meds, setMeds] = React.useState([null]);
  const [formData, setFormdata] = React.useState({
    // id: 0,
    patientName: "string",
    patientAddress: "string",
    dob: "2023-01-15T11:25:14.757Z",
    gender: "string",
    ssn: "string",
    driversLicenseNo: "string",
    insuranceNumber: "string",
  });

  const rows = meds?.map((e) =>
    createData(
      e?.patientName,
      e?.ssn,
      e?.gender,

      e?.patientAddress,
      e?.dob,

      e?.driversLicenseNo,
      e?.insuranceNumber
    )
  );

  React.useEffect(() => {
    getRidersUnderCompanyR();
  }, []);

  const onChange = (e, name) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  console.log(formData);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const { enqueueSnackbar } = useSnackbar();

  const [createInventoryMuation, createInventoryMutationResult] =
    UserApi.useCreateInventoryMutation();

  const ridersUnderCompanyR = async (companyId) => {
    const res = await post({
      endpoint: `patient/create-patient`,
      body: { ...formData },
      // auth: true,
    });

    getRidersUnderCompanyR();
    // try {
    //   const data = await createInventoryMuation({ data: formData }).unwrap();
    //   // TODO extra login
    //   // redirect()
    //   enqueueSnackbar("Logged in successful", { variant: "success" });
    // } catch (error) {
    //   enqueueSnackbar(error?.data?.message, "Failed to login", {
    //     variant: "error",
    //   });
    // }
    // console.log(res.data.data);
    // return res.data.data.length;
  };

  const getRidersUnderCompanyR = async (companyId) => {
    const res = await get({
      endpoint: `patient/get-patients`,
      body: { ...formData },
      // auth: true,
    });
    // try {
    //   const data = await createInventoryMuation({ data: formData }).unwrap();
    //   // TODO extra login
    //   // redirect()
    //   enqueueSnackbar("Logged in successful", { variant: "success" });
    // } catch (error) {
    //   enqueueSnackbar(error?.data?.message, "Failed to login", {
    //     variant: "error",
    //   });
    // }
    setMeds(res.data.data);
    // return res.data.data.length;
  };

  const deleteItem = async (id) => {
    const res = await del({
      endpoint: `patient/delete-patient?Id=${id}`,
      //  body: { ...formData },
      // auth: true,
    });
    getRidersUnderCompanyR();
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected?.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected?.slice(0, selectedIndex),
        selected?.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <Box sx={{ width: "100%" }}>
      <div className="">
        {/* <span className="text-xs mr-1 opacity-50">
          <MdRefresh />
        </span> */}
        {/* <ToDoorSearch /> */}
        <div className="flex justify-between ">
          <div>
            <Typography variant="h4" className="font-bold">
              <span class="text-[#1D242E80]">Personnel Manager </span>&gt;
              Patients
            </Typography>
            <Typography variant="h6" className="">
              List of Recorded Patients
            </Typography>
          </div>
          <div>
            <Button
              onClick={handleClickOpen}
              style={{
                width: "250px",
                height: "50px",
                backgroundColor: "#F0483E",
              }}
              variant="contained"
              startIcon={<Add />}
            >
              <Typography variant="h6">Add Patient</Typography>
            </Button>
          </div>
        </div>
      </div>

      {/* <div className='mt-4 full-w'>
        <ToDoorSearch placeholder="Search Medicine Inventory here..."/>
      </div> */}

      <Paper sx={{ width: "100%", mb: 2 }} className="mt-4">
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected?.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell> */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        // padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.calories}</TableCell>
                      <TableCell align="left">{row.fat}</TableCell>
                      <TableCell sx={{width:'20%'}} align="center">{row.carbs}</TableCell>
                      <TableCell align="left">
                        {moment(row.vitamins).format("ll")}
                      </TableCell>
                      <TableCell align="left">{row.driversLicenseNo}</TableCell>
                      <TableCell align="left">{row.insuranceNumber}</TableCell>

                      <TableCell align="right">
                        <DeleteIcon
                          className="cursor-pointer"
                          onClick={() => deleteItem(row.protein)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* <LoadingButton
        className="my-6"
        fullWidth
        type="submit"
        // loading={signupMutationResult.isLoading}
        loadingPosition="start"
        size="large"
      >
        Create Account
      </LoadingButton> */}

      <Dialog
        open={open}
        // sx={{ width: "2000px", border: "2px solid red" }}
        maxWidth="lg"
        // fullWidth={true}
        // sx={{width:"2000px", border:'2px solid red'}}
        // TransitionComponent={Transition}
      >
        <DialogTitle>Add Patient</DialogTitle>
        <DialogContent sx={{ width: "500px" }}>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <Typography className="text-center">Enter Information</Typography>
          <Typography
            gutterBottom
            variant="body2"
            color="textSecondary"
            className="text-center"
          >
            This will only take a few minutes
          </Typography>
          {/* <Typography variant="h5" className="text-center">{formik?.values?.email_address}</Typography> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <TextField
              onChange={onChange}
              name="patientName"
              required
              margin="normal"
              fullWidth
              placeholder="patient Name"
            />
            <TextField
              onChange={onChange}
              name="patientAddress"
              required
              margin="normal"
              fullWidth
              placeholder="patient Address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-2">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                name=""
                onChange={(e) => onChange(e, "dob")}
                // label="Basic example"
                value={formData.dob}
                //
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <TextField
              onChange={onChange}
              required
              fullWidth
              placeholder="Gender"
              name="gender"
            />
          </div>{" "}
          <>
            <TextField
              onChange={onChange}
              required
              //   type="number"
              //   type="number"
              margin="normal"
              fullWidth
              placeholder="SSN"
              name="ssn"
            />
            <TextField
              onChange={onChange}
              required
            //   type="number"
              margin="normal"
              fullWidth
              placeholder="Drivers License No"
              name="driversLicenseNo"
            />
            <TextField
              onChange={onChange}
              required
              margin="normal"
              //   type="number"
              fullWidth
              placeholder="insurance Number"
              name="insuranceNumber"
            />
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={ridersUnderCompanyR}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
