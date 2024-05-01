import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash , FaEye} from "react-icons/fa";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allClients, setAllClients] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [formData, setFormData] = useState({
    clientProjectId: 0,
    projectName: "",
    startDate: "",
    expectedEndDate: "",
    leadByEmpId: 0,
    completedDate: "",
    contactPerson: "",
    contactPersonContactNo: "",
    totalEmpWorking: "",
    projectCost: "",
    projectDetails: "",
    contactPersonEmailId: "",
    clientId: "",
  });
  console.log(formData);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAllClients();
    getAllProjects();
    getAllEmployees();
  }, []);

  const getAllClients = async () => {
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllClients",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setAllClients(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const getAllProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllClientProjects",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setAllProjects(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const getAllEmployees = async () => {
    try {
      const response = await axios.get(
        "https://freeapi.gerasim.in/api/ClientStrive/GetAllEmployee",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setAllEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSave = async () => {
    if (IsValidate()) {
      try {
        const response = await axios.post(
          "https://freeapi.gerasim.in/api/ClientStrive/AddUpdateClientProject",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
          }
        );
        if (response.data.result) {
          toast.success("Project added successfully");
          handleReset();
          handleCloseModal();
        } else {
          toast.error(response.data.message);
        }
        getAllProjects();
      } catch (error) {
        console.error("Error adding project:", error);
        toast.error("Error adding project");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        "https://freeapi.gerasim.in/api/ClientStrive/AddUpdateClientProject",
        formData
      );
      if (response.data.result) {
        toast.success("Project added successfully");
        handleReset();
        handleCloseModal();
        getAllProjects();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Error adding project");
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this project!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmation.isConfirmed) {
        const response = await axios.delete(
          `https://freeapi.gerasim.in/api/ClientStrive/DeleteProjectByProjectId?projectId=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
            },
          }
        );
        if (response.data.result) {
          Swal.fire("Error!", response.data.data, "error");
          getAllProjects();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project");
    }
  };

  const handleEdit = async (projectId) => {
    debugger;
    try {
      const response = await axios.get(
        `https://freeapi.gerasim.in/api/ClientStrive/GetProjectByProjectId?clientProjectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          },
        }
      );
      setFormData(response.data.data);
      handleShowModal();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project");
    }
  };

  const handleView = (projectId) => {

    navigate(`/projectDetails/${projectId}`);
  }

  const handleReset = () => {
    setFormData({
      clientProjectId: 0,
      projectName: "",
      startDate: "",
      expectedEndDate: "",
      leadByEmpId: "",
      completedDate: "",
      contactPerson: "",
      contactPersonContactNo: "",
      totalEmpWorking: "",
      projectCost: "",
      projectDetails: "",
      contactPersonEmailId: "",
      clientId: "",
    });
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const IsValidate = () => {
    let isProceed = true;
    let errorMessage = "Please enter the value in ";

    if (formData.projectName.trim() === "") {
      isProceed = false;
      errorMessage += "Project Name, ";
    }
    if (formData.startDate.trim() === "") {
      isProceed = false;
      errorMessage += "Start Date, ";
    }
    if (formData.expectedEndDate.trim() === "") {
      isProceed = false;
      errorMessage += "Expected End Date, ";
    }
    if (formData.contactPerson.trim() === "") {
      isProceed = false;
      errorMessage += "Contact Person, ";
    }
    if (formData.contactPersonContactNo.trim() === "") {
      isProceed = false;
      errorMessage += "Contact Person Contact No, ";
    }
    if (formData.contactPersonEmailId.trim() === "") {
      isProceed = false;
      errorMessage += "Contact Person Email, ";
    } else {
      // Check for valid email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.contactPersonEmailId)) {
        isProceed = false;
        errorMessage += "Valid Contact Person Email, ";
      }
    }

    if (!isProceed) {
      toast.warning(errorMessage.slice(0, -2)); // Remove the trailing comma and space
    }

    return isProceed;
  };

  return (
    <>
      <div className="row">
        <div className="col-10 offset-1">
          <div className="card bg-light">
            <div className="card-header bg-info">
              <div className="row mt-2">
                <div className="col-md-10 text-center ">
                  <h4 className="text-start">Get All Project Details</h4>
                </div>
                <div className="col-md-2 text-end">
                  <Button variant="success" onClick={handleShowModal}>
                    <FaPlus />
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-bordered ">
                <thead>
                  <tr>
                    <th>Sr.No</th>
                    <th>Project </th>
                    <th>Client </th>
                    <th>Employee </th>
                    <th>Employee EmailId</th>
                    {/* <th>Employee Designation</th> */}
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: 200 }}
                    >
                      <Button variant="primary" disabled>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>
                    </div>
                  ) : (
                    <>
                      {allProjects.map((project, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{project.projectName}</td>
                          <td>{project.clientName}</td>
                          <td>{project.empName}</td>
                          <td>{project.empEmailId}</td>
                          {/* <td>{project.empDesignation}</td> */}
                          <td>{project.startDate.split("T")[0]}</td>
                          <td>{project.expectedEndDate.split("T")[0]}</td>
                          <td>
                            <button
                              className="btn btn-col-1 btn-primary mx-2"
                              onClick={() =>
                                handleView(project.clientProjectId)
                              }
                            >
                              <FaEye />
                            </button>
                            <button
                              className="btn btn-col-1 btn-primary mx-2"
                              onClick={() =>
                                handleEdit(project.clientProjectId)
                              }
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-col-1 btn-danger mx-2"
                              onClick={() =>
                                handleDelete(project.clientProjectId)
                              }
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="projectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="expectedEndDate">
                  <Form.Label>Expected End Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="expectedEndDate"
                    value={formData.expectedEndDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="leadByEmpId">
                  <Form.Label>Lead By Employee ID</Form.Label>
                  <select
                    className="form-select"
                    name="leadByEmpId"
                    value={formData.leadByEmpId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Employee</option>

                    {allEmployees.map((emp) => {
                      return (
                        <option key={emp.empId} value={emp.empId}>
                          {emp.empName}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="completedDate">
                  <Form.Label>Completed Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="completedDate"
                    value={formData.completedDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contactPerson">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="contactPersonContactNo">
                  <Form.Label>Contact Person Contact No</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPersonContactNo"
                    value={formData.contactPersonContactNo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contactPersonEmailId">
                  <Form.Label>Contact Person Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactPersonEmailId"
                    value={formData.contactPersonEmailId}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="totalEmpWorking">
                  <Form.Label>Total EmpWorking</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalEmpWorking"
                    value={formData.totalEmpWorking}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="projectCost">
                  <Form.Label>Project Cost</Form.Label>
                  <Form.Control
                    type="number"
                    name="projectCost"
                    value={formData.projectCost}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="projectDetails">
                  <Form.Label>Project Details</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectDetails"
                    value={formData.projectDetails}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="clientId">
                  <Form.Label>Client Name</Form.Label>
                  <select
                    className="form-select"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Client</option>
                    {allClients.map((client) => {
                      return (
                        <option key={client.clientId} value={client.clientId}>
                          {client.companyName}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {formData.clientProjectId === 0 && (
            <Button variant="primary" className="mx-2" onClick={handleSave}>
              {loading ? "Saving..." : "Submit"}
            </Button>
          )}
          {formData.clientProjectId !== 0 && (
            <Button variant="warning" className="mx-2" onClick={handleUpdate}>
              {loading ? "Saving..." : "Update"}
            </Button>
          )}
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Project;
