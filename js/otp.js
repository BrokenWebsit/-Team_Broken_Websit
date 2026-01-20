// Smart OTP Detection Engine
// Detects various OTP patterns in email text and HTML

const OTP_PATTERNS = [
    // 6-digit codes (most common)
    /\b(\d{6})\b/g,
    // 4-digit codes
    /\b(\d{4})\b/g,
    // 8-digit codes
    /\b(\d{8})\b/g,
    // Codes with spaces: 123 456
    /\b(\d{3}\s\d{3})\b/g,
    // Codes with dashes: 123-456
    /\b(\d{3}-\d{3})\b/g,
    // Mixed alphanumeric: A1B2C3
    /\b([A-Z0-9]{6})\b/g,
];

const OTP_KEYWORDS = [
    'verification code',
    'otp',
    'one-time password',
    'security code',
    'confirmation code',
    'authentication code',
    'access code',
    'verify',
    'two-factor',
    '2fa',
    'pin code',
];

// Extract text from HTML
function extractTextFromHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

// Check if context suggests OTP
function hasOTPContext(text) {
    const lowerText = text.toLowerCase();
    return OTP_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Score potential OTP codes
function scoreCode(code, context) {
    let score = 0;
    
    // Length scoring (6 digits is most common)
    const cleanCode = code.replace(/\s|-/g, '');
    if (cleanCode.length === 6) score += 10;
    else if (cleanCode.length === 4) score += 7;
    else if (cleanCode.length === 8) score += 5;
    else score += 2;
    
    // All digits is strong indicator
    if (/^\d+$/.test(cleanCode)) score += 5;
    
    // Mixed alphanumeric
    if (/^[A-Z0-9]+$/.test(cleanCode) && /[A-Z]/.test(cleanCode) && /\d/.test(cleanCode)) {
        score += 3;
    }
    
    // Context scoring
    const surroundingText = context.toLowerCase();
    if (surroundingText.includes('code')) score += 8;
    if (surroundingText.includes('otp')) score += 10;
    if (surroundingText.includes('verification')) score += 7;
    if (surroundingText.includes('confirm')) score += 5;
    
    return score;
}

// Main OTP detection function
export function detectOTP(email) {
    // Combine subject, text, and HTML
    const subject = email.subject || '';
    const textContent = email.text || '';
    const htmlContent = email.html && email.html.length > 0 
        ? extractTextFromHTML(email.html[0]) 
        : '';
    
    const fullText = `${subject} ${textContent} ${htmlContent}`;
    
    // Check if email likely contains OTP
    if (!hasOTPContext(fullText)) {
        return null;
    }
    
    // Extract all potential codes
    const candidates = [];
    
    for (const pattern of OTP_PATTERNS) {
        const matches = fullText.matchAll(pattern);
        for (const match of matches) {
            const code = match[1];
            // Get surrounding context (50 chars before and after)
            const index = match.index;
            const start = Math.max(0, index - 50);
            const end = Math.min(fullText.length, index + code.length + 50);
            const context = fullText.substring(start, end);
            
            const score = scoreCode(code, context);
            
            candidates.push({
                code,
                score,
                context: context.trim()
            });
        }
    }
    
    // Return highest scoring candidate
    if (candidates.length === 0) return null;
    
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    
    // Require minimum score threshold
    if (best.score < 10) return null;
    
    return {
        code: best.code.replace(/\s|-/g, ''), // Clean format
        displayCode: best.code, // Original format
        confidence: Math.min(100, best.score * 5), // Convert to percentage
        context: best.context
    };
}

// Check if email likely contains OTP (for filtering)
export function isLikelyOTP(email) {
    const subject = (email.subject || '').toLowerCase();
    const intro = (email.intro || '').toLowerCase();
    
    return OTP_KEYWORDS.some(keyword => 
        subject.includes(keyword) || intro.includes(keyword)
    );
}
