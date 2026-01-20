import * as API from './api.js';
import { detectOTP, isLikelyOTP } from './otp.js';
import * as Storage from './storage.js';

// Application State
const state = {
    account: null, // { address, password, token, id }
    domains: [],
    selectedDomain: null,
    emails: [],
    currentEmail: null,
    autoRefresh: true,
    refreshInterval: null,
    timerInterval: null,
    expiryTime: 600, // 10 minutes in seconds
    filter: 'all',
    searchQuery: '',
    isOnline: navigator.onLine
};

// DOM Elements
const dom = {
    splash: document.getElementById('splash'),
    app: document.getElementById('app'),
    emailAddress: document.getElementById('emailAddress'),
    copyBtn: document.getElementById('copyBtn'),
    expiryTimer: document.getElementById('expiryTimer'),
    emailStatus: document.getElementById('emailStatus'),
    networkStatus: document.getElementById('networkStatus'),
    refreshToggle: document.getElementById('refreshToggle'),
    themeBtn: document.getElementById('themeBtn'),
    themeIcon: document.getElementById('themeIcon'),
    newEmailBtn: document.getElementById('newEmailBtn'),
    domainBtn: document.getElementById('domainBtn'),
    searchInput: document.getElementById('searchInput'),
    refreshBtn: document.getElementById('refreshBtn'),
    inboxList: document.getElementById('inboxList'),
    emptyState: document.getElementById('emptyState'),
    loadingState: document.getElementById('loadingState'),
    mainView: document.getElementById('mainView'),
    detailView: document.getElementById('detailView'),
    backBtn: document.getElementById('backBtn'),
    deleteEmailBtn: document.getElementById('deleteEmailBtn'),
    detailSubject: document.getElementById('detailSubject'),
    detailAvatar: document.getElementById('detailAvatar'),
    detailFrom: document.getElementById('detailFrom'),
    detailTime: document.getElementById('detailTime'),
    emailFrame: document.getElementById('emailFrame'),
    otpBanner: document.getElementById('otpBanner'),
    otpCode: document.getElementById('otpCode'),
    copyOtpBtn: document.getElementById('copyOtpBtn'),
    attachmentSection: document.getElementById('attachmentSection'),
    attachmentList: document.getElementById('attachmentList'),
    statsBtn: document.getElementById('statsBtn'),
    statsModal: document.getElementById('statsModal'),
    domainModal: document.getElementById('domainModal'),
    domainList: document.getElementById('domainList'),
    toastContainer: document.getElementById('toastContainer'),
    statTotal: document.getElementById('statTotal'),
    statUnread: document.getElementById('statUnread'),
    statOTP: document.getElementById('statOTP'),
    modalStatTotal: document.getElementById('modalStatTotal'),
    modalStatUnread: document.getElementById('modalStatUnread'),
    modalStatOTP: document.getElementById('modalStatOTP'),
    modalStatDomain: document.getElementById('modalStatDomain'),
    modalStatRefresh: document.getElementById('modalStatRefresh')
};

// Utilities
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    dom.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function setLoading(isLoading) {
    if (isLoading) {
        dom.loadingState.classList.remove('hidden');
    } else {
        dom.loadingState.classList.add('hidden');
    }
}

// Theme Management
function initTheme() {
    const saved = Storage.loadFromLocal('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        dom.themeIcon.textContent = 'light_mode';
    } else {
        document.documentElement.classList.remove('dark');
        dom.themeIcon.textContent = 'dark_mode';
    }
    Storage.saveToLocal('theme', theme);
}

