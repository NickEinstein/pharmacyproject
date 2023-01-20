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
import AddIcon from "@mui/icons-material/Add";
import Slide from "@mui/material/Slide";
import { visuallyHidden } from "@mui/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Add, AddAPhoto } from "@mui/icons-material";
import { del, get, post } from "services/fetch";
import UserApi from "apis/UserApi";
import { useSnackbar } from "notistack";
// import { LoadingButton } from "@mui/lab";

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
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
    label: "SSN",
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: "Patient",
  },
  {
    id: "fat",
    numeric: false,
    disablePadding: false,
    label: "Diagnosis",
  },

  {
    id: "carbs",
    numeric: false,
    disablePadding: false,
    label: "Prescription",
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
            align={headCell.numeric ? "right" : "left"}
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
  const [patients, setpatients] = React.useState([null]);
  const [prescribers, setPrescribers] = React.useState([null]);
  const [prescriptions, setPrescriptions] = React.useState([null]);
  const [holdIdDispense, setholdIdDispense] = React.useState("");
  const [volumeDispensed, setVolumeDispensed] = React.useState("");

  const [holdPatientInfo, setHoldPatientInfo] = React.useState("");
  const [holdPrescribedInfo, setHoldPrescribedInfo] = React.useState("");

  const [openDispensedVolume, setOpenDispensedVolume] = React.useState(false);
  

  const [formData, setFormdata] = React.useState({
    patientId: 0,
    details: "string",
    prescriberId: 1,
    inventoryId: 0,
    diagnosis: "string",
    dateOfPrescription: "2023-01-20T04:17:13.631Z",
    volumePrescribed: "string",
    ssn: "string",
    volumeDispensed: "string",
  });

  const rows = prescriptions?.map((e) =>
    createData(e?.ssn, e?.patientId, e?.diagnosis, e?.inventoryId, e?.id)
  );

  console.log(rows);
  console.log(prescriptions);

  React.useEffect(() => {
    getDispenseries()
    getPrescribers();
    getPatients();
    getMedicatons();
    getPrescription();
  }, []);

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const showDispense = (patient)=>{
    console.log(patient)
    setholdIdDispense(patient)
    setHoldPatientInfo(patients?.find((e) => e?.id == patient.calories));
    // setHoldPrescribedInfo(
    //   prescriptions?.filter((e) => e?.patientId == patient.calories)
    // );
    setOpen(true)

}

console.log(holdPatientInfo)
console.log(holdPrescribedInfo);
  const onChange = (e, name) => {
    console.log(e.target.name);
    console.log(e.target.value);

    if (name) {
      console.log(name);
      console.log(e);
      setFormdata({
        ...formData,
        [name]: e,
      });
    } else {
      if (e.target.name === "noOfPatients") {
        setFormdata({
          ...formData,
          [e.target.name]: +e.target.value,
        });
      } else
        setFormdata({
          ...formData,
          [e.target.name]: e.target.value,
        });
    }
  };

  console.log(formData);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows?.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const { enqueueSnackbar } = useSnackbar();

  const [createInventoryMuation, createInventoryMutationResult] =
    UserApi.useCreateInventoryMutation();

    function getName(id){
        let name = patients?.find((e)=>e?.id == id)
        console.log(name);
        

        
        return name?.patientName
    }

    function getPatientsPrescription(id) {
        console.log(id);
        console.log(prescriptions);
        
      let name = prescriptions?.filter((e) => e?.patientId == id);
      console.log(name);
      return name;
    }

  const ridersUnderCompanyR = async (companyId) => {

    let payload = {
      patientId: holdPatientInfo?.id,
      prescriptionId: holdPrescribedInfo?.id,
      inventoryId: holdPrescribedInfo?.inventoryId,
      dispenserId: 5,
      diagnosis: holdPrescribedInfo?.diagnosis,
      dateOfPrescription: holdPrescribedInfo?.dateOfPrescription,
      dateDispensed: new Date(),
      volumePrescribed: holdPrescribedInfo?.volumePrescribed,
      ssn: holdPrescribedInfo?.ssn,
      volumeDispensed: volumeDispensed,
    };
    console.log(formData);
    const res = await post({
      endpoint: `dispensary/dispense`,
      body: payload,
      // auth: true,
    });

    // getPrescribers();
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
    console.log(res.data.data);
    // getDispensers();

    // return res.data.data.length;
  };

  const getMedicatons = async (companyId) => {
    const res = await get({
      endpoint: `inventory/get-inventories`,
      body: { ...formData },
      // auth: true,
    });

    console.log(res.data.data);
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

   const getDispenseries = async (companyId) => {
     const res = await get({
       endpoint: `dispensary/get-dispensaries`,
       // auth: true,
     });

     console.log(res.data.data);
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
    //  setMeds(res.data.data);
     // return res.data.data.length;
   };

  const getPrescribers = async (companyId) => {
    const res = await get({
      endpoint: `prescriber/get-prescribers`,
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
    setPrescribers(res.data.data);
    // return res.data.data.length;
  };

  const getPrescription = async (companyId) => {
    const res = await get({
      endpoint: `prescription/get-prescriptions`,
      //    body: { ...formData },
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
    //  console.Console.log(res.data.data)
    setPrescriptions(res.data.data);
    // return res.data.data.length;
  };

  const getPatients = async (companyId) => {
    const res = await get({
      endpoint: `patient/get-patients`,
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
    setpatients(res.data.data);
    // return res.data.data.length;
  };

  const deleteItem = async (id) => {
    const res = await del({
      endpoint: `prescriber/delete-prescribers?Id=${id}`,
      //  body: { ...formData },
      // auth: true,
    });
    getPrescribers();
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
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
              Dispensary
            </Typography>
            
          </div>
          {/* <div>
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
              <Typography variant="h6">Prescribe CS</Typography>
            </Button>
          </div> */}
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
                        className="cursor-pointer hover:text-blue-500"
                        // padding="none"
                        onClick={() => {
                          showDispense(row);
                          getPatientsPrescription(row.calories);
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">
                        {getName(row?.calories)}
                      </TableCell>
                      <TableCell align="left">{row?.fat}</TableCell>
                      <TableCell align="left">{row?.carbs}</TableCell>

                      <TableCell align="right">
                        <DeleteIcon
                          className="cursor-pointer"
                          onClick={() => deleteItem(row?.protein)}
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
        <DialogTitle className="bg-[#283342] text-white">
          Dispense CS
        </DialogTitle>
        <DialogContent sx={{ width: "700px" }}>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <div className="flex justify-between my-3">
            <div className="flex flex-col gap-2">
              <div class="flex gap-6">
                <Typography>Name:</Typography>
                <Typography>{getName(holdIdDispense?.calories)}</Typography>
              </div>
              <div class="flex gap-6">
                <Typography>DOB:</Typography>
                <Typography>12/12/1909</Typography>
              </div>
              <div class="flex gap-6">
                <Typography>Address:</Typography>
                <Typography>JFK Lane, NYC </Typography>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div class="flex gap-6">
                <Typography>Phone: </Typography>
                <Typography>HallGP</Typography>
              </div>
              <div class="flex gap-6">
                <Typography>Hosptal ID No: </Typography>
                <Typography>DOB</Typography>
              </div>

              <Typography variant="h6">Emergency Contacts</Typography>
              <div class="flex gap-6">
                <Typography>Name</Typography>
                <Typography>Mary Havey </Typography>
              </div>
              <div class="flex gap-6">
                <Typography>Relationship: </Typography>
                <Typography>Brother</Typography>
              </div>
              <div class="flex gap-6">
                <Typography>Address</Typography>
                <Typography>NYC</Typography>
              </div>
            </div>
          </div>

          <div>
            <Typography variant="h5">Prescription History</Typography>
            <div className="w-full flex justify-between mt-4">
              <Typography variant="h6" className="w-full">
                Diagnoses
              </Typography>
              <Typography variant="h6" className="w-full">
                Patient
              </Typography>
              <Typography variant="h6" className="w-full">
                Volume
              </Typography>
              <Typography variant="h6" className="w-full">
                Date
              </Typography>
            </div>
            {getPatientsPrescription(holdIdDispense?.calories)?.map((e) => (
              <div className="flex justify-between p-2">
                <Typography variant="" className="w-full">
                  {e?.diagnosis}
                </Typography>
                <Typography variant="" className="w-full">
                  {getName(e?.patientId)}
                </Typography>
                <Typography variant="" className="w-full">
                  {e?.volumePrescribed}
                </Typography>
                <Typography variant="" className="w-full">
                  {moment(e?.dateOfPrescription).format("ll")}
                </Typography>

                <Add
                  className="w-[30px] cursor-pointer"
                  onClick={() => {
setOpenDispensedVolume(!openDispensedVolume);
setHoldPrescribedInfo(e);
                  }
                    
                    }
                />
              </div>
            ))}
          </div>

          {openDispensedVolume && (
            <TextField onChange={(e)=>setVolumeDispensed(+e.target.value)} name="volumeDispensed" />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {volumeDispensed && <Button onClick={ridersUnderCompanyR}>Dispense</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
