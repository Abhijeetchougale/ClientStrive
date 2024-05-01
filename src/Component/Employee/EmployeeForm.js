import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { CardFooter } from 'react-bootstrap';

const EmployeeForm = () => {
  const { empId } = useParams();
  const [employeeId, setEmployeeId] = useState(empId);
  const [formData, setFormData] = useState({
    roleId: 0,
    userName: '',
    empCode: '',
    empId: 0,
    empName: '',
    empEmailId: '',
    empDesignationId: 0,
    empContactNo: '',
    empAltContactNo: '',
    empPersonalEmailId: '',
    empExpTotalYear: 0,
    empExpTotalMonth: 0,
    empCity: '',
    empState: '',
    empPinCode: '',
    empAddress: '',
    empPerCity: '',
    empPerState: '',
    empPerPinCode: '',
    empPerAddress: '',
    password: '',
    // ErpEmployeeSkills: [{ empSkillId: 0, skill: '', totalYearExp: 0, lastVersionUsed: '' }],
    // ErmEmpExperiences: [{ empExpId: 0, companyName: '', startDate: '', endDate: '', designation: '', projectsWorkedOn: '' }]
  });

  const [errors, setErrors] = useState({
      roleId: null,
    userName: '',
    empCode: '',
    empId: null,
    empName: '',
    empEmailId: '',
    empDesignationId: null,
    empContactNo: '',
    empAltContactNo: '',
    empPersonalEmailId: '',
    empExpTotalYear: null,
    empExpTotalMonth: null,
    empCity: '',
    empState: '',
    empPinCode: '',
    empAddress: '',
    empPerCity: '',
    empPerState: '',
    empPerPinCode: '',
    empPerAddress: '',
    password: '',
  })
  const [rollName, setRollName] = useState([]);
  const [designation, setDesignation] = useState([]);
  const navigate = useNavigate()


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  useEffect(() => {
    getAllRole();
    getAllDesignation();
    // handleUpdate();
    debugger;
    if (empId !== undefined) {
      fetchEmployeeData(empId);
    }

  }, []);

  const fetchEmployeeData = async (empId) => {
    debugger;
    try {
      const response = await axios.get(`https://freeapi.gerasim.in/api/ClientStrive/GetEmployeeByEmployeeId?id=${empId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loginToken')}`
        }
      });

      debugger;

      const employeeData = response.data.data;

      //     debugger;
      setFormData(employeeData);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };



  const getAllRole = async () => {
    debugger;
    try {
      const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllRoles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loginToken')}`
        }
      });
      console.log(response)
      setRollName(response.data.data);


      debugger;
    } catch (error) {
      console.error("Error fetching roles:", error);
      // Handle error
    }
  }

  const getAllDesignation = async () => {
    const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllDesignation', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('loginToken')}`
      }
    });
    console.log(response)
    setDesignation(response.data.data);
  }

  const isEditing = () => {
    return !!empId; // If empId exists, it's in editing mode
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trigger validation
    const isFormValid = validateForm();
    
    // If form is valid, proceed with saving/updating
    if (isFormValid) {
      try {
        if (!isEditing()) {
          // If not in editing mode, call SaveEmployee
          await SaveEmployee();
        } else {
          // If in editing mode, call handleUpdate
          await handleUpdate(empId);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while saving data");
      }
    } else {
      // If form is invalid, display error messages
      console.log('Form validation failed');
      // You can also display a toast or alert here
      // Example: toast.error('Please fill in all required fields.');
    }
  };
  




  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    // Validation for each field
    if (!formData.roleId || typeof formData.roleId !== 'string' || formData.roleId.trim() === '') {
      newErrors.roleId = "Role id is required";
      isValid = false;
    }
    if (!formData.empDesignationId || typeof formData.empDesignationId !== 'string' || formData.empDesignationId.trim() === '') {
      newErrors.empDesignationId = "Designation id is required";
      isValid = false;
    }
    if (!formData.empName || typeof formData.empName !== 'string' || formData.empName.trim() === '') {
      newErrors.empName = "Employee Name is required";
      isValid = false;
    }
    if (!formData.userName || typeof formData.userName !== 'string' || formData.userName.trim() === '') {
      newErrors.userName = "User name is required";
      isValid = false;
    }
    if (!formData.empEmailId || typeof formData.empEmailId !== 'string' || formData.empEmailId.trim() === '') {
      newErrors.empEmailId = "Email id is required";
      isValid = false;
    }
    if (!formData.empContactNo || typeof formData.empContactNo !== 'string' || formData.empContactNo.trim() === '') {
      newErrors.empContactNo = "Employee contact no is required";
      isValid = false;
    }
    if (!formData.empAltContactNo || typeof formData.empAltContactNo !== 'string' || formData.empAltContactNo.trim() === '') {
      newErrors.empAltContactNo = "Employee Alternate contact no is required";
      isValid = false;
    }
    if (!formData.empPersonalEmailId || typeof formData.empPersonalEmailId !== 'string' || formData.empPersonalEmailId.trim() === '') {
      newErrors.empPersonalEmailId = "Employee Personal Email is required";
      isValid = false;
    }
    if (!formData.empExpTotalYear || typeof formData.empExpTotalYear !== 'string' || formData.empExpTotalYear.trim() === '') {
      newErrors.empExpTotalYear = "Employee Total years of experience is required";
      isValid = false;
    }
    if (!formData.empExpTotalMonth || typeof formData.empExpTotalMonth !== 'string' || formData.empExpTotalMonth.trim() === '') {
      newErrors.empExpTotalMonth = "Employee Total months of experience is required";
      isValid = false;
    }
    if (!formData.empCity || typeof formData.empCity !== 'string' || formData.empCity.trim() === '') {
      newErrors.empCity = "Employee city is required";
      isValid = false;
    }
    if (!formData.empState || typeof formData.empState !== 'string' || formData.empState.trim() === '') {
      newErrors.empState = "Employee State is required";
      isValid = false;
    }
    if (!formData.empAddress || typeof formData.empAddress !== 'string' || formData.empAddress.trim() === '') {
      newErrors.empAddress = "Employee Address is required";
      isValid = false;
    }
    if (!formData.empPerCity || typeof formData.empPerCity !== 'string' || formData.empPerCity.trim() === '') {
      newErrors.empPerCity = "Employee Permanent City is required";
      isValid = false;
    }
    if (!formData.empPerState || typeof formData.empPerState !== 'string' || formData.empPerState.trim() === '') {
      newErrors.empPerState = "Employee Permanent State is required";
      isValid = false;
    }
    if (!formData.empPinCode || typeof formData.empPinCode !== 'string' || formData.empPinCode.trim() === '') {
      newErrors.empPinCode = "Employee Pin Code is required";
      isValid = false;
    }
    
    if (!formData.empPerAddress || typeof formData.empPerAddress !== 'string' || formData.empPerAddress.trim() === '') {
      newErrors.empPerAddress = "Employee Permanent Address is required";
      isValid = false;
    }
    if (!formData.password || typeof formData.password !== 'string' || formData.password.trim() === '') {
      newErrors.password = "Password is required";
      isValid = false;
    }
  
    setErrors(newErrors); // Set errors state with newErrors
  
    return isValid; // Return the overall validity
  };
  
  // const handleSkillChange = (index, e) => {
  //   const { name, value } = e.target;
  //   const skills = [...formData.ErpEmployeeSkills];
  //   skills[index][name] = value;
  //   setFormData({
  //     ...formData,
  //     ErpEmployeeSkills: skills
  //   });
  // };

  // const handleExperienceChange = (index, e) => {
  //   const { name, value } = e.target;
  //   const experiences = [...formData.ErmEmpExperiences];
  //   experiences[index][name] = value;
  //   setFormData({
  //     ...formData,
  //     ErmEmpExperiences: experiences
  //   });
  // };

  const SaveEmployee = async () => {
    if (validateForm()) {
      try {
        const result = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/CreateNewEmployee", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('loginToken')}`
          }
        });
  
        if (result.data.result) {
          toast.success("Data saved successfully");
          // Reset form data after saving
          // Optionally, you can redirect the user to another page here
        } else {
          toast.error(result.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while saving data");
      }
    }
  };
  



  const handleUpdate = async (empid) => {
    try {
      const result = await axios.put(
        "https://freeapi.gerasim.in/api/ClientStrive/UpdateEmployee", formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('loginToken')}`
          }
        }
      );
      if (result.data.result) {
        toast.success("Data updated successfully");
        navigate("/employee")
      } else {
        alert(result.data.message);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("An error occurred while updating data");
    }
  };

  const haandleReset = () => {
    setFormData({
      roleId: 0,
      userName: '',
      empCode: '',
      empName: '',
      empEmailId: '',
      empDesignationId: 0,
      empContactNo: '',
      empAltContactNo: '',
      empPersonalEmailId: '',
      empExpTotalYear: 0,
      empExpTotalMonth: 0,
      empCity: '',
      empState: '',
      empPinCode: '',
      empAddress: '',
      empPerCity: '',
      empPerState: '',
      empPerPinCode: '',
      empPerAddress: '',
      password: '',
      // ErpEmployeeSkills: [{ empSkillId: 0, skill: '', totalYearExp: 0, lastVersionUsed: '' }],
      // ErmEmpExperiences: [{ empExpId: 0, companyName: '', startDate: '', endDate: '', designation: '', projectsWorkedOn: '' }]
    });
  }

  return (
    <>
      <div className='mt-2'>
        <Container>
          <Card>
            <Card.Header className="bg-info " >
              <h4 className='text-center'>Employee Form</h4>
            </Card.Header>
            <Card.Body>
              {/* {JSON.stringify(getemp)} */}
              <Form onSubmit={handleSubmit}>
                <Row>

                  <Col>

                    <Form.Group controlId="roleId">
                      <Form.Label>Employee Role:</Form.Label>
                      <select className='form-select' name="roleId" value={formData.roleId} onChange={handleChange}>
                        <option>Seletct role</option>
                        {
                          rollName.map((rol) => {
                            return (
                              <option key={rol.roleId} value={rol.roleId}>{rol.role}</option>
                            )
                          })
                        }
                      </select>
                      {errors.roleId && <p style={{ color: 'red' }}>{errors.roleId}</p>}
                    </Form.Group>

                  </Col>
                  <Col>
                    <Form.Group controlId="empDesignationId">
                      <Form.Label>Employee Designation:</Form.Label>

                      <select className='form-select' name="empDesignationId" value={formData.empDesignationId} onChange={handleChange}>
                        <option>Seletct Designation</option>
                        {designation && designation.length > 0 && designation.map((des) => (
                          <option key={des.designationId} value={des.designationId}>{des.designation}</option>
                        ))}
                      </select>
                      {errors.empDesignationId && <p style={{ color: 'red' }}>{errors.empDesignationId}</p>}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="empContactNo">
                      <Form.Label>Contact No:</Form.Label>
                      <Form.Control type="text" name="empContactNo" value={formData.empContactNo} onChange={handleChange} />
                      <small className="text-danger">{errors.empContactNo}</small>
                    </Form.Group>
                  </Col>
                </Row>
     <Row>
               
  <Col>
    <Form.Group controlId="empAltContactNo">
      <Form.Label>Alternate Contact No:</Form.Label>
      <Form.Control type="text" name="empAltContactNo" value={formData.empAltContactNo} onChange={handleChange} />
      <small className="text-danger">{errors.empAltContactNo}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empPersonalEmailId">
      <Form.Label>Personal Email:</Form.Label>
      <Form.Control type="email" name="empPersonalEmailId" value={formData.empPersonalEmailId} onChange={handleChange} />
      <small className="text-danger">{errors.empPersonalEmailId}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empExpTotalYear">
      <Form.Label>Total Years of Experience:</Form.Label>
      <Form.Control type="number" name="empExpTotalYear" value={formData.empExpTotalYear} onChange={handleChange} />
      <small className="text-danger">{errors.empExpTotalYear}</small>
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col>
    <Form.Group controlId="empExpTotalMonth">
      <Form.Label>Total Months of Experience:</Form.Label>
      <Form.Control type="number" name="empExpTotalMonth" value={formData.empExpTotalMonth} onChange={handleChange} />
      <small className="text-danger">{errors.empExpTotalMonth}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empCity">
      <Form.Label>City:</Form.Label>
      <Form.Control type="text" name="empCity" value={formData.empCity} onChange={handleChange} />
      <small className="text-danger">{errors.empCity}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empState">
      <Form.Label>State:</Form.Label>
      <Form.Control type="text" name="empState" value={formData.empState} onChange={handleChange} />
      <small className="text-danger">{errors.empState}</small>
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col>
  <Form.Group controlId="empPinCode">
  <Form.Label>Pin Code:</Form.Label>
  <Form.Control type="text" name="empPinCode" value={formData.empPinCode} onChange={handleChange} />
  <small className="text-danger">{errors.empPinCode}</small>
</Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empAddress">
      <Form.Label>Address:</Form.Label>
      <Form.Control type="text" name="empAddress" value={formData.empAddress} onChange={handleChange} />
      <small className="text-danger">{errors.empAddress}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empPerCity">
      <Form.Label>Permanent City:</Form.Label>
      <Form.Control type="text" name="empPerCity" value={formData.empPerCity} onChange={handleChange} />
      <small className="text-danger">{errors.empPerCity}</small>
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col>
    <Form.Group controlId="empPerState">
      <Form.Label>Permanent State:</Form.Label>
      <Form.Control type="text" name="empPerState" value={formData.empPerState} onChange={handleChange} />
      <small className="text-danger">{errors.empPerState}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empPerPinCode">
      <Form.Label>Permanent Pin Code:</Form.Label>
      <Form.Control type="text" name="empPerPinCode" value={formData.empPerPinCode} onChange={handleChange} />
      <small className="text-danger">{errors.empPerPinCode}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empPerAddress">
      <Form.Label>Permanent Address:</Form.Label>
      <Form.Control type="text" name="empPerAddress" value={formData.empPerAddress} onChange={handleChange} />
      <small className="text-danger">{errors.empPerAddress}</small>
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col>
    <Form.Group controlId="userName">
      <Form.Label>User Name:</Form.Label>
      <Form.Control type="text" name="userName" value={formData.userName} onChange={handleChange} />
      <small className="text-danger">{errors.userName}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="password">
      <Form.Label>Password:</Form.Label>
      <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
      <small className="text-danger">{errors.password}</small>
    </Form.Group>
  </Col>
  <Col>
    <Form.Group controlId="empEmailId">
      <Form.Label>Email:</Form.Label>
      <Form.Control type="email" name="empEmailId" value={formData.empEmailId} onChange={handleChange} />
      <small className="text-danger">{errors.empEmailId}</small>
    </Form.Group>
  </Col>
</Row>

<Row>
 
</Row>


                {/* ErpEmployeeSkills */}
                {/* {formData.ErpEmployeeSkills.map((skill, index) => (
                <Row key={index}>
                  <Col>
                    <Form.Group controlId={`skill${index}`}>
                      <Form.Label>Skill:</Form.Label>
                      <Form.Control type="text" name="skill" value={skill.skill} onChange={(e) => handleSkillChange(index, e)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`totalYearExp${index}`}>
                      <Form.Label>Total Years of Experience:</Form.Label>
                      <Form.Control type="number" name="totalYearExp" value={skill.totalYearExp} onChange={(e) => handleSkillChange(index, e)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`lastVersionUsed${index}`}>
                      <Form.Label>Last Version Used:</Form.Label>
                      <Form.Control type="text" name="lastVersionUsed" value={skill.lastVersionUsed} onChange={(e) => handleSkillChange(index, e)} />
                    </Form.Group>
                  </Col>
                </Row>
              ))} */}

                {/* ErmEmpExperiences */}
                {/* {formData.ErmEmpExperiences.map((experience, index) => (
                <Row key={index}>
                  <Col>
                    <Form.Group controlId={`companyName${index}`}>
                      <Form.Label>Company Name:</Form.Label>
                      <Form.Control type="text" name="companyName" value={experience.companyName} onChange={(e) => handleExperienceChange(index, e)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`startDate${index}`}>
                      <Form.Label>Start Date:</Form.Label>
                      <Form.Control type="date" name="startDate" value={experience.startDate} onChange={(e) => handleExperienceChange(index, e)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`endDate${index}`}>
                      <Form.Label>End Date:</Form.Label>
                      <Form.Control type="date" name="endDate" value={experience.endDate} onChange={(e) => handleExperienceChange(index, e)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`designation${index}`}>
                      <Form.Label>Designation:</Form.Label>
                      <Form.Control type="text" name="designation" value={experience.designation} onChange={(e) => handleExperienceChange(index, e)} />
                    </Form.Group> */}
                {/* </Col>
                  <Col>
                  <Form.Group controlId={`projectsWorkedOn${index}`}>
                      <Form.Label>ProjectWorkedOn:</Form.Label>
                      <Form.Control type="text" name="projectsWorkedOn" value={experience.projectsWorkedOn} onChange={(e) => handleExperienceChange(index, e)} />
                    </Form.Group>
                  </Col>
                </Row>
              ))} */}

                <CardFooter>
                  <div className='row '>
                    <div className="col-4">
                      {formData.empId === 0 &&

                        <Button variant="primary" type="submit" onClick={SaveEmployee}>Save</Button>
                      }

                      {formData.empId !== 0 &&
                        < Button variant="warning" type="submit" onClick={handleUpdate}>Update</Button>

                      }
                      <Button variant="secondary" type="button" className='mx-2' onClick={haandleReset}>Reset</Button>
                      <Button variant="success" type="button" className='mx-2' onClick={()=>navigate(-1)}>Go To Employee Details</Button>

                    </div>
                  </div>

                </CardFooter>

              </Form>
            </Card.Body>
          </Card>
        </Container >
      </div >
    </>
  );
};

export default EmployeeForm;
