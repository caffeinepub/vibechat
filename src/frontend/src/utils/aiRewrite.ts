/**
 * Client-side text rewriting utilities using deterministic heuristics.
 * No external AI services are used - all processing is done on-device.
 */

export type RewriteMode = 'shorter' | 'friendly' | 'formal';

export interface RewriteResult {
  text: string;
  mode: RewriteMode;
}

/**
 * Rewrite text using simple heuristics based on the selected mode.
 */
export function rewriteText(text: string, mode: RewriteMode): string {
  const trimmed = text.trim();
  
  if (!trimmed) {
    return trimmed;
  }
  
  switch (mode) {
    case 'shorter':
      return makeShorter(trimmed);
    case 'friendly':
      return makeFriendly(trimmed);
    case 'formal':
      return makeFormal(trimmed);
    default:
      return trimmed;
  }
}

/**
 * Make text shorter by removing filler words and simplifying.
 */
function makeShorter(text: string): string {
  let result = text;
  
  // Remove common filler words
  const fillers = [
    /\b(actually|basically|literally|honestly|really|very|quite|just|simply|totally|absolutely)\b/gi,
    /\b(I think that|I believe that|In my opinion,?|It seems that)\b/gi,
    /\b(kind of|sort of|a bit|a little)\b/gi,
  ];
  
  fillers.forEach(pattern => {
    result = result.replace(pattern, '');
  });
  
  // Clean up extra spaces
  result = result.replace(/\s+/g, ' ').trim();
  
  // Remove redundant punctuation
  result = result.replace(/[!]+/g, '!').replace(/[?]+/g, '?');
  
  // If still too long, try to shorten sentences
  if (result.length > 100) {
    const sentences = result.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 1) {
      // Keep first sentence and make it more concise
      result = sentences[0].trim() + '.';
    }
  }
  
  return result;
}

/**
 * Make text more friendly by adding casual language and emojis.
 */
function makeFriendly(text: string): string {
  let result = text;
  
  // Replace formal greetings
  result = result.replace(/\bHello\b/gi, 'Hey');
  result = result.replace(/\bGood morning\b/gi, 'Morning');
  result = result.replace(/\bGood afternoon\b/gi, 'Hey');
  result = result.replace(/\bGood evening\b/gi, 'Hey');
  
  // Replace formal phrases with casual ones
  result = result.replace(/\bI would like to\b/gi, "I'd like to");
  result = result.replace(/\bI am\b/gi, "I'm");
  result = result.replace(/\bdo not\b/gi, "don't");
  result = result.replace(/\bcannot\b/gi, "can't");
  result = result.replace(/\bwill not\b/gi, "won't");
  result = result.replace(/\bshould not\b/gi, "shouldn't");
  result = result.replace(/\bwould not\b/gi, "wouldn't");
  
  // Add friendly punctuation if missing
  if (!result.match(/[!?.]$/)) {
    result += '!';
  }
  
  // Add emoji based on content (simple heuristic)
  const lower = result.toLowerCase();
  if (!result.includes('😊') && !result.includes('👍') && !result.includes('😄')) {
    if (lower.includes('thank') || lower.includes('great') || lower.includes('awesome')) {
      result += ' 😊';
    } else if (lower.includes('yes') || lower.includes('sure') || lower.includes('okay')) {
      result += ' 👍';
    } else if (lower.includes('haha') || lower.includes('lol') || lower.includes('funny')) {
      result += ' 😄';
    }
  }
  
  return result;
}

/**
 * Make text more formal by using complete sentences and formal language.
 */
function makeFormal(text: string): string {
  let result = text;
  
  // Expand contractions
  result = result.replace(/\bI'm\b/gi, 'I am');
  result = result.replace(/\bI'd\b/gi, 'I would');
  result = result.replace(/\bI'll\b/gi, 'I will');
  result = result.replace(/\bdon't\b/gi, 'do not');
  result = result.replace(/\bcan't\b/gi, 'cannot');
  result = result.replace(/\bwon't\b/gi, 'will not');
  result = result.replace(/\bshouldn't\b/gi, 'should not');
  result = result.replace(/\bwouldn't\b/gi, 'would not');
  result = result.replace(/\bcouldn't\b/gi, 'could not');
  result = result.replace(/\bhasn't\b/gi, 'has not');
  result = result.replace(/\bhaven't\b/gi, 'have not');
  result = result.replace(/\bisn't\b/gi, 'is not');
  result = result.replace(/\baren't\b/gi, 'are not');
  result = result.replace(/\bwasn't\b/gi, 'was not');
  result = result.replace(/\bweren't\b/gi, 'were not');
  
  // Replace casual greetings
  result = result.replace(/\bHey\b/gi, 'Hello');
  result = result.replace(/\bHi\b/gi, 'Hello');
  result = result.replace(/\bYo\b/gi, 'Hello');
  
  // Replace casual phrases
  result = result.replace(/\bkinda\b/gi, 'kind of');
  result = result.replace(/\bgonna\b/gi, 'going to');
  result = result.replace(/\bwanna\b/gi, 'want to');
  result = result.replace(/\bgotta\b/gi, 'have to');
  
  // Remove emojis
  result = result.replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Emoticons
  result = result.replace(/[\u{1F300}-\u{1F5FF}]/gu, ''); // Misc Symbols and Pictographs
  result = result.replace(/[\u{1F680}-\u{1F6FF}]/gu, ''); // Transport and Map
  result = result.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ''); // Flags
  result = result.replace(/[\u{2600}-\u{26FF}]/gu, '');   // Misc symbols
  result = result.replace(/[\u{2700}-\u{27BF}]/gu, '');   // Dingbats
  
  // Clean up extra spaces
  result = result.replace(/\s+/g, ' ').trim();
  
  // Ensure proper ending punctuation
  if (!result.match(/[.!?]$/)) {
    result += '.';
  }
  
  // Capitalize first letter
  result = result.charAt(0).toUpperCase() + result.slice(1);
  
  return result;
}

/**
 * Get display name for rewrite mode.
 */
export function getRewriteModeLabel(mode: RewriteMode): string {
  switch (mode) {
    case 'shorter':
      return 'Shorter';
    case 'friendly':
      return 'More friendly';
    case 'formal':
      return 'More formal';
    default:
      return mode;
  }
}
