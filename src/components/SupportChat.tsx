import React, { useState, useEffect, useRef } from 'react';
import { IonIcon, IonSpinner } from '@ionic/react';
import { close, send, chatbubbleEllipses } from 'ionicons/icons';
import { 
  getCurrentUser,
  sendSupportMessage
} from '../services/api.service';
import './SupportChat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar mensajes ALMACENADOS POR USUARIO (Fix de Privacidad)
  useEffect(() => {
    if (isOpen) {
      const user = getCurrentUser();
      if (user) {
          const storageKey = `support_chat_${user.uid}`;
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            setMessages(JSON.parse(stored));
          } else {
            // Mensaje de bienvenida inicial
            setMessages([{
              id: 'welcome',
              text: '¡Hola! 👋 Soy el soporte de EchoBeat. ¿En qué puedo ayudarte hoy?',
              sender: 'support',
              timestamp: new Date().toISOString()
            }]);
          }
      }
    }
  }, [isOpen]);

  // Guardar mensajes localmente por usuario
  const saveMessages = (newMessages: Message[]) => {
      const user = getCurrentUser();
      if (user) {
          const storageKey = `support_chat_${user.uid}`;
          localStorage.setItem(storageKey, JSON.stringify(newMessages));
      }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const user = getCurrentUser();
    if (!user) return;

    setSending(true);

    const userMsg: Message = {
        id: `msg_${Date.now()}`,
        text: newMessage.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
    };

    // UI Optimistic Update
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setNewMessage('');

    try {
        // Send to Backend API
        await sendSupportMessage({
            userId: user.uid,
            userEmail: user.email || 'anonymous',
            message: userMsg.text
        });
        console.log("✅ Message sent to API successfully");
    } catch (error) {
        console.error("❌ Error sending to API:", error);
        // Save locally is already done by the optimistic update + cache
    } finally {
        setSending(false);
    }
  };

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    try {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="support-chat-overlay" onClick={onClose}>
      <div className="support-chat-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="support-avatar">
              <IonIcon icon={chatbubbleEllipses} />
            </div>
            <div>
              <h3>Soporte EchoBeat</h3>
              <span className="status-online">En línea</span>
            </div>
          </div>
          <button className="close-chat-btn" onClick={onClose}>
            <IonIcon icon={close} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
             {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`message ${msg.sender === 'user' ? 'message-user' : 'message-support'}`}
                >
                  <p>{msg.text}</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
             ))}
             
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            disabled={sending}
          />
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? <IonSpinner name="crescent" style={{ width: 20, height: 20, color: 'white' }} /> : <IonIcon icon={send} />}
          </button>
        </div>

        {/* Email link */}
        <div className="email-link">
          O escríbenos a: <a href="mailto:carojas@sudamericano.edu.ec">carojas@sudamericano.edu.ec</a>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
