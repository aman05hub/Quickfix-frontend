import { useEffect , useState , useRef} from "react";
import { useParams  } from "react-router-dom";
import API from "../services/api";
import io from "socket.io-client";
import axios from "axios";
import "../styles/chat.css";

//Connect socket
const socket = io("https://quickfix-ttla.onrender.com", 
    {
        transports: ["websocket,polling"],
        withCredentials: true,
    }
); 

function ChatPage() {
    const { bookingId } = useParams();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    //Load old messages + socket setup
    useEffect(() => {
        fetchMessages();

        //Join room
        socket.emit("join_room", bookingId);

        //Listen for messages
        socket.on("receive_message", (data) => {
            if(data.bookingId === bookingId) {
                setMessages((prev) => [...prev, data]);
            }
        })

        return () => {
            socket.off("receive_message");
        };
    }, [bookingId]);

    //Fetch messages from DB
    const fetchMessages = async () => {
        try{
            const res = await axios.get(`https://quickfix-ttla.onrender.com/api/chat/${bookingId}`);
            console.log("Chat Data:", res.data);

            setMessages(res.data.messages || []);
        } catch(err) {
            console.log(err);
        }
    };

    //Send message
    const sendMessage = async () => {
        if (!text.trim()) return;

        const messageData = {
            bookingId,
            message: text,
            sender: {
                _id: userId,
            },
        };

        //Real-time send
        socket.emit("send_message", messageData);

        setMessages((prev) => [...prev, messageData]);

        //save in DB
        try{
            await API.post("https://quickfix-ttla.onrender.com/api/chat",{
                bookingId,
                message: text,
            });
        } catch(err){
            console.log(err);
        }

        setText("");
    };

    return (
        <div className="chat-page">

            <div className="chat-header">
                <h3>Live Chat</h3>
            </div>

            <div className="chat-box">
                {Array.isArray(messages) && messages.map((m, index) => (
                    <div
                    key={index}
                    className={
                        m.sender?._id === userId
                        ? "message OWN"
                        : "message"
                    }>
                        <p>{m.message}</p>
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input 
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..." 
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatPage;