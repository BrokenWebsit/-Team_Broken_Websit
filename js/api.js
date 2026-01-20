// Mail.tm API Wrapper with proper error handling
const API_BASE = 'https://api.mail.tm';
const TIMEOUT = 10000;

// Utility: Fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

// Get available domains
export async function getDomains() {
    try {
        const response = await fetchWithTimeout(`${API_BASE}/domains`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        return data['hydra:member'] || [];
    } catch (error) {
        console.error('getDomains error:', error);
        throw new Error('Failed to fetch domains');
    }
}

// Create new account
export async function createAccount(address, password) {
    try {
        const response = await fetchWithTimeout(`${API_BASE}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password })
        });
        
        if (!response.ok) {
            if (response.status === 422) {
                throw new Error('Email already exists');
            }
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('createAccount error:', error);
        throw new Error(error.message || 'Failed to create account');
    }
}

// Get authentication token
export async function getToken(address, password) {
    try {
        const response = await fetchWithTimeout(`${API_BASE}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password })
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid credentials');
            }
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('getToken error:', error);
        throw new Error(error.message || 'Failed to get token');
    }
}

// Get messages (inbox)
export async function getMessages(token) {
    try {
        const response = await fetchWithTimeout(`${API_BASE}/messages?page=1`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401) {
            throw new Error('UNAUTHORIZED');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data['hydra:member'] || [];
    } catch (error) {
        console.error('getMessages error:', error);
        if (error.message === 'UNAUTHORIZED') {
            throw error;
        }
        throw new Error('Failed to fetch messages');
    }
}

// Get single message details
export async function getMessage(token, messageId) {
    try {
        const response = await fetchWithTimeout(`${API_BASE}/messages/${messageId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401) {
            throw new Error('UNAUTHORIZED');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('getMessage error:', error);
        if (error.message === 'UNAUTHORIZED') {
            throw error;
        }
        throw new Error('Failed to fetch message');
    }
}

// Delete message
export async function deleteMessage(token, messageId) {
    try {
        const response = await fetchWithTimeout(`${API_BASE}/messages/${messageId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401) {
            throw new Error('UNAUTHORIZED');
        }
        
        if (!response.ok && response.status !== 204) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('deleteMessage error:', error);
        if (error.message === 'UNAUTHORIZED') {
            throw error;
        }
        throw new Error('Failed to delete message');
    }
}

// Delete account (when generating new email)
export async function deleteAccount(token, accountId) {
    try {
        const response = await fetchWithTimeout(`${API_BASE}/accounts/${accountId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Deletion might return 401 if token expired, which is fine
        if (!response.ok && response.status !== 204 && response.status !== 401) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('deleteAccount error:', error);
        // Non-critical error, we'll generate new email anyway
        return false;
    }
}
