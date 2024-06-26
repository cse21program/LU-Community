import React, { useState } from 'react';
import AdminNavbar from "../../AdminNavbar/AdminNavbar";
import { Card, Col, Container, Form, Row, Table, Modal, Pagination } from "react-bootstrap";
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { StudentAdd } from "../../../../actions/departments";
import { useParams } from "react-router-dom";

const AddSimpleStudent = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const { id } = params;
    const { Types, message } = useSelector(state => state.errors);
    const { departments } = useSelector(state => state.departments);
    const currentDepartment = departments?.filter(department => department._id === id)
    const [data, setData] = useState({});
    const handleSubmit = (e) => {
        e.preventDefault();
        data.department = currentDepartment?.map(department => department.department_name).toString();
        dispatch(StudentAdd(data))
    }

    const [DataSecond, setDataSecond] = useState({ search_id: '', search_name: '', search_semester: '' });
    const handleSubmitSecond = (e) => {
        e.preventDefault();
    }
    const handleChangeSecond = (e) => setDataSecond({ ...DataSecond, [e.target.name]: e.target.value });
    const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let active = 1;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }
    return (
        <div>
            <AdminNavbar />
            <Container>
                <Row className="justify-content-center">
                    <Col md="10">
                        <Card className="bg-light w-100 shadow rounded my-5">
                            <Card.Body className="card-body" onClick={handleShow}>
                                <div className="bgPrimary text-center rounded-3">
                                    <span className="btn w-100 cursor text-white" onClick={handleShow}>Add New Student</span>
                                </div>
                            </Card.Body>
                        </Card>
                        <Modal centered show={show} onHide={handleClose} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Add Student</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleSubmit}>
                                    {Types === 'ADD_STUDENT_ERROR' && (
                                        <h6 style={{ color: 'red' }}>{message}</h6>
                                    )}
                                    <Row>
                                        <Col md="3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="name" placeholder="Name" />
                                                <label>Name</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="number" onChange={handleChange} name="student_id" placeholder="ID" />
                                                <label>ID</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="semester" placeholder="Semester" />
                                                <label>Semester</label>
                                            </Form.Floating>
                                        </Col>
                                        <Col md="3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="gender" placeholder="Gender" />
                                                <label>Gender</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="blood_group" placeholder="Blood Group" />
                                                <label>Blood Group</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="section" placeholder="Section" />
                                                <label>Section</label>
                                            </Form.Floating>
                                        </Col>
                                        <Col md="3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="email" placeholder="Email" />
                                                <label>Email</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="mobile" placeholder="Phone" />
                                                <label>Phone</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="permanent_address" placeholder="Permanent Address" />
                                                <label>Permanent Address</label>
                                            </Form.Floating>
                                        </Col>
                                        <Col md="3">
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="date_of_birth" placeholder="Date Of Birth" />
                                                <label>Date Of Birth</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="religion" placeholder="Religion" />
                                                <label>Religion</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control type="text" onChange={handleChange} name="present_address" placeholder="Present Address" />
                                                <label>Present Address</label>
                                            </Form.Floating>
                                        </Col>
                                    </Row>
                                    <div className="px-3 text-end">
                                        <div>
                                            <input type="submit" value="Add Student" className="btn btn-success" />
                                        </div>
                                    </div>
                                </Form>
                            </Modal.Body>
                        </Modal>
                        <Card className="bg-light w-100 shadow rounded my-5 overflow-scroll">
                            <Card.Title className="p-4 textPrimary">All Students Data</Card.Title>
                            <Form onSubmit={handleSubmitSecond}>
                                <Row className="ps-4 d-flex align-items-start">
                                    <Col md="3">
                                        <Form.Floating className="mb-3">
                                            <Form.Control type="text" onChange={handleChangeSecond} name="search_id" placeholder="Search By ID" />
                                            <label>Search By ID</label>
                                        </Form.Floating>
                                    </Col>
                                    <Col md="3">
                                        <Form.Floating className="mb-3">
                                            <Form.Control type="text" onChange={handleChangeSecond} name="search_name" placeholder="Search By Name" />
                                            <label>Search By Name</label>
                                        </Form.Floating>
                                    </Col>
                                    <Col md="3">
                                        <Form.Floating className="mb-3">
                                            <Form.Control type="text" onChange={handleChangeSecond} name="search_semester" placeholder="Search By Semester" />
                                            <label>Search By Semester</label>
                                        </Form.Floating>
                                    </Col>
                                    <Col md="3">
                                        <div className="mt-1">
                                            <input type="submit" value="Search" className="btn btn-success btn-lg" />
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                            <Card.Body className="card-body">
                                <Row className="d-flex justify-content-center">
                                    <Col md="12">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Department</th>
                                                    <th scope="col">Semester</th>
                                                    <th scope="col">Section</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Phone</th>
                                                    <th scope="col">DOB</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1732020009</td>
                                                    <td>Md Jahed Miah</td>
                                                    <td>CSE</td>
                                                    <td>1</td>
                                                    <td>B</td>
                                                    <td>mdjahedahmed12@gmail.com</td>
                                                    <td>0179713005</td>
                                                    <td>14-02-1998</td>
                                                    <td>Lalabazar, Bishwanath, Sylhet</td>
                                                    <td><FaRegEdit className="fs-5 text-success me-2 cursor" /><FaTrashAlt className="fs-5 text-danger cursor" /></td>
                                                </tr>
                                                <tr>
                                                    <td>1732020009</td>
                                                    <td>Md Jahed Miah</td>
                                                    <td>CSE</td>
                                                    <td>1</td>
                                                    <td>B</td>
                                                    <td>mdjahedahmed12@gmail.com</td>
                                                    <td>0179713005</td>
                                                    <td>14-02-1998</td>
                                                    <td>Lalabazar, Bishwanath, Sylhet</td>
                                                </tr>
                                                <tr>
                                                    <td>1732020009</td>
                                                    <td>Md Jahed Miah</td>
                                                    <td>CSE</td>
                                                    <td>1</td>
                                                    <td>B</td>
                                                    <td>mdjahedahmed12@gmail.com</td>
                                                    <td>0179713005</td>
                                                    <td>14-02-1998</td>
                                                    <td>Lalabazar, Bishwanath, Sylhet</td>
                                                </tr>
                                                <tr>
                                                    <td>1732020009</td>
                                                    <td>Md Jahed Miah</td>
                                                    <td>CSE</td>
                                                    <td>1</td>
                                                    <td>B</td>
                                                    <td>mdjahedahmed12@gmail.com</td>
                                                    <td>0179713005</td>
                                                    <td>14-02-1998</td>
                                                    <td>Lalabazar, Bishwanath, Sylhet</td>
                                                </tr>
                                                <tr>
                                                    <td>1732020009</td>
                                                    <td>Md Jahed Miah</td>
                                                    <td>CSE</td>
                                                    <td>1</td>
                                                    <td>B</td>
                                                    <td>mdjahedahmed12@gmail.com</td>
                                                    <td>0179713005</td>
                                                    <td>14-02-1998</td>
                                                    <td>Lalabazar, Bishwanath, Sylhet</td>
                                                </tr>
                                                <tr>
                                                    <td>1732020009</td>
                                                    <td>Md Jahed Miah</td>
                                                    <td>CSE</td>
                                                    <td>1</td>
                                                    <td>B</td>
                                                    <td>mdjahedahmed12@gmail.com</td>
                                                    <td>0179713005</td>
                                                    <td>14-02-1998</td>
                                                    <td>Lalabazar, Bishwanath, Sylhet</td>
                                                </tr>
                                                <tr>
                                                    <td>1732020009</td>
                                                    <td>Md Jahed Miah</td>
                                                    <td>CSE</td>
                                                    <td>1</td>
                                                    <td>B</td>
                                                    <td>mdjahedahmed12@gmail.com</td>
                                                    <td>0179713005</td>
                                                    <td>14-02-1998</td>
                                                    <td>Lalabazar, Bishwanath, Sylhet</td>
                                                </tr>
                                                <tr>
                                                    <td>1732020009</td>
                                                    <td>Md Jahed Miah</td>
                                                    <td>CSE</td>
                                                    <td>1</td>
                                                    <td>B</td>
                                                    <td>mdjahedahmed12@gmail.com</td>
                                                    <td>0179713005</td>
                                                    <td>14-02-1998</td>
                                                    <td>Lalabazar, Bishwanath, Sylhet</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <div className="row">
                                            <div className="col-md-12 text-end">
                                                <button className="btn btn-success mr-5 rounded-3" href="#">Approve all</button>
                                            </div>
                                        </div>
                                        <Pagination>{items}</Pagination>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AddSimpleStudent;