function toggleTheme() {
    const current = Storage.loadFromLocal('theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    showToast(`Theme: ${next} mode`, 'info');
}

// Network Status
function updateNetworkStatus() {
    state.isOnline = navigator.onLine;
    const icon = dom.networkStatus.querySelector('.material-symbols-outlined');
    
    if (state.isOnline) {
        dom.networkStatus.classList.add('online');
        dom.networkStatus.classList.remove('offline');
        icon.textContent = 'wifi';
        dom.networkStatus.title = 'Online';
    } else {
        dom.networkStatus.classList.remove('online');
        dom.networkStatus.classList.add('offline');
        icon.textContent = 'wifi_off';
        dom.networkStatus.title = 'Offline - Using cached data';
        showToast('You are offline', 'warning');
    }
}

// Timer Management
function startExpiryTimer() {
    clearInterval(state.timerInterval);
    state.expiryTime = 600;
    
    state.timerInterval = setInterval(() => {
        state.expiryTime--;
        const minutes = Math.floor(state.expiryTime / 60);
        const seconds = state.expiryTime % 60;
        dom.expiryTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (state.expiryTime <= 0) {
            clearInterval(state.timerInterval);
            dom.emailStatus.innerHTML = '<span class="material-symbols-outlined">error</span> Expired';
            dom.emailStatus.className = 'status-badge status-expired';
            showToast('Email expired! Generate a new one', 'warning');
            stopAutoRefresh();
        }
    }, 1000);
}

// Auto-refresh Management
function startAutoRefresh() {
    if (!state.autoRefresh || !state.isOnline) return;
    
    clearInterval(state.refreshInterval);
    state.refreshInterval = setInterval(() => {
        if (document.visibilityState === 'visible' && state.isOnline) {
            refreshInbox(false);
        }
    }, 10000); // 10 seconds
}

function stopAutoRefresh() {
    clearInterval(state.refreshInterval);
}

function toggleAutoRefresh() {
    state.autoRefresh = !state.autoRefresh;
    Storage.saveToLocal('autoRefresh', state.autoRefresh);
    
    if (state.autoRefresh) {
        startAutoRefresh();
        showToast('Auto-refresh enabled', 'success');
    } else {
        stopAutoRefresh();
        showToast('Auto-refresh disabled', 'info');
    }
    
    updateStats();
}

// Domain Management
async function loadDomains() {
    try {
        state.domains = await API.getDomains();
        state.selectedDomain = state.domains[0] || null;
        renderDomains();
    } catch (error) {
        showToast('Failed to load domains', 'error');
    }
}

function renderDomains() {
    dom.domainList.innerHTML = state.domains.map(domain => `
        <div class="domain-item ${domain === state.selectedDomain ? 'selected' : ''}" 
             data-domain="${escapeHTML(domain.domain)}">
            <div class="domain-name">
                <span class="material-symbols-outlined">public</span>
                @${escapeHTML(domain.domain)}
            </div>
            ${domain === state.selectedDomain ? 
                '<span class="material-symbols-outlined" style="color: var(--accent)">check_circle</span>' : 
                ''}
        </div>
    `).join('');
}

// Email Generation
async function generateNewEmail() {
    if (!state.selectedDomain) {
        showToast('Loading domains...', 'info');
        await loadDomains();
    }
    
    const btn = dom.newEmailBtn;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span>';
    btn.disabled = true;
    
    try {
        // Clear old data
        await Storage.clearCache();
        state.emails = [];
        renderInbox();
        
        // Generate new credentials
        const username = Math.random().toString(36).substring(2, 10);
        const password = Math.random().toString(36).substring(2, 15);
        const address = `${username}@${state.selectedDomain.domain}`;
        
        // Create account
        const accountData = await API.createAccount(address, password);
        const token = await API.getToken(address, password);
        
        state.account = {
            id: accountData.id,
            address,
            password,
            token
        };
        
        // Don't save token to localStorage (it expires anyway)
        Storage.saveToLocal('lastEmail', address);
        
        dom.emailAddress.textContent = address;
        showToast('New email generated!', 'success');
        
        startExpiryTimer();
        startAutoRefresh();
        await refreshInbox(false);
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

// Inbox Management
async function refreshInbox(showLoading = true) {
    if (!state.account || !state.account.token) return;
    
    if (showLoading) setLoading(true);
    
    try {
        const messages = await API.getMessages(state.account.token);
        
        // Merge with cached data
        const cached = await Storage.getCachedEmails();
        const seenIds = new Set(cached.filter(e => e.seen).map(e => e.id));
        
        state.emails = messages.map(msg => ({
            ...msg,
            seen: seenIds.has(msg.id) || false
        }));
        
        await Storage.cacheEmails(state.emails);
        renderInbox();
        updateStats();
        
        if (!showLoading && messages.length > cached.length) {
            showToast('New email received!', 'info');
        }
        
    } catch (error) {
        if (error.message === 'UNAUTHORIZED') {
            showToast('Session expired. Generate new email.', 'warning');
            stopAutoRefresh();
        } else if (!state.isOnline) {
            // Load from cache when offline
            const cached = await Storage.getCachedEmails();
            state.emails = cached;
            renderInbox();
            updateStats();
        } else {
            showToast('Failed to refresh inbox', 'error');
        }
    } finally {
        if (showLoading) setLoading(false);
    }
}

// Inbox Rendering
function renderInbox() {
    let filtered = state.emails;
    
    // Apply search
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(email => 
            (email.from.name || email.from.address).toLowerCase().includes(query) ||
            (email.subject || '').toLowerCase().includes(query) ||
            (email.intro || '').toLowerCase().includes(query)
        );
    }
    
    // Apply filter
    switch (state.filter) {
        case 'unread':
            filtered = filtered.filter(e => !e.seen);
            break;
        case 'otp':
            filtered = filtered.filter(e => isLikelyOTP(e));
            break;
        case 'today':
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            filtered = filtered.filter(e => new Date(e.createdAt) >= today);
            break;
    }
    
    if (filtered.length === 0) {
        dom.emptyState.classList.remove('hidden');
        dom.inboxList.classList.add('hidden');
    } else {
        dom.emptyState.classList.add('hidden');
        dom.inboxList.classList.remove('hidden');
        
        dom.inboxList.innerHTML = filtered.map(email => {
            const hasOTP = isLikelyOTP(email);
            return `
                <div class="email-item ${!email.seen ? 'unread' : ''}" data-id="${email.id}">
                    <div class="email-item-header">
                        <div class="email-sender">
                            ${!email.seen ? '<span class="unread-dot"></span>' : ''}
                            <span>${escapeHTML(email.from.name || email.from.address)}</span>
                        </div>
                        <div class="email-time">${formatDate(email.createdAt)}</div>
                    </div>
                    <div class="email-subject">
                        ${escapeHTML(email.subject || 'No Subject')}
                        ${hasOTP ? '<span class="otp-badge">🔐 OTP</span>' : ''}
                    </div>
                    <div class="email-preview">${escapeHTML(email.intro || 'No preview available')}</div>
                </div>
            `;
        }).join('');
    }
}

// Email Detail
async function openEmail(emailId) {
    const email = state.emails.find(e => e.id === emailId);
    if (!email) return;
    
    state.currentEmail = email;
    
    // Mark as seen
    if (!email.seen) {
        email.seen = true;
        await Storage.markAsSeen(emailId);
        renderInbox();
        updateStats();
    }
    
    // Show detail view
    dom.mainView.classList.add('hidden');
    dom.detailView.classList.remove('hidden');
    
    // Fetch full email
    setLoading(true);
    try {
        const fullEmail = await API.getMessage(state.account.token, emailId);
        
        dom.detailSubject.textContent = fullEmail.subject || 'No Subject';
        dom.detailFrom.textContent = fullEmail.from.name || fullEmail.from.address;
        dom.detailTime.textContent = formatDate(fullEmail.createdAt);
        dom.detailAvatar.textContent = (fullEmail.from.name || fullEmail.from.address)[0].toUpperCase();
        
        // Render email body
        const htmlContent = fullEmail.html && fullEmail.html.length > 0 
            ? fullEmail.html[0] 
            : `<pre style="padding: 20px; font-family: system-ui; white-space: pre-wrap;">${escapeHTML(fullEmail.text || 'No content')}</pre>`;
        dom.emailFrame.srcdoc = htmlContent;
        
        // OTP Detection
        const otpResult = detectOTP(fullEmail);
        if (otpResult) {
            dom.otpCode.textContent = otpResult.displayCode;
            dom.otpBanner.classList.remove('hidden');
        } else {
            dom.otpBanner.classList.add('hidden');
        }
        
        // Attachments
        if (fullEmail.attachments && fullEmail.attachments.length > 0) {
            dom.attachmentSection.classList.remove('hidden');
            dom.attachmentList.innerHTML = fullEmail.attachments.map(att => `
                <div class="attachment-item">
                    <span class="material-symbols-outlined">attach_file</span>
                    <span class="attachment-name">${escapeHTML(att.filename)}</span>
                    <span class="attachment-size">${formatFileSize(att.size)}</span>
                </div>
            `).join('');
        } else {
            dom.attachmentSection.classList.add('hidden');
        }
        
    } catch (error) {
        showToast('Failed to load email', 'error');
        closeEmailDetail();
    } finally {
        setLoading(false);
    }
}

function closeEmailDetail() {
    dom.detailView.classList.add('hidden');
    dom.mainView.classList.remove('hidden');
    state.currentEmail = null;
}

async function deleteCurrentEmail() {
    if (!state.currentEmail) return;
    
    try {
        await API.deleteMessage(state.account.token, state.currentEmail.id);
        state.emails = state.emails.filter(e => e.id !== state.currentEmail.id);
        await Storage.cacheEmails(state.emails);
        showToast('Email deleted', 'success');
        closeEmailDetail();
        renderInbox();
        updateStats();
    } catch (error) {
        showToast('Failed to delete email', 'error');
    }
}

// Statistics
function updateStats() {
    const total = state.emails.length;
    const unread = state.emails.filter(e => !e.seen).length;
    const otpCount = state.emails.filter(e => isLikelyOTP(e)).length;
    
    dom.statTotal.textContent = total;
    dom.statUnread.textContent = unread;
    dom.statOTP.textContent = otpCount;
    
    dom.modalStatTotal.textContent = total;
    dom.modalStatUnread.textContent = unread;
    dom.modalStatOTP.textContent = otpCount;
    dom.modalStatDomain.textContent = state.selectedDomain ? `@${state.selectedDomain.domain}` : '-';
    dom.modalStatRefresh.textContent = state.autoRefresh ? 'Enabled' : 'Disabled';
}

// Event Listeners
function setupEventListeners() {
    // Copy email
    dom.copyBtn.addEventListener('click', () => {
        if (!state.account) return;
        navigator.clipboard.writeText(state.account.address)
            .then(() => showToast('Email copied!', 'success'))
            .catch(() => showToast('Failed to copy', 'error'));
    });
    
    // Theme toggle
    dom.themeBtn.addEventListener('click', toggleTheme);
    
    // Auto-refresh toggle
    dom.refreshToggle.addEventListener('click', toggleAutoRefresh);
    
    // New email
    dom.newEmailBtn.addEventListener('click', generateNewEmail);
    
    // Refresh
    dom.refreshBtn.addEventListener('click', () => refreshInbox(true));
    
    // Domain selector
    dom.domainBtn.addEventListener('click', () => {
        dom.domainModal.classList.remove('hidden');
    });
    
    dom.domainList.addEventListener('click', (e) => {
        const item = e.target.closest('.domain-item');
        if (item) {
            const domainName = item.dataset.domain;
            state.selectedDomain = state.domains.find(d => d.domain === domainName);
            renderDomains();
            showToast(`Domain: @${domainName}`, 'info');
        }
    });
    
    // Search
    dom.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderInbox();
    });
    
    // Filter chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            state.filter = e.target.dataset.filter;
            renderInbox();
        });
    });
    
    // Email list click
    dom.inboxList.addEventListener('click', (e) => {
        const item = e.target.closest('.email-item');
        if (item) {
            openEmail(item.dataset.id);
        }
    });
    
    // Detail view
    dom.backBtn.addEventListener('click', closeEmailDetail');
    dom.deleteEmailBtn.addEventListener('click', deleteCurrentEmail);
    
    // Copy OTP
    dom.copyOtpBtn.addEventListener('click', () => {
        const code = dom.otpCode.textContent;
        navigator.clipboard.writeText(code)
            .then(() => showToast('OTP copied!', 'success'))
            .catch(() => showToast('Failed to copy', 'error'));
    });
    
    // Stats modal
    dom.statsBtn.addEventListener('click', () => {
        updateStats();
        dom.statsModal.classList.remove('hidden');
    });
    
    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.dataset.modal;
            if (modal === 'stats') dom.statsModal.classList.add('hidden');
            if (modal === 'domain') dom.domainModal.classList.add('hidden');
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Network status
    window.addEventListener('online', () => {
        updateNetworkStatus();
        showToast('Back online', 'success');
        if (state.autoRefresh) startAutoRefresh();
    });
    
    window.addEventListener('offline', () => {
        updateNetworkStatus();
        stopAutoRefresh();
    });
    
    // Visibility change (pause/resume refresh)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && state.autoRefresh && state.isOnline) {
            refreshInbox(false);
        }
    });
}

// Initialization
async function init() {
    // Initialize storage
    await Storage.initDB();
    
    // Setup
    initTheme();
    updateNetworkStatus();
    setupEventListeners();
    
    // Load settings
    const savedAutoRefresh = Storage.loadFromLocal('autoRefresh');
    if (savedAutoRefresh !== null) {
        state.autoRefresh = savedAutoRefresh;
    }
    
    // Load domains and generate first email
    await loadDomains();
    
    // Hide splash, show app
    setTimeout(() => {
        dom.splash.classList.add('fade-out');
        setTimeout(() => {
            dom.splash.style.display = 'none';
            dom.app.classList.remove('hidden');
        }, 500);
    }, 2000);
    
    // Generate initial email
    await generateNewEmail();
}

// Start app
init();
