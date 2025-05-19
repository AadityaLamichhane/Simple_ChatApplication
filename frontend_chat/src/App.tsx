import { useState , useRef , useEffect  } from 'react'
import './App.css'
function App() {
  const [socket , setSocket] = useState();
  const [ messege , setMessege] = useState([""]);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const inpref = useRef<HTMLInputElement>(null);
  useEffect(()=>{
  const ws = new WebSocket("ws://localhost:8080");
  //@ts-ignore
  setSocket(ws);
  ws.onmessage = (msg)=>{
    setMessege((prevMessage)=>[...prevMessage, msg.data])
  }
  ws.onerror = ((err)=>{
    console.log("Error whiel getting data ",err);
  })
},[]);
const  joinRoom = ()=>{
  // 
  if(!socket){
   return ; 
  }
  const joiningReq = {
    type:"join",
    payload:{
      roomId : roomIdRef.current?.value || ""
    }
  }
    socket.send(JSON.stringify(joiningReq));
}
const  sendMessage = ()=>{
  if(!socket){
    alert("Hey! Not connected to any server ");
    return ; 
    }
    const sendingMessege  = {
      type:"chat",
      payload:{
        messege:inpref.current?.value || "",
      }
    } ;
    //@ts-ignore
    socket.send(JSON.stringify(sendingMessege));
}
  return (
  <>
  <div className='bg-black'>
    <div className='flex flex-col justify-center h-screen'>
      <div className='flex justify-center'>
       <div className=' bg-blue-200 p-2  '>
        <div className='justify-between' >
          <div className='text-white'>
            RoomId : {roomIdRef.current?.value || "" }
          </div>
          <div >
            <input  className={`p-2 `} ref={roomIdRef}  placeholder='Enter Room iD '></input>
            <button className='p-2 '  onClick={joinRoom}>Join Room</button>
          </div>

        </div>
         <div className='h-40'>
           {messege.map((Chunk)=><div>{Chunk}</div>)}          
        </div>
        <div className="flex justify-center">
          <input  className={`p-2 m-2`} ref={inpref} placeholder='Messege'></input>
        </div>
        <div className='flex justify-center'>
            <button  className={"block"} onClick={sendMessage}>Click</button>
        </div>
        </div>
      </div>
    </div>
  </div>
</>
  )
}
export default App
