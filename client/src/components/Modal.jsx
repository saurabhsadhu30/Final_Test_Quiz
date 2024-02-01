import ReactDOM from "react-dom";

import classes from "./Modal.module.css";

function Modal({ className = "modal-md", children }) {
  const component = (
    <div className={classes["modal-container"]}>
      <div className={`${classes["modal"]} ${classes[className]}`}>
        <div className={classes["modal-body"]}>{children}</div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(component, document.getElementById("modal"));
}

export default Modal;
