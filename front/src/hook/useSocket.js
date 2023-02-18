import { useMemo } from "react";
import { io } from "socket.io-client";

export const useSocket=(server)=>{
    const socket =useMemo(()=>
        io(server, { transports: ["websocket"] })
    ,[server]) 
    return {socket}
}