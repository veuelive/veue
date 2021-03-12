export interface ChatMessage {
  id: string;
  message: string;
  userId: string;
  name: string;
  byStreamer: boolean;
  userAvatar: string;
}

export interface RenderChatMessageToString {
  message: ChatMessage;
  isThread: boolean;
  currentUserId: string;
}
