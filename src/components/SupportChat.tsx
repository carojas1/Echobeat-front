import React, { useState, useEffect, useRef } from 'react';
import { IonIcon, IonSpinner } from '@ionic/react';
import { close, send, chatbubbleEllipses } from 'ionicons/icons';
// Firebase auth available for future enhancement
import './SupportChat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: number;
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

  // Cargar mensajes guardados
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('support_chat_messages');
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Mensaje de bienvenida
        const welcome: Message = {
          id: 'welcome',
          text: '¡Hola! 👋 Soy el soporte de EchoBeat. ¿En qué puedo ayudarte hoy?',
          sender: 'support',
          timestamp: Date.now()
        };
        setMessages([welcome]);
      }
    }
  }, [isOpen]);

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem('support_chat_messages', JSON.stringify(msgs));
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);

    // Agregar mensaje del usuario
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      text: newMessage.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setNewMessage('');

    // Simular respuesta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: `reply_${Date.now()}`,
        text: 'Gracias por tu mensaje. Nuestro equipo de soporte lo revisará pronto. También puedes escribirnos directamente a carojas@sudamericano.edu.ec',
        sender: 'support',
        timestamp: Date.now()
      };
      const withReply = [...updatedMessages, autoReply];
      setMessages(withReply);
      saveMessages(withReply);
      setSending(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
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
          {sending && (
            <div className="message message-support typing">
              <IonSpinner name="dots" />
            </div>
          )}
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
            <IonIcon icon={send} />
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
