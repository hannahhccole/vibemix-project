// VibeMix - Playlist Generator App
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc,
    updateDoc,
    query,
    where,
    orderBy 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// State Management
let currentPlaylist = null;
let savedPlaylists = [];
let youtubePlayer = null;
let currentPlayingSong = null;
let currentUser = null;

// DOM Elements
const moodPrompt = document.getElementById('mood-prompt');
const generateBtn = document.getElementById('generate-btn');
const savePlaylistBtn = document.getElementById('save-playlist-btn');
const loadingDiv = document.getElementById('loading');
const playlistContainer = document.getElementById('playlist-container');
const favoritesContainer = document.getElementById('favorites-container');
const songTemplate = document.getElementById('song-template');
const favoritePlaylistTemplate = document.getElementById('favorite-playlist-template');
const audioPlayerModal = document.getElementById('audio-player-modal');
const closePlayerBtn = document.getElementById('close-player');
const playerSongName = document.getElementById('player-song-name');
const playerArtist = document.getElementById('player-artist');

// Auth Elements
const authModal = document.getElementById('auth-modal');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userEmail = document.getElementById('user-email');

// Initialize App
function init() {
    attachEventListeners();
    
    // Listen for auth state changes
    onAuthStateChanged(window.auth, (user) => {
        if (user) {
            currentUser = user;
            authModal.classList.add('hidden');
            userInfo.classList.remove('hidden');
            userEmail.textContent = user.email;
            loadPlaylistsFromFirestore();
        } else {
            currentUser = null;
            authModal.classList.remove('hidden');
            userInfo.classList.add('hidden');
            savedPlaylists = [];
            renderFavorites();
        }
    });
}

// Event Listeners
function attachEventListeners() {
    generateBtn.addEventListener('click', handleGeneratePlaylist);
    savePlaylistBtn.addEventListener('click', handleSavePlaylist);
    closePlayerBtn.addEventListener('click', closeAudioPlayer);
    loginBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignup);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Allow Enter key to generate (with Ctrl/Cmd for new line)
    moodPrompt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            handleGeneratePlaylist();
        }
    });
    
    // Allow Enter in auth form
    authPassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

// Generate Playlist Handler
async function handleGeneratePlaylist() {
    const prompt = moodPrompt.value.trim();
    
    if (!prompt) {
        alert('Please describe your vibe or mood first!');
        return;
    }
    
    // Show loading state
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    loadingDiv.classList.remove('hidden');
    playlistContainer.innerHTML = '<p class="empty-state">Your generated playlist will appear here...</p>';
    savePlaylistBtn.classList.add('hidden');
    
    try {
        // Simulate API call - In production, this would call an AI API
        const playlist = await generatePlaylistFromPrompt(prompt);
        
        // Store current playlist
        currentPlaylist = {
            prompt: prompt,
            songs: playlist,
            createdAt: new Date().toISOString()
        };
        
        // Render playlist
        renderPlaylist(playlist);
        
        // Show save button
        savePlaylistBtn.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error generating playlist:', error);
        playlistContainer.innerHTML = '<p class="empty-state" style="color: #ef4444;">Error generating playlist. Please try again.</p>';
    } finally {
        // Hide loading state
        loadingDiv.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Playlist';
    }
}

