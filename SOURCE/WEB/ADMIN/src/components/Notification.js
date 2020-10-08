import React, { Component } from "react";
import { Modal } from "react-bootstrap";

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
    };
  }
  render() {
    return (
      <div>
        <Modal
          show={this.state.isOpen}
          onHide={() =>
            this.setState({
              isOpen: false,
            })
          }
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          centered
        >
          <Modal.Header className="notify-header">
            <i
              className="fa fa-exclamation-circle notify-icon"
              aria-hidden="true"
            />
          </Modal.Header>
          <Modal.Body className="custom-body">
            <h3>Ooops!</h3>
            <h3>Ooops!</h3>
            <h3>Ooops!</h3>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
