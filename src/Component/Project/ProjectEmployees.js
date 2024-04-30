import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import {  FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';


const ProjectEmployees = () => {
    const [projectEmpObj, setProjectEmpObj] = useState({
        "projectEmpId": 0,
        "employeeId": 0,
        "projectId": 0,
        "addedDate": ""
    });
    const [allEmployee, setAllEmployee] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [allProjjectEmployees, setAllProjjectEmployees] = useState([]);


    useEffect(() => {
        getAllEmp();
        getAllProjects();
        getAllEmpWorkOnProject();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectEmpObj((prevObj) => ({ ...prevObj, [name]: value }));
    };



    const getAllEmp = async () => {
        try {
            const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllEmployee', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setAllEmployee(response.data.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const getAllEmpWorkOnProject = async () => {
        try {
            const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllProjectsEmployees', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setAllProjjectEmployees(response.data.data);
        } catch (error) {
            console.error('Error fetching employees working on projects:', error);
        }
    };

    const getAllProjects = async () => {
        try {
            const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllClientProjects', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            setAllProjects(response.data.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleSave = async () => {
        if (IsValidate()) {
            try {
                debugger;
                const response = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/AddEmployeeToProject", projectEmpObj, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                    }
                });
                debugger;
                if (response.data.result) {
                    toast.success("Data Inserted Successfully");
                    handleReset();
                    getAllEmpWorkOnProject();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('Error saving data:', error);
            }
        }
    };

  

    const handleDeleteData = async (id) => {
        debugger;
        try {
            const response = await axios.delete(`https://freeapi.gerasim.in/api/ClientStrive/DeleteEmployeeFromProject?projectEmpId=${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            if (response.data.result) {
                Swal.fire(
                    'Error!',
                    response.data.data,
                    'error'
                );
                getAllEmpWorkOnProject();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleReset = () => {
        setProjectEmpObj({
            "projectEmpId": 0,
            "employeeId": 0,
            "projectId": 0,
            "addedDate": ""
        });
    };

    const IsValidate = () => {
        let isProceed = true;
        let errorMessage = "Please enter/select a value for ";

        // Check if employeeId is selected
        if (projectEmpObj.employeeId === '' || projectEmpObj.employeeId === null) {
            isProceed = false;
            errorMessage += 'Employee, ';
        }

        // Check if projectId is selected
        if (projectEmpObj.projectId === '' || projectEmpObj.projectId === null) {
            isProceed = false;
            errorMessage += 'Project, ';
        }

        // Check if addedDate is selected
        if (projectEmpObj.addedDate === '' || projectEmpObj.addedDate === null) {
            isProceed = false;
            errorMessage += 'Added Date, ';
        }

        if (!isProceed) {
            toast.warning(errorMessage.slice(0, -2)); // Remove the trailing comma and space
        }

        return isProceed;
    };


    return (
        <>

            <div className='row'>
                <div className="col-5 offset-1">
                    <div className="card bg-light">
                        <div className="crad-header bg-info p-2">
                            <h4 className='text-center'>Project Lead Employees</h4>
                        </div>
                        <div className="card-body">
                            <table className='table table-bordered '>
                                <thead>
                                    <tr>
                                        <th>Employee Name</th>
                                        <th>Project Name</th>
                                        <th>Added Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allProjjectEmployees.map((item) => {
                                            return (
                                                <tr>
                                                    <td>{item.empName}</td>
                                                    <td>{item.projectName}</td>
                                                    <td>{item.addedDate}</td>
                                                    <td>
                                                        <button className='btn btn-danger' onClick={() => handleDeleteData(item.projectEmpId)}><FaTrash style={{ marginRight: '5px' }} />Delete</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='col-5'>
                    <div className="card bg-light">
                        <div className="card-header bg-info p-2">
                            <h4 className=' text-center'>Project Employee Form</h4>
                        </div>
                        <div className="card-body">
                            <Row>
                                <Col>
                                    <Form.Group controlId="projectDetails">
                                        <Form.Label>Select Employees</Form.Label>
                                        <select className='form-select' name="employeeId" value={projectEmpObj.employeeId} onChange={handleChange}>
                                            <option value="">Select Employee</option>
                                            {allEmployee.map((emp) => (
                                                <option key={emp.empId} value={emp.empId}>
                                                    {emp.empName}
                                                </option>
                                            ))}
                                        </select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="clientId">
                                        <Form.Label>Project Name</Form.Label>
                                        <select className='form-select' name="projectId" value={projectEmpObj.projectId} onChange={handleChange}>
                                            <option value="">Select Project</option>
                                            {allProjects.map((project) => (
                                                <option key={project.clientProjectId} value={project.clientProjectId}>
                                                    {project.projectName}
                                                </option>
                                            ))}
                                        </select>

                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="addedDate">
                                        <Form.Label>Added Date</Form.Label>
                                        <Form.Control type="datetime-local" name="addedDate" value={projectEmpObj.addedDate} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col>

                                    <Button variant="primary" type="submit" className='mx-2' onClick={handleSave}>
                                        Submit
                                    </Button>

                                    <Button variant="danger" onClick={handleReset}>
                                        Reset
                                    </Button>

                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default ProjectEmployees;
