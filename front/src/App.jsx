import "./app.css";
import { useEffect, useState, useCallback } from "react";
import { categories} from "./fakeData/Data";
import { FaPen, FaTrash } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import moment from "moment/moment";
import { useSocket } from "./hook/useSocket";

const formularioInitialState = {
  title: "",
  description: "",
  category: "",
};

function App() {
  const [notes, setNotes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const { socket } = useSocket("http://localhost:4000");
  const [filterNotes, setFilterNotes] = useState([]);
  const [activateLink, setActiveLink] = useState("");

  // state and functions for modal
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    resetState();
  };
  const handleShow = () => setShow(true);
  // end

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = useCallback(() => {
    socket.on("server:getNotes", (notes) => {
      setNotes(notes);
      setFilterNotes(notes);
      setActiveLink("All Categories");  
    });
  }, []);


  const handleCategory = (category) => {
    category === "All Categories"
      ? setFilterNotes(notes)
      : setFilterNotes(notes.filter((note) => note.category === category));
    setActiveLink(category);
  };

  const actions = (e) => {
    e.preventDefault();
    isEdit
      ? socket.emit("client:updateNote",formulario)
      : socket.emit("client:addNote", formulario);
    resetState();
    handleClose();
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const resetState = () => {
    setFormulario(formularioInitialState);
    setIsEdit(false);
  };

  const clickUpdate = (note) => {
    setFormulario(note);
    setIsEdit(true);
    handleShow();
  };

  const deleteNote = (id) => {
    socket.emit("client:deleteNote", id);
  };

  return (
    <div className="container">
      <div>
        <ul className="nav nav-pills p-3  mb-3 rounded-pill align-items-center">
          {categories.map((category, i) => (
            <li
              className="nav-item"
              key={i}
              onClick={() => handleCategory(category)}
            >
              <a
                className={`nav-link ${category == activateLink && "active"}`}
                href="#"
              >
                {category}
              </a>
            </li>
          ))}

          <li className="nav-item ms-auto">
            <button className="nav-link" onClick={() => handleShow()}>
              <span className="badge rounded-pill text-bg-primary p-3">
                Add Note
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filterNotes.map((item) => (
          <div
            className="col animate__animated animate__jackInTheBox"
            key={item._id}
          >
            <div className="card card-body">
              <div className="d-flex justify-content-between">
                <h5 className="text-truncate w-75 mb-0">{item.title}</h5>
                <i className={`point-${item.category} fa fa-circle`} />
              </div>

              <p className="text-muted">
                {moment(item.hour).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
              <p className="text-muted">{item.description}</p>

              <div className="icons">
                <button className="btn" onClick={() => clickUpdate(item)}>
                  <FaPen />
                </button>
                <button className="btn" onClick={() => deleteNote(item._id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*Start Modal Add note */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          className="bg-primary text-white"
          closeButton
          closeVariant="white"
        >
          <Modal.Title>{isEdit ? "Update note" : "Create Note"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={actions}>
            <Form.Group className="mb-3">
              <Form.Label>Note Title</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                minLength={4}
                placeholder="Title"
                required
                name="title"
                value={formulario.title}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note Description</Form.Label>
              <Form.Control
                as="textarea"
                className="form-control"
                minLength={10}
                placeholder="Description"
                rows={3}
                required
                name="description"
                value={formulario.description}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Form.Select
              className="mb-3"
              value={formulario.category}
              name="category"
              onChange={(e) => handleChange(e)}
              required
            >
              <option value="">Open this select menu</option>
              {/* elimino la opcion All Categories de las opciones, esto lo hago primero filtrando el array categories y el resultado de ese filtro se recorre con el map */}
              {categories
                .filter((category) => category !== "All Categories")
                .map((item, i) => (
                  <option value={item} key={i}>
                    {item}
                  </option>
                ))}
            </Form.Select>

            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/*End Modal Add note */}
    </div>
  );
}

export default App;
