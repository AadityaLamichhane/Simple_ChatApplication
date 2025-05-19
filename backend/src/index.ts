import { WebSocket  ,  WebSocketServer} from 'ws'
const wss = new  WebSocketServer({port:8080});

type RequestMethod =  {
 type: "join" | "chat",
 payload:{
    roomId: string |  ""
    messege: string | ""
 }  
}
type SocketArr  = {
    roomId : string,
    socket : WebSocket
} 
let socketArr : SocketArr[] = []; 
wss.on("connection",(socket)=>{
    socketArr.push({
        roomId:"" ,
        socket:socket 
    });
    socket.on("message",(messege)=>{
        const stringMessege = messege.toString();

        let actualJson: RequestMethod;
       try {
         actualJson  = JSON.parse(stringMessege);
       }catch(error) {
        console.log("error while getting the data ");
        return
       }
        if(!actualJson){
            console.log("Invalid Input");
            return ; 
        }
       if( actualJson.type == "join"){
        // Socket
        const obtainedObjectindex : number  = socketArr.findIndex((element)=>element.socket==socket) 
        socketArr[obtainedObjectindex].roomId = actualJson.payload.roomId ; 
       } 

       if(actualJson.type =="chat"){
        
            const filteredUser = socketArr.filter((elem)=>elem.socket == socket  
            )
            if(filteredUser[0].roomId ==""){
                console.log("Cannot send messege until entering some room");
                return ; 
            }
            socketArr.forEach((object)=>{
                if( object.roomId == filteredUser[0].roomId){
                    object.socket.send(actualJson.payload.messege);
                }
            })
       }
   }) 
    socket.on("open",()=>{
        socket.send("The chat is open");
    }) ;  
    socket.on("close",()=>{
        socketArr =  socketArr.filter((element)=> { return element.socket != socket} )
        console.log(` Socket array ${socketArr.toString()}`);
    })
})