// Simulate AI Playlist Generation
// In production, replace this with actual API call to OpenAI, Claude, or music API
async function generatePlaylistFromPrompt(prompt) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Sample playlists based on keywords
    const moodKeywords = prompt.toLowerCase();
    
    let songPool = [];
    
    if (moodKeywords.includes('relax') || moodKeywords.includes('calm') || moodKeywords.includes('chill')) {
        songPool = [
            { name: 'Weightless', artist: 'Marconi Union', youtubeUrl: 'https://www.youtube.com/watch?v=UfcAVejslrU' },
            { name: 'Sunset Lover', artist: 'Petit Biscuit', youtubeUrl: 'https://www.youtube.com/watch?v=wuCK-oiE3rM' },
            { name: 'Dreams', artist: 'Fleetwood Mac', youtubeUrl: 'https://www.youtube.com/watch?v=mrZRURcb1cM' },
            { name: 'Bloom', artist: 'The Paper Kites', youtubeUrl: 'https://www.youtube.com/watch?v=8inJtTG_DuU' },
            { name: 'Holocene', artist: 'Bon Iver', youtubeUrl: 'https://www.youtube.com/watch?v=TWcyIpul8OE' },
            { name: 'Breathe', artist: 'Télépopmusik', youtubeUrl: 'https://www.youtube.com/watch?v=vyut3GyQtn0' },
            { name: 'Porcelain', artist: 'Moby', youtubeUrl: 'https://www.youtube.com/watch?v=IJWlBfo5Oj0' },
            { name: 'Intro', artist: 'The xx', youtubeUrl: 'https://www.youtube.com/watch?v=3gxNW2Ulpwk' },
            { name: 'Teardrop', artist: 'Massive Attack', youtubeUrl: 'https://www.youtube.com/watch?v=u7K72X4eo_s' },
            { name: 'Strawberry Swing', artist: 'Coldplay', youtubeUrl: 'https://www.youtube.com/watch?v=h3pJZSTQqIg' },
            { name: 'Ocean Eyes', artist: 'Billie Eilish', youtubeUrl: 'https://www.youtube.com/watch?v=viimfQi_pUw' },
            { name: 'Gravity', artist: 'John Mayer', youtubeUrl: 'https://www.youtube.com/watch?v=7VBex8zbDRs' }
        ];
    } else if (moodKeywords.includes('workout') || moodKeywords.includes('energy') || moodKeywords.includes('upbeat')) {
        songPool = [
            { name: 'Till I Collapse', artist: 'Eminem', youtubeUrl: 'https://www.youtube.com/watch?v=ytQ5CYE1VZw' },
            { name: 'Eye of the Tiger', artist: 'Survivor', youtubeUrl: 'https://www.youtube.com/watch?v=btPJPFnesV4' },
            { name: 'Stronger', artist: 'Kanye West', youtubeUrl: 'https://www.youtube.com/watch?v=PsO6ZnUZI0g' },
            { name: 'Remember the Name', artist: 'Fort Minor', youtubeUrl: 'https://www.youtube.com/watch?v=VDvr08sCPOc' },
            { name: 'Lose Yourself', artist: 'Eminem', youtubeUrl: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s' },
            { name: 'Can\'t Hold Us', artist: 'Macklemore & Ryan Lewis', youtubeUrl: 'https://www.youtube.com/watch?v=2zNSgSzhBfM' },
            { name: 'Pump It', artist: 'The Black Eyed Peas', youtubeUrl: 'https://www.youtube.com/watch?v=ZaI2IlHwmgQ' },
            { name: 'Run This Town', artist: 'Jay-Z ft. Rihanna', youtubeUrl: 'https://www.youtube.com/watch?v=EQJhq136vIw' },
            { name: 'Power', artist: 'Kanye West', youtubeUrl: 'https://www.youtube.com/watch?v=L53gjP-TtGE' },
            { name: 'Thunderstruck', artist: 'AC/DC', youtubeUrl: 'https://www.youtube.com/watch?v=v2AC41dglnM' },
            { name: 'In Da Club', artist: '50 Cent', youtubeUrl: 'https://www.youtube.com/watch?v=5qm8PH4xAss' },
            { name: 'We Will Rock You', artist: 'Queen', youtubeUrl: 'https://www.youtube.com/watch?v=-tJYN-eG1zk' }
        ];
    } else if (moodKeywords.includes('sad') || moodKeywords.includes('melancholy') || moodKeywords.includes('cry')) {
        songPool = [
            { name: 'Someone Like You', artist: 'Adele', youtubeUrl: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0' },
            { name: 'The Night We Met', artist: 'Lord Huron', youtubeUrl: 'https://www.youtube.com/watch?v=KtlgYxa6BMU' },
            { name: 'Skinny Love', artist: 'Bon Iver', youtubeUrl: 'https://www.youtube.com/watch?v=ssdgFoHLwnk' },
            { name: 'Hurt', artist: 'Johnny Cash', youtubeUrl: 'https://www.youtube.com/watch?v=8AHCfZTRGiI' },
            { name: 'Mad World', artist: 'Gary Jules', youtubeUrl: 'https://www.youtube.com/watch?v=4N3N1MlvVc4' },
            { name: 'Tears in Heaven', artist: 'Eric Clapton', youtubeUrl: 'https://www.youtube.com/watch?v=JxPj3GAYYZ0' },
            { name: 'Nothing Compares 2 U', artist: 'Sinéad O\'Connor', youtubeUrl: 'https://www.youtube.com/watch?v=0-EF60neguk' },
            { name: 'Black', artist: 'Pearl Jam', youtubeUrl: 'https://www.youtube.com/watch?v=5ChbxMVgGV4' },
            { name: 'Creep', artist: 'Radiohead', youtubeUrl: 'https://www.youtube.com/watch?v=XFkzRNyygfk' },
            { name: 'Fix You', artist: 'Coldplay', youtubeUrl: 'https://www.youtube.com/watch?v=k4V3Mo61fJM' },
            { name: 'When I Was Your Man', artist: 'Bruno Mars', youtubeUrl: 'https://www.youtube.com/watch?v=ekzHIouo8Q4' },
            { name: 'Say Something', artist: 'A Great Big World', youtubeUrl: 'https://www.youtube.com/watch?v=-2U0Ivkn2Ds' }
        ];
    } else if (moodKeywords.includes('happy') || moodKeywords.includes('joy') || moodKeywords.includes('celebrate')) {
        songPool = [
            { name: 'Happy', artist: 'Pharrell Williams', youtubeUrl: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs' },
            { name: 'Good Vibrations', artist: 'The Beach Boys', youtubeUrl: 'https://www.youtube.com/watch?v=Eab_beh07HU' },
            { name: 'Don\'t Stop Me Now', artist: 'Queen', youtubeUrl: 'https://www.youtube.com/watch?v=HgzGwKwLmgM' },
            { name: 'Walking on Sunshine', artist: 'Katrina and the Waves', youtubeUrl: 'https://www.youtube.com/watch?v=iPUmE-tne5U' },
            { name: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', youtubeUrl: 'https://www.youtube.com/watch?v=eH3giaIzONA' },
            { name: 'September', artist: 'Earth, Wind & Fire', youtubeUrl: 'https://www.youtube.com/watch?v=Gs069dndIYk' },
            { name: 'Best Day of My Life', artist: 'American Authors', youtubeUrl: 'https://www.youtube.com/watch?v=Y66j_BUCBMY' },
            { name: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', youtubeUrl: 'https://www.youtube.com/watch?v=ru0K8uYEZWw' },
            { name: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', youtubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0' },
            { name: 'Three Little Birds', artist: 'Bob Marley', youtubeUrl: 'https://www.youtube.com/watch?v=zaGUr6wzyT8' },
            { name: 'Here Comes the Sun', artist: 'The Beatles', youtubeUrl: 'https://www.youtube.com/watch?v=KQetemT1sWc' },
            { name: 'Mr. Blue Sky', artist: 'Electric Light Orchestra', youtubeUrl: 'https://www.youtube.com/watch?v=aQUlA8Hcv4s' }
        ];
    } else if (moodKeywords.includes('90s') || moodKeywords.includes('nostalg')) {
        songPool = [
            { name: 'Smells Like Teen Spirit', artist: 'Nirvana', youtubeUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg' },
            { name: 'Wonderwall', artist: 'Oasis', youtubeUrl: 'https://www.youtube.com/watch?v=bx1Bh8ZvH84' },
            { name: 'No Scrubs', artist: 'TLC', youtubeUrl: 'https://www.youtube.com/watch?v=FrLequ6dUdM' },
            { name: 'Wannabe', artist: 'Spice Girls', youtubeUrl: 'https://www.youtube.com/watch?v=gJLIiF15wjQ' },
            { name: 'Black Hole Sun', artist: 'Soundgarden', youtubeUrl: 'https://www.youtube.com/watch?v=3mbBbFH9fAg' },
            { name: 'Basket Case', artist: 'Green Day', youtubeUrl: 'https://www.youtube.com/watch?v=NUTGr5t3MoY' },
            { name: 'Champagne Supernova', artist: 'Oasis', youtubeUrl: 'https://www.youtube.com/watch?v=tI-5uv4wryI' },
            { name: 'Creep', artist: 'Radiohead', youtubeUrl: 'https://www.youtube.com/watch?v=XFkzRNyygfk' },
            { name: 'Under the Bridge', artist: 'Red Hot Chili Peppers', youtubeUrl: 'https://www.youtube.com/watch?v=GLvohMXgcBo' },
            { name: 'Zombie', artist: 'The Cranberries', youtubeUrl: 'https://www.youtube.com/watch?v=6Ejga4kJUts' },
            { name: 'No Rain', artist: 'Blind Melon', youtubeUrl: 'https://www.youtube.com/watch?v=3qVPNONdF58' },
            { name: 'Breakfast at Tiffany\'s', artist: 'Deep Blue Something', youtubeUrl: 'https://www.youtube.com/watch?v=1ClCpfeIELw' }
        ];
    } else {
        // Default mixed playlist
        songPool = [
            { name: 'Blinding Lights', artist: 'The Weeknd', youtubeUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ' },
            { name: 'Levitating', artist: 'Dua Lipa', youtubeUrl: 'https://www.youtube.com/watch?v=TUVcZfQe-Kw' },
            { name: 'Heat Waves', artist: 'Glass Animals', youtubeUrl: 'https://www.youtube.com/watch?v=mRD0-GxqHVo' },
            { name: 'As It Was', artist: 'Harry Styles', youtubeUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q' },
            { name: 'Anti-Hero', artist: 'Taylor Swift', youtubeUrl: 'https://www.youtube.com/watch?v=b1kbLwvqugk' },
            { name: 'Flowers', artist: 'Miley Cyrus', youtubeUrl: 'https://www.youtube.com/watch?v=G7KNmW9a75Y' },
            { name: 'good 4 u', artist: 'Olivia Rodrigo', youtubeUrl: 'https://www.youtube.com/watch?v=gNi_6U5Pm_o' },
            { name: 'Peaches', artist: 'Justin Bieber', youtubeUrl: 'https://www.youtube.com/watch?v=tQ0yjYUFKAE' },
            { name: 'Butter', artist: 'BTS', youtubeUrl: 'https://www.youtube.com/watch?v=WMweEpGlu_U' },
            { name: 'Shivers', artist: 'Ed Sheeran', youtubeUrl: 'https://www.youtube.com/watch?v=Il0S8BoucSA' },
            { name: 'Stay', artist: 'The Kid LAROI & Justin Bieber', youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U' },
            { name: 'Montero', artist: 'Lil Nas X', youtubeUrl: 'https://www.youtube.com/watch?v=6swmTBVI83k' },
            { name: 'Bad Habits', artist: 'Ed Sheeran', youtubeUrl: 'https://www.youtube.com/watch?v=orJSJGHjBLI' },
            { name: 'Watermelon Sugar', artist: 'Harry Styles', youtubeUrl: 'https://www.youtube.com/watch?v=E07s5ZYygMg' }
        ];
    }
    
    // Shuffle and select random songs from the pool
    const shuffled = songPool.sort(() => 0.5 - Math.random());
    const songs = shuffled.slice(0, Math.min(8, songPool.length));
    
    return songs;
}

// Render Playlist
function renderPlaylist(songs) {
    playlistContainer.innerHTML = '';
    
    if (!songs || songs.length === 0) {
        playlistContainer.innerHTML = '<p class="empty-state">No songs generated. Try a different prompt!</p>';
        return;
    }
    
    songs.forEach((song, index) => {
        const songElement = createSongElement(song, index + 1);
        playlistContainer.appendChild(songElement);
    });
}

// Create Song Element
function createSongElement(song, number) {
    const clone = songTemplate.content.cloneNode(true);
    
    clone.querySelector('.song-number').textContent = number;
    clone.querySelector('.song-name').textContent = song.name;
    clone.querySelector('.song-artist').textContent = song.artist;
    clone.querySelector('.youtube-link').href = song.youtubeUrl;
    
    // Add play button functionality
    const playBtn = clone.querySelector('.btn-play');
    playBtn.addEventListener('click', () => {
        playSong(song);
    });
    
    return clone;
}

// Save Playlist Handler
async function handleSavePlaylist() {
    if (!currentPlaylist) {
        alert('No playlist to save!');
        return;
    }
    
    if (!currentUser) {
        alert('Please log in to save playlists');
        return;
    }
    
    try {
        savePlaylistBtn.disabled = true;
        savePlaylistBtn.textContent = 'Saving...';
        
        console.log('Saving playlist:', currentPlaylist);
        console.log('User ID:', currentUser.uid);
        
        // Save to Firestore
        const docRef = await addDoc(collection(window.db, 'playlists'), {
            userId: currentUser.uid,
            prompt: currentPlaylist.prompt,
            songs: currentPlaylist.songs,
            createdAt: new Date().toISOString()
        });
        
        console.log('Playlist saved with ID:', docRef.id);
        
        // Reload playlists
        await loadPlaylistsFromFirestore();
        
        // Show confirmation
        savePlaylistBtn.textContent = 'Saved! ✓';
        
        setTimeout(() => {
            savePlaylistBtn.textContent = 'Save to Favorites';
            savePlaylistBtn.disabled = false;
        }, 2000);
    } catch (error) {
        console.error('Error saving playlist:', error);
        console.error('Error details:', error.message, error.code);
        alert('Error saving playlist: ' + error.message);
        savePlaylistBtn.textContent = 'Save to Favorites';
        savePlaylistBtn.disabled = false;
    }
}

// Load Playlists from Firestore
async function loadPlaylistsFromFirestore() {
    if (!currentUser) return;
    
    try {
        // Try with orderBy first
        let q = query(
            collection(window.db, 'playlists'),
            where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        savedPlaylists = [];
        
        querySnapshot.forEach((doc) => {
            savedPlaylists.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort by createdAt manually
        savedPlaylists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        renderFavorites();
    } catch (error) {
        console.error('Error loading playlists:', error);
        alert('Error loading playlists. Check console for details.');
    }
}

// Auth Handlers
async function handleLogin() {
    const email = authEmail.value.trim();
    const password = authPassword.value;
    
    if (!email || !password) {
        showAuthError('Please enter email and password');
        return;
    }
    
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        authError.classList.add('hidden');
        
        await signInWithEmailAndPassword(window.auth, email, password);
        
        // Clear form
        authEmail.value = '';
        authPassword.value = '';
    } catch (error) {
        console.error('Login error:', error);
        showAuthError(getAuthErrorMessage(error.code));
        loginBtn.disabled = false;
        loginBtn.textContent = 'Log In';
    }
}

async function handleSignup() {
    const email = authEmail.value.trim();
    const password = authPassword.value;
    
    if (!email || !password) {
        showAuthError('Please enter email and password');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters');
        return;
    }
    
    try {
        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating account...';
        authError.classList.add('hidden');
        
        await createUserWithEmailAndPassword(window.auth, email, password);
        
        // Clear form
        authEmail.value = '';
        authPassword.value = '';
    } catch (error) {
        console.error('Signup error:', error);
        showAuthError(getAuthErrorMessage(error.code));
        signupBtn.disabled = false;
        signupBtn.textContent = 'Sign Up';
    }
}

async function handleLogout() {
    try {
        await signOut(window.auth);
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out');
    }
}

function showAuthError(message) {
    authError.textContent = message;
    authError.classList.remove('hidden');
}

function getAuthErrorMessage(code) {
    switch (code) {
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/user-disabled':
            return 'This account has been disabled';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists';
        case 'auth/weak-password':
            return 'Password is too weak';
        case 'auth/invalid-credential':
            return 'Invalid email or password';
        default:
            return 'An error occurred. Please try again.';
    }
}

// Load Saved Playlists (deprecated - now using Firestore)
function loadSavedPlaylists() {
    // No longer needed - using Firestore
}

// Render Favorites
function renderFavorites() {
    favoritesContainer.innerHTML = '';
    
    if (savedPlaylists.length === 0) {
        favoritesContainer.innerHTML = '<p class="empty-state">No saved playlists yet. Generate and save your favorites!</p>';
        return;
    }
    
    savedPlaylists.forEach((playlist) => {
        const playlistElement = createFavoritePlaylistElement(playlist);
        favoritesContainer.appendChild(playlistElement);
    });
}

// Create Favorite Playlist Element
function createFavoritePlaylistElement(playlist) {
    const clone = favoritePlaylistTemplate.content.cloneNode(true);
    
    const date = new Date(playlist.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    clone.querySelector('.favorite-title').textContent = playlist.prompt;
    clone.querySelector('.favorite-date').textContent = formattedDate;
    
    const favoriteSongsDiv = clone.querySelector('.favorite-songs');
    
    // Add songs to the expandable section (without play buttons)
    playlist.songs.forEach((song, songIndex) => {
        const songElement = createSongElementWithoutPlay(song, songIndex + 1, playlist.id);
        favoriteSongsDiv.appendChild(songElement);
    });
    
    // Expand/Collapse functionality
    const expandBtn = clone.querySelector('.btn-expand');
    expandBtn.addEventListener('click', () => {
        favoriteSongsDiv.classList.toggle('hidden');
        expandBtn.textContent = favoriteSongsDiv.classList.contains('hidden') ? 'Show' : 'Hide';
    });
    
    // Edit functionality
    const editBtn = clone.querySelector('.btn-edit');
    let isEditing = false;
    editBtn.addEventListener('click', () => {
        isEditing = !isEditing;
        editBtn.textContent = isEditing ? 'Done' : 'Edit';
        editBtn.classList.toggle('editing');
        
        // Toggle remove buttons visibility
        const removeButtons = favoriteSongsDiv.querySelectorAll('.btn-remove-song');
        removeButtons.forEach(btn => {
            btn.classList.toggle('hidden');
        });
    });
    
    // Delete functionality
    const deleteBtn = clone.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this playlist?')) {
            deleteFavoritePlaylist(playlist.id);
        }
    });
    
    return clone;
}

// Create Song Element Without Play Button (for favorites)
function createSongElementWithoutPlay(song, number, playlistId) {
    const clone = songTemplate.content.cloneNode(true);
    
    clone.querySelector('.song-number').textContent = number;
    clone.querySelector('.song-name').textContent = song.name;
    clone.querySelector('.song-artist').textContent = song.artist;
    clone.querySelector('.youtube-link').href = song.youtubeUrl;
    
    // Remove the play button
    const playBtn = clone.querySelector('.btn-play');
    if (playBtn) {
        playBtn.remove();
    }
    
    // Add remove button functionality
    const removeBtn = clone.querySelector('.btn-remove-song');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeSongFromPlaylist(playlistId, number - 1);
        });
    }
    
    return clone;
}

// Delete Favorite Playlist
async function deleteFavoritePlaylist(playlistId) {
    if (!currentUser) return;
    
    try {
        await deleteDoc(doc(window.db, 'playlists', playlistId));
        await loadPlaylistsFromFirestore();
    } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Error deleting playlist');
    }
}

// Remove Song from Playlist
async function removeSongFromPlaylist(playlistId, songIndex) {
    const playlist = savedPlaylists.find(p => p.id === playlistId);
    
    if (!playlist) return;
    
    if (playlist.songs.length <= 1) {
        alert('Cannot remove the last song. Delete the playlist instead.');
        return;
    }
    
    if (confirm('Remove this song from the playlist?')) {
        try {
            playlist.songs.splice(songIndex, 1);
            
            await updateDoc(doc(window.db, 'playlists', playlistId), {
                songs: playlist.songs
            });
            
            await loadPlaylistsFromFirestore();
        } catch (error) {
            console.error('Error removing song:', error);
            alert('Error removing song');
        }
    }
}

// YouTube Player Functions
function getYouTubeVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

function playSong(song) {
    currentPlayingSong = song;
    playerSongName.textContent = song.name;
    playerArtist.textContent = song.artist;
    
    const videoId = getYouTubeVideoId(song.youtubeUrl);
    
    if (!videoId) {
        alert('Invalid YouTube URL');
        return;
    }
    
    // Show player
    audioPlayerModal.classList.remove('hidden');
    audioPlayerModal.classList.add('active');
    
    // Initialize or load video
    if (youtubePlayer) {
        youtubePlayer.loadVideoById(videoId);
    } else {
        // Wait for YouTube API to be ready
        if (typeof YT !== 'undefined' && YT.Player) {
            initYouTubePlayer(videoId);
        } else {
            window.onYouTubeIframeAPIReady = () => {
                initYouTubePlayer(videoId);
            };
        }
    }
}

function initYouTubePlayer(videoId) {
    youtubePlayer = new YT.Player('youtube-player-container', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin
        },
        events: {
            'onError': function(event) {
                // Error codes: 2 = Invalid parameter, 5 = HTML5 player error, 
                // 100 = Video not found, 101/150 = Embedding disabled
                if (event.data === 101 || event.data === 150) {
                    alert('This video cannot be embedded. Opening in YouTube instead...');
                    window.open(currentPlayingSong.youtubeUrl, '_blank');
                    closeAudioPlayer();
                } else if (event.data === 100) {
                    alert('Video not found or removed.');
                    closeAudioPlayer();
                }
            }
        }
    });
}

function closeAudioPlayer() {
    audioPlayerModal.classList.remove('active');
    
    // Stop the video
    if (youtubePlayer && youtubePlayer.stopVideo) {
        youtubePlayer.stopVideo();
    }
    
    // Hide after animation
    setTimeout(() => {
        audioPlayerModal.classList.add('hidden');
    }, 300);
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
