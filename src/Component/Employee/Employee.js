import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import {FaEdit} from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

const Employee = () => {
  const navigate = useNavigate();
  const [empList, setEmpList] = useState([]);

  useEffect(() => {
    getAllEmp();
  }, [])

  const getAllEmp = async () => {
    try {
      const response = await axios.get('https://freeapi.gerasim.in/api/ClientStrive/GetAllEmployee', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loginToken')}` 
        }
      });
      setEmpList(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }
  
  const handleEditForm = (empId) => {
    // Navigate to the EmployeeForm component with empId as URL parameter
    navigate(`/employee-form/${empId}`);
  };

  const handleAddEmployee = () => {
    navigate('/employee-form');
  };


  const handleDelete = async (empId) => {
    try {
      const result = await axios.delete(
        "https://freeapi.gerasim.in/api/ClientStrive/DeleteEmployeeByEmpId?empId="+empId,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('loginToken')}`
          }
        }
      );
      if (result.data.result) {
        alert("Data deleted successfully");
        // Optionally, you can update the local state or perform any other action upon successful delete
      } else {
        alert(result.data.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("An error occurred while deleting data");
    }
  };
  return (
    <div>
      <div className='row mt-3'>
        <div className='col-md-1'></div>
        <div className='col-md-10'>
          <div className='card bg-light'>
            <div className='card-header bg-info'>
              <div className="row mt-2">
                <div className="col-md-10 text-center">
                  <h4>Get All Employee List</h4>
                </div>
                <div className="col-md-2">
                  <Button variant="success" className='btn-md m-1 text-right' onClick={handleAddEmployee}>  <FaPlus />Add Employee</Button>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>SrNo</th>
                    <th>Name</th>
                    <th>Emp-Code</th>
                    <th>Emp-Email</th>
                    <th>Emp-Designation</th>
                    <th>Emp-Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {empList.map((emp, index) => (
                    <tr key={emp.empId}>
                      <td>{index + 1}</td>
                      <td>{emp.empName}</td>
                      <td>{emp.empCode}</td>
                      <td>{emp.empEmailId}</td>
                      <td>{emp.empDesignation}</td>
                      <td>{emp.role}</td>
                      <td>
                        <button className='btn btn-col-2 btn-primary mx-1' onClick={() => handleEditForm(emp.empId)}> <FaEdit /></button>
                        <button className='btn btn-col-2 btn-danger mx-1' onClick={() => handleDelete(emp.empId)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='col-4'>
        {/* Your content in col-4 */}
      </div>
    </div>
  );
};

export default Employee;
