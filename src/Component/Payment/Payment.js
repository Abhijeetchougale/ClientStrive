
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const Payment = () => {
    const [ClientProjectList, setClientProjectList] = useState([]);
    const [PaymentList, setPaymentList] = useState([]);
    const [show, setShow] = useState(false);
    const [Paymentobj, setPaymentobj] = useState({
        "projectPaymentId": 0,
        "projectId": 0,
        "paymentDate": "",
        "paymentMode": "",
        "amount": 0,
        "naration": ""
    });

    useEffect(() => {
        getAllPaymentList();
        getAllClientProject();
    }, []);

    const getAllPaymentList = async () => {
        try {
            const response = await axios.get("https://freeapi.gerasim.in/api/ClientStrive/GetAllPayments", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            if (response.data.result === true) {
                setPaymentList(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching payment list:', error);
        }
    };

    

    const getAllClientProject = async () => {
        try {
            const response = await axios.get("https://freeapi.gerasim.in/api/ClientStrive/GetAllClientProjects", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                }
            });
            if (response.data.result === true) {
                setClientProjectList(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching project list:', error);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onEdit = (payment) => {
        setPaymentobj(payment);
        handleShow();
    };

    const onDelete = async (projectPaymentId) => {
        try {

            const response = await axios.delete("https://freeapi.gerasim.in/api/ClientStrive/DeletePaymentByPaymentId?paymentId=" + projectPaymentId,
                {
                    headers: {

                        Authorization: `Bearer ${localStorage.getItem('loginToken')}`
                    }
                });
            if (response.data.result) {
                Swal.fire(
                    'Success!',
                    'PaymentList Deleted Successfully',
                    'success'
                );
                getAllPaymentList();
            } else {
                Swal.fire(
                    'Error!',
                    response.data.message,
                    'error'
                );
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

const handleChange = (event, key) => {
    setPaymentobj(prevObj => ({ ...prevObj, [key]: event.target.value }));
};

const validatePayment = () => {
    if (!Paymentobj.projectId || !Paymentobj.amount || Paymentobj.paymentMode === 0) {
        toast.error('Please fill out all required fields.');
        return false;
    }
    return true;
};
// const validatePayment = () => {
//     if (!Paymentobj.projectName.trim() || !Paymentobj.companyName.trim() || Paymentobj.clientId === 0) {
//         toast.error('Please fill out all required fields.');
//         return false;
//     }
//     return true;
// };
const AddPayment = async () => {
    if (!validatePayment()) {
        return;
    }
    try {
        const response = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/AddUpdatePayment", Paymentobj, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('loginToken')}`
            }
        });
        if (response.data.result) {
            toast.success('Payment Added Successfully');
        } else {
            toast.error(response.data.message);
        }
        getAllPaymentList();
        handleClose();
    } catch (error) {
        console.error('Error adding payment:', error);
        toast.error('Error adding payment');
    }
};

const resetPaymentobj = () => {
    setPaymentobj({
        "projectPaymentId": 0,
        "projectId": 0,
        "paymentDate": "",
        "paymentMode": "",
        "amount": 0,
        "naration": ""
    });
};

const UpdatePayment = async () => {
    if (!validatePayment()) {
        return;
    }
    try {
        const response = await axios.post("https://freeapi.gerasim.in/api/ClientStrive/AddUpdatePayment", Paymentobj, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('loginToken')}`
            }
        });
        if (response.data.result) {
            toast.success('Payment Updated Successfully');
        } else {
            toast.error(response.data.message);
        }
        getAllPaymentList();
        handleClose();
    } catch (error) {
        console.error('Error updating payment:', error);
        toast.error('Error updating payment');
    }
    resetPaymentobj();
    setShow(true);
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
                                <h4>Get All Payment List</h4>
                            </div>
                            <div className="col-md-2">
                                <Button variant="success" className='btn-md m-1 text-right' onClick={handleShow}><FontAwesomeIcon icon={faPlus} /> Add </Button>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Company Name</th>
                                    <th>Payment Date</th>
                                    <th>Payment Mode</th>
                                    <th>Amount</th>
                                    <th>Narration</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PaymentList.map(payment => (
                                    <tr key={payment.projectPaymentId}>
                                        <td>{payment.projectName}</td>
                                        <td>{payment.companyName}</td>
                                        <td>{payment.paymentDate}</td>
                                        <td>{payment.paymentMode}</td>
                                        <td>{payment.amount}</td>
                                        <td>{payment.naration}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                className="btn-sm m-1"
                                                onClick={() => onEdit(payment)}><FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="btn-sm"
                                                onClick={() => onDelete(payment.projectPaymentId)}><FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div className='col-md-12'>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='custom-card-header'>
                    <Modal.Title>
                        {Paymentobj.projectPaymentId === 0 ? <h4>Add PaymentList</h4> : <h4>Update PaymentList</h4>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className='card-body'>
                            <div className='row'>
                                <div className="col-12">
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <label>ProjectId</label>
                                            <select className='form-select' value={Paymentobj.projectId} onChange={(event) => handleChange(event, 'projectId')}>
                                                <option>Select Project</option>
                                                {ClientProjectList.map((project) => (
                                                    <option key={project.clientProjectId} value={project.clientProjectId}>{project.projectName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='col-md-6'>
                                            <label>Payment Date</label>
                                            <input type="Date" className='form-control' value={Paymentobj.paymentDate}
                                                placeholder='Enter date' onChange={(event) => handleChange(event, 'paymentDate')} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <label>Payment Mode</label>
                                            <input type="text" className='form-control' value={Paymentobj.paymentMode}
                                                placeholder='Enter payment mode' onChange={(event) => handleChange(event, 'paymentMode')} />
                                        </div>
                                        <div className='col-md-6'>
                                            <label>Amount</label>
                                            <input type="text" className='form-control' value={Paymentobj.amount}
                                                placeholder='Enter amount' onChange={(event) => handleChange(event, 'amount')} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <label>Naration</label>
                                            <input type="text" className='form-control' value={Paymentobj.naration}
                                                placeholder='Enter naration' onChange={(event) => handleChange(event, 'naration')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        {
                            Paymentobj.projectPaymentId === 0 &&
                            <Button variant='success' onClick={AddPayment}>Add</Button>
                        }
                        {
                            Paymentobj.projectPaymentId !== 0 &&
                            <Button variant='primary' onClick={UpdatePayment}>Update</Button>
                        }
                        <Button variant='dark' className='m-2' onClick={handleClose}>Reset</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
);
};

export default Payment;
