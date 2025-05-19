/**
 * WebSocket connection utility for real-time updates
 */

// Create a WebSocket connection
export const createWebSocketConnection = () => {
  // Determine the WebSocket protocol based on the current URL
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  
  // For local development, use localhost:5000
  // For production, use the current hostname
  const host = process.env.NODE_ENV === 'production' 
    ? window.location.host 
    : 'localhost:5000';
    
  // Create the WebSocket URL
  const wsUrl = `${protocol}//${host}/ws`;
  
  // Create and return the WebSocket connection
  const socket = new WebSocket(wsUrl);
  
  // Set up event handlers
  socket.addEventListener('open', () => {
    console.log('WebSocket Connected');
  });
  
  socket.addEventListener('message', (event) => {
    try {
      // Parse the message data
      const data = JSON.parse(event.data);
      
      // Handle different message types
      if (data.type === 'connection_established') {
        console.log('WebSocket connected for real-time inventory');
      }
      
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });
  
  socket.addEventListener('error', (error) => {
    console.log('WebSocket error:', error);
  });
  
  socket.addEventListener('close', () => {
    console.log('WebSocket disconnected, will try to reconnect...');
    
    // Attempt to reconnect after a delay
    setTimeout(() => {
      createWebSocketConnection();
    }, 5000);
  });
  
  return socket;
};

// Function to send messages through the WebSocket
export const sendWebSocketMessage = (socket, message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
    return true;
  }
  return false;
};

// Export a singleton WebSocket instance
let socketInstance = null;

export const getWebSocketInstance = () => {
  if (!socketInstance) {
    socketInstance = createWebSocketConnection();
  }
  return socketInstance;
};