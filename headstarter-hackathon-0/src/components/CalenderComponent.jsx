import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const sampleActivities = [
  { date: '2024-07-01', title: 'Meeting with Team', startTime: '10:00 AM', endTime: '11:00 AM', zoomLink: 'https://zoom.us/j/1234567890', speaker: 'John Doe' },
  { date: '2024-07-02', title: 'Project Presentation', startTime: '02:00 PM', endTime: '03:00 PM', zoomLink: 'https://zoom.us/j/0987654321', speaker: 'Jane Smith' },
];

const CalendarComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleShow = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const renderDays = () => {
    // Create a 2D array for days of the month
    const daysInMonth = new Date(2024, 7, 0).getDate(); // Get number of days in July 2024
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return calendarDays.map((day) => {
      const dateStr = `2024-07-${day.toString().padStart(2, '0')}`;
      const activities = sampleActivities.filter(activity => activity.date === dateStr);

      return (
        <Col xs={6} md={4} lg={3} key={day}>
          <Card className="mb-3" style={{ borderRadius: '15px' }}>
            <Card.Body>
              <Card.Title>July {day}</Card.Title>
              {activities.length ? activities.map((activity, index) => (
                <Card.Text
                  key={index}
                  className="text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleShow(activity)}
                >
                  {activity.title}
                </Card.Text>
              )) : <Card.Text>No Activities</Card.Text>}
            </Card.Body>
          </Card>
        </Col>
      );
    });
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ marginTop: '70px' }}>
      <Row>
        {renderDays()}
      </Row>

      {/* Modal for activity details */}
      {selectedActivity && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedActivity.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Start Time:</strong> {selectedActivity.startTime}</p>
            <p><strong>End Time:</strong> {selectedActivity.endTime}</p>
            <p><strong>Zoom Link:</strong> <a href={selectedActivity.zoomLink} target="_blank" rel="noopener noreferrer">{selectedActivity.zoomLink}</a></p>
            <p><strong>Speaker:</strong> {selectedActivity.speaker}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CalendarComponent;
