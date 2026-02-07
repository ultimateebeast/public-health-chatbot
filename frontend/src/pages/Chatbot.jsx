import { useAuth } from "../hooks/useAuth";
import ChatbotUI from "../components/Chatbot/ChatbotUI";

export default function Chatbot() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return <ChatbotUI />;
}
