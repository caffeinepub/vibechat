/**
 * Deterministic smart reply generation using keyword matching and templates.
 * No external AI services are used - all processing is done on-device.
 */

export interface SmartReply {
  text: string;
  id: string;
}

/**
 * Generate 2-4 smart reply suggestions based on the message content.
 * Uses simple keyword matching and templates for deterministic results.
 */
export function generateSmartReplies(messageText: string): SmartReply[] {
  const lowerText = messageText.toLowerCase().trim();
  
  // Question patterns
  if (lowerText.includes('?')) {
    if (lowerText.includes('how are you') || lowerText.includes('how r u')) {
      return [
        { id: '1', text: "I'm doing great, thanks! How about you?" },
        { id: '2', text: "Pretty good! What's up?" },
        { id: '3', text: "All good here! 😊" },
      ];
    }
    
    if (lowerText.includes('what') && (lowerText.includes('doing') || lowerText.includes('up'))) {
      return [
        { id: '1', text: "Not much, just relaxing. You?" },
        { id: '2', text: "Working on some stuff. What about you?" },
        { id: '3', text: "Just chilling! 😎" },
      ];
    }
    
    if (lowerText.includes('where') || lowerText.includes('when') || lowerText.includes('who')) {
      return [
        { id: '1', text: "Let me check and get back to you" },
        { id: '2', text: "I'm not sure, let me find out" },
        { id: '3', text: "Good question! I'll look into it" },
      ];
    }
    
    // Generic question response
    return [
      { id: '1', text: "Yes, definitely!" },
      { id: '2', text: "I think so" },
      { id: '3', text: "Let me think about it" },
      { id: '4', text: "Not sure, what do you think?" },
    ];
  }
  
  // Greeting patterns
  if (lowerText.match(/^(hi|hey|hello|sup|yo|hiya|howdy)/)) {
    return [
      { id: '1', text: "Hey! How's it going?" },
      { id: '2', text: "Hi there! 👋" },
      { id: '3', text: "Hello! What's up?" },
    ];
  }
  
  // Thanks patterns
  if (lowerText.includes('thank') || lowerText.includes('thx') || lowerText.includes('thanks')) {
    return [
      { id: '1', text: "You're welcome! 😊" },
      { id: '2', text: "No problem!" },
      { id: '3', text: "Happy to help!" },
      { id: '4', text: "Anytime!" },
    ];
  }
  
  // Apology patterns
  if (lowerText.includes('sorry') || lowerText.includes('apologize')) {
    return [
      { id: '1', text: "No worries at all!" },
      { id: '2', text: "It's okay, don't worry about it" },
      { id: '3', text: "All good! 👍" },
    ];
  }
  
  // Agreement patterns
  if (lowerText.match(/^(ok|okay|sure|alright|cool|sounds good|got it)/)) {
    return [
      { id: '1', text: "Great! 👍" },
      { id: '2', text: "Awesome!" },
      { id: '3', text: "Perfect!" },
    ];
  }
  
  // Positive sentiment
  if (lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('awesome') || lowerText.includes('nice')) {
    return [
      { id: '1', text: "That's wonderful!" },
      { id: '2', text: "So glad to hear that! 😊" },
      { id: '3', text: "Awesome!" },
    ];
  }
  
  // Negative sentiment
  if (lowerText.includes('bad') || lowerText.includes('terrible') || lowerText.includes('awful') || lowerText.includes('sad')) {
    return [
      { id: '1', text: "I'm sorry to hear that 😔" },
      { id: '2', text: "That's tough. Hope things get better" },
      { id: '3', text: "Sending positive vibes your way" },
    ];
  }
  
  // Meeting/plans patterns
  if (lowerText.includes('meet') || lowerText.includes('hang out') || lowerText.includes('plans')) {
    return [
      { id: '1', text: "Sounds good! When works for you?" },
      { id: '2', text: "I'd love to! Let me check my schedule" },
      { id: '3', text: "Sure! Where should we meet?" },
    ];
  }
  
  // Default fallback suggestions
  return [
    { id: '1', text: "That's interesting!" },
    { id: '2', text: "Tell me more" },
    { id: '3', text: "I see" },
    { id: '4', text: "Got it 👍" },
  ];
}
