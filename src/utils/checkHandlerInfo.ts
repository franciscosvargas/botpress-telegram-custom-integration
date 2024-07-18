interface HandlerInfo {
  conversationId: string;
  userId: string;
  messageId: string;
}

export function checkHandlerInfo({ conversationId, userId, messageId}: HandlerInfo) {
  if (!conversationId || !userId || !messageId) {
    throw new Error('Handler não recebeu as informaç˜oes necessárias');
  }
}