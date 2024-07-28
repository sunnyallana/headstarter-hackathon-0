import CalendarComponent from "./CalenderComponent";
import ChatComponent from "./ChatComponent";

const MainComponent = () => {
    return (
        <div className="main-component">
            <h1 className="calender-h1" style={{ marginTop: '10%', textAlign: 'center'}}>ACTIVITIES VIEW</h1>
            <CalendarComponent />
            <h1 className="calender-h1" style={{ marginTop: '10%', textAlign: 'center', marginBottom: '-10%'}}>AI CHAT BOT</h1>
            <ChatComponent />
        </div>
    );
}

export default MainComponent;