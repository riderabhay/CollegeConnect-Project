// client/src/components/VideoCall/VideoWindow.jsx

import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { socket } from "../../socket"; 

// --- Configuration (Server se match hona chahiye) ---
const PEERJS_CONFIG = { 
    host: window.location.hostname,
    port: 3001, 
    path: '/peerjs' 
};

const VideoWindow = ({ userId, roomId, onClose }) => {
    // Refs and States...
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [myPeer, setMyPeer] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [availablePeers, setAvailablePeers] = useState([]); 


    // Effect 1: Get Local Media Stream (Camera/Mic)
    useEffect(() => {
        // 🌟 FIX: Permission maangne ki koshish karein
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            })
            .catch(error => {
                console.error("Error accessing media devices:", error);
                alert("Permission denied. Check your browser settings for camera/mic access.");
            });
    }, []);

    // Effect 2: Initialize PeerJS & Connect to Socket
    useEffect(() => {
        // userId aur localStream milne par hi PeerJS initialize hoga
        if (localStream && !myPeer && userId) { 
            const peer = new Peer(userId, PEERJS_CONFIG); 
            
            peer.on('open', (id) => {
                setMyPeer(peer);
                // Server ko batao ki yeh user is room mein hai
                socket.emit('join_room', roomId, id); 
            });

            // Incoming Call Handler
            peer.on('call', (call) => {
                console.log("Incoming call received. Answering...");
                call.answer(localStream);
                call.on('stream', (remoteStream) => {
                    if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) remoteVideoRef.current.srcObject = remoteStream;
                });
            });

            peer.on('error', (err) => console.error("PeerJS initialization error:", err));

            return () => {
                // Media tracks ko stop karein jab component unmount ho
                if (localStream) localStream.getTracks().forEach(track => track.stop());
                peer.destroy();
            };
        }
    }, [localStream, userId, myPeer, roomId]);


    // 🌟 Call Initiate Karna
    const callUser = (peerIdToCall) => {
        if (!myPeer || !localStream) {
            alert("Connection is not ready or stream is missing.");
            return;
        }

        console.log(`Calling peer: ${peerIdToCall}`);
        const call = myPeer.call(peerIdToCall, localStream);

        call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });

        call.on('close', () => console.log("Call ended."));
    };

    // Socket Listeners for Peer List
    useEffect(() => {
        const handleUserJoined = (peerId) => {
            console.log(`New peer joined: ${peerId}`);
            // Agar naya user aaya hai, toh use available list mein add karo
            setAvailablePeers(prevPeers => [...new Set([...prevPeers, peerId])]); 
        };
        
        socket.on('user_joined', handleUserJoined);
        
        return () => {
            socket.off('user_joined', handleUserJoined);
        };
    }, []);


    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="w-11/12 md:w-3/4 bg-gray-900 p-6 rounded-xl shadow-2xl border-2 border-cyan-500/50">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Live Connection Active</h2>
                
                {/* Peer List and Call Button */}
                <div className="mb-4 text-center">
                    <p className="text-sm text-gray-400">Your Peer ID: {myPeer ? myPeer.id : 'Connecting...'}</p>
                    <h3 className="text-lg mt-2 text-yellow-400">Available Peers ({availablePeers.filter(p => p !== myPeer?.id).length})</h3>
                    
                    {availablePeers.filter(p => p !== myPeer?.id).map(peerId => (
                        <button 
                            key={peerId}
                            onClick={() => callUser(peerId)}
                            className="bg-green-600 p-2 m-1 rounded hover:bg-green-700 text-sm"
                        >
                            Call User: {peerId.substring(0, 8)}...
                        </button>
                    ))}
                    {availablePeers.filter(p => p !== myPeer?.id).length === 0 && <p className='text-gray-500 text-sm mt-2'>Waiting for another user to join the room...</p>}
                </div>
                
                {/* Video Streams */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-2 rounded-lg">
                        <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-auto rounded-md" />
                        <p className="text-sm text-center text-white mt-1">You (Local)</p>
                    </div>
                    <div className="bg-gray-800 p-2 rounded-lg">
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto rounded-md" />
                        <p className="text-sm text-center text-white mt-1">Remote User</p>
                    </div>
                </div>
                
                <button onClick={onClose} className="mt-4 w-full bg-red-600 p-3 rounded-lg hover:bg-red-700">
                    End Call / Close Window
                </button>
            </div>
        </div>
    );
};

export default VideoWindow;