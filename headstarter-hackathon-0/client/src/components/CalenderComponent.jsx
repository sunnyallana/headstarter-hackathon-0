import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { motion } from 'framer-motion';

const CalendarComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date(2024, 6)); // July 2024
    const [activities, setActivities] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        fetchActivities();
        fetchCalendarEvents();
    }, [currentDate]);

    const fetchActivities = async () => {
        try {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);

            const response = await axios.get('https://headstarter-hackathon-0-b.vercel.app/weeklydata', {
                params: {
                    start_date: startOfWeek.toISOString().split('T')[0],
                    end_date: endOfWeek.toISOString().split('T')[0],
                },
            });

            const formattedActivities = response.data.map(event => ({
                date: event.start_date.split('T')[0],
                title: event.event_name,
                startTime: new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                details: event.details,
                type: event.type, // Added type field
                id: event.event_id,
            }));

            setActivities(formattedActivities);
            console.log(formattedActivities);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const fetchCalendarEvents = async () => {
        try {
            const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/c_bf9b2e848d3f6cb19d8e75fb210a554680303a8cfa5a626f10950801465ae0e2@group.calendar.google.com/events?key=AIzaSyCmO5hd0NfYV0yaePAva9PKhb4_IN1CdB8&maxResults=100');
            const events = response.data.items.map(event => ({
                date: event.start.dateTime.split('T')[0],
                title: event.summary,
                startTime: new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                id: event.id,
            }));
            setCalendarEvents(events);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
        }
    };

    const handleShow = (date) => {
        setSelectedDate(date);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const getEventsForDate = (date) => {
        return [
            ...activities.filter(activity => activity.date === date),
            ...calendarEvents.filter(event => event.date === date)
        ];
    };

    const renderDays = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const calendarDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayStr = date.toISOString().split('T')[0];
            const events = getEventsForDate(dayStr);
            calendarDays.push(
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 0.05,
                    }}
                    key={day}
                    className="calendar-day"
                    onClick={() => events.length > 0 && handleShow(dayStr)}
                >
                    <span>{day}</span>
                    {events.length > 0 && (
                        <span style={{ cursor: 'pointer', fontSize: '0.8rem' }} className="activity-count">
                            {events.length} {events.length === 1 ? 'Activity' : 'Activities'}
                        </span>
                    )}
                </motion.div>
            );
        }
        return calendarDays;
    };

    const selectedDateEvents = getEventsForDate(selectedDate);

    return (
        <section id="activities">
            <div className="calendar-wrapper">
                <motion.div
                    className="calendar-navigation"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <Button
                        style={{ backgroundColor: '#6f42c1', color: '#f8f9fa', border: 'none' }}
                        onClick={handlePrevMonth}
                    >
                        Previous
                    </Button>
                    <span>
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <Button
                        style={{ backgroundColor: '#6f42c1', color: '#f8f9fa', border: 'none' }}
                        onClick={handleNextMonth}
                    >
                        Next
                    </Button>
                </motion.div>

                <div className="calendar-grid">
                    {renderDays()}
                </div>

                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Activities on {selectedDate}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedDateEvents.length === 0 ? (
                            <p>No activities or events for this day.</p>
                        ) : (
                            <ul className="activity-list">
                                {selectedDateEvents.map(event => (
                                    <li key={event.id} className="activity-detail">
                                        <p><strong>Title:</strong> {event.title}</p>
                                        <p><strong>Start Time:</strong> {event.startTime}</p>
                                        <p><strong>End Time:</strong> {event.endTime}</p>
                                        {event.details && <p><strong>Details:</strong> {event.details}</p>}
                                        {event.type && <p><strong>Type:</strong> {event.type}</p>} {/* Added type display */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: '#6f42c1', color: '#f8f9fa' }} variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </section>
    );
};

export default CalendarComponent;
