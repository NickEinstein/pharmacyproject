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
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
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
import { Add } from "@mui/icons-material";
import { del, get, post } from "services/fetch";
import UserApi from "apis/UserApi";
import { useSnackbar } from "notistack";
// import { LoadingButton } from "@mui/lab";

function createData(name, patient, diagnosis,details, prescription, protein, volumePrescribed) {
  return {
    name,
    patient,
    diagnosis,
    details,
    prescription,
    protein,
    volumePrescribed
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
    id: "patient",
    numeric: false,
    disablePadding: false,
    label: "Patient",
  },
  {
    id: "diagnosis",
    numeric: false,
    disablePadding: false,
    label: "Diagnosis",
  },

  {
    id: "details",
    numeric: false,
    disablePadding: false,
    label: "Details",
  },

  {
    id: "prescription",
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

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
  },

  textMain: {
    margin: 5,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    margin: 10,
    // fontFamily: "Oswald",
  },
});

export default function ListOfMedicines() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("patient");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState(null);
  const [meds, setMeds] = React.useState([null]);
  const [patients, setpatients] = React.useState([null]);
  const [prescribers, setPrescribers] = React.useState([null]);
  const [prescriptions, setPrescriptions] = React.useState([null]);
  const [openPrint, setOpenPrint] = React.useState("");

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

  const [printData, setPrintData] = React.useState({
    Clinicname: "",
    Date: "",
    Patientname: "",
    Medicationname: "",
    instructions: "",
    QuantityPrescribed: "",
    PrescriberName: "",
    warning: `Medication should only be taken for the person whom it was prescribed to
`,
  });

  const rows = prescriptions?.map((e) =>
    createData(
      e?.ssn,
      e?.patientId,
      e?.diagnosis,
      e?.details,
      e?.inventoryId,
      e?.id,
      e?.volumePrescribed
    )
  );

  console.log(rows);
  console.log(prescriptions);

  React.useEffect(() => {
    getPrescribers();
    getPatients();
    getMedicatons();
    getPrescription();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const ridersUnderCompanyR = async (companyId) => {
    console.log(formData);
    const res = await post({
      endpoint: `prescription/prescribe`,
      body: { ...formData },
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
    getPrescription();

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

  function getName(id) {
    let name = patients?.find((e) => e?.id == id);
    console.log(name);

    return name?.patientName;
  }

  function getPrescribedDrugs(id) {
    let name = meds?.find((e) => e?.id == id);
    console.log(name);

    return name?.csName;
  }

  const printItem = (data) => {
    setPrintData({
      ...printData,

      Clinicname: "Great Heights",
      Date: moment(new Date).format("ll"),
      Patientname: getName(data.patient),
      Medicationname: getPrescribedDrugs(data.prescription),
      instructions: data.details,
      diagnosis:data.diagnosis,
      details:data.details,
      QuantityPrescribed: data.volumePrescribed,
      PrescriberName: "Doctor Sam",
      warning: `Medication should only be taken for the person whom it was prescribed to
`,
    });

    // Clinic name
    // Date
    // Patient name
    // Medication name and instructions
    // Quantity prescribed
    // Prescriber’s name
    // And warning:
    // Medication should only be taken for the person whom it was prescribed to

    console.log(data);
    setOpenPrint(true);
  };

  const deleteItem = async (id) => {
    const res = await del({
      endpoint: `prescription/delete-prescription?Id=${id}`,
      //  body: { ...formData },
      // auth: true,
    });
    getPrescription();
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
              Prescriptions
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
              <Typography variant="h6">Prescribe CS</Typography>
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
                      <TableCell align="left">{getName(row.patient)}</TableCell>
                      <TableCell align="left">{row.diagnosis}</TableCell>
                      <TableCell align="left">{row.details}</TableCell>
                      <TableCell align="left">
                        {getPrescribedDrugs(row.prescription)}
                      </TableCell>

                      <TableCell align="right">
                        <DeleteIcon
                          className="cursor-pointer"
                          onClick={() => deleteItem(row.protein)}
                        />
                        <LocalPrintshopIcon
                          className="cursor-pointer"
                          onClick={() => printItem(row)}
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
        <DialogTitle>Prescribe CS</DialogTitle>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Patients</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="patientId"
                  // value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  {patients?.map((e) => (
                    <MenuItem value={e?.id}>{e?.patientName}</MenuItem>
                  ))}
                  {/* <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  CS Medication
                </InputLabel>
                <Select
                  //   labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="inventoryId"
                  // value={age}
                  label="Medication"
                  onChange={handleChange}
                >
                  {meds?.map((e) => (
                    <MenuItem value={e?.id}>{e?.csName}</MenuItem>
                  ))}
                  {/* <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
            </Box>
          </div>

          {/* <Typography variant="h5" className="text-center">{formik?.values?.email_address}</Typography> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <TextField
              onChange={onChange}
              label="Details"
              name="details"
              required
              margin="normal"
              fullWidth
            />
            <TextField
              onChange={onChange}
              label="Diagnosis"
              name="diagnosis"
              required
              margin="normal"
              fullWidth
            />
          </div>
          <TextField
            onChange={onChange}
            required
            margin="normal"
            fullWidth
            placeholder="Amount Prescribed"
            label="Amount Prescribed"
            name="volumePrescribed"
          />
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <TextField
                onChange={onChange}
                required
                //   type="number"
                //   type="number"
                margin="normal"
                fullWidth
                placeholder="ssn"
                label="SSN"
                name="ssn"
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Prescription Date "
                  className="md:mt-4"
                  name=""
                  onChange={(e) => onChange(e, "dateOfPrescription")}
                  // label="Basic example"
                  value={formData.deaNumberExpiryDate}
                  //
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <TextField
                onChange={onChange}
                required
                type="number"
                margin="normal"
                fullWidth
                placeholder="Amount Dispensed"
                label="Amount Dispensed"
                name="volumeDispensed"
              />
            </div>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={ridersUnderCompanyR}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPrint}
        // sx={{ width: "2000px", border: "2px solid red" }}
        maxWidth="lg"
        // fullWidth={true}
        // sx={{width:"2000px", border:'2px solid red'}}
        // TransitionComponent={Transition}
      >
        <DialogTitle>Medicine Label</DialogTitle>
        <DialogContent sx={{ width: "500px" }}>
          <PDFViewer style={{ width: "500px", height: "500px" }}>
            <Document>
              <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.section}>
                  <Text style={styles.title}>Great Heights Medical Center</Text>

                  <Text style={styles.textMain}>
                    Clinicname: {printData.Clinicname}
                  </Text>
                  <Text style={styles.textMain}>Date: {printData.Date}</Text>
                  <Text style={styles.textMain}>
                    Patient name: {printData.Patientname}
                  </Text>

                  <Text style={styles.textMain}>
                    Medication name: {printData.Medicationname}
                  </Text>
                  <Text style={styles.textMain}>
                    diagnosis: {printData.diagnosis}
                  </Text>
                  <Text style={styles.textMain}>
                    instructions: {printData.instructions}
                  </Text>
                  <Text style={styles.textMain}>
                    Quantity Prescribed: {printData.QuantityPrescribed}
                  </Text>
                  <Text style={styles.textMain}>
                    Prescriber Name: {printData.PrescriberName}
                  </Text>
                  <Text style={styles.textMain}>
                    warning: {printData.warning}
                  </Text>
                </View>
              </Page>
            </Document>
          </PDFViewer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenPrint(false);
            }}
          >
            Cancel
          </Button>
          <Button>
            {
              <PDFDownloadLink
                document={
                  <Document>
                    <Page size="A6" orientation="landscape" style={styles.page}>
                      <View style={styles.section}>
                        <Text style={styles.title}>
                          Great Heights Medical Center
                        </Text>

                        <Text style={styles.text}>
                          Clinicname: {printData.Clinicname}
                        </Text>
                        <Text style={styles.text}>Date: {printData.Date}</Text>
                        <Text style={styles.text}>
                          Patient name: {printData.Patientname}
                        </Text>

                        <Text style={styles.text}>
                          Medication name: {printData.Medicationname}
                        </Text>
                        <Text style={styles.text}>
                          diagnosis: {printData.diagnosis}
                        </Text>
                        <Text style={styles.text}>
                          instructions: {printData.instructions}
                        </Text>

                        <Text style={styles.text}>
                          Quantity Prescribed: {printData.QuantityPrescribed}
                        </Text>
                        <Text style={styles.text}>
                          Prescriber Name: {printData.PrescriberName}
                        </Text>
                        <Text style={styles.text}>
                          warning: {printData.warning}
                        </Text>
                      </View>
                    </Page>
                  </Document>
                }
                fileName="somename.pdf"
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Loading document..." : "Download now!"
                }
              </PDFDownloadLink>
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
