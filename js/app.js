// VibeMix - Playlist Generator App

// State Management
let currentPlaylist = null;
let savedPlaylists = [];

// DOM Elements
const moodPrompt = document.getElementById('mood-prompt');
const generateBtn = document.getElementById('generate-btn');
const savePlaylistBtn = document.getElementById('save-playlist-btn');
const loadingDiv = document.getElementById('loading');
const playlistContainer = document.getElementById('playlist-container');
const favoritesContainer = document.getElementById('favorites-container');
const songTemplate = document.getElementById('song-template');
const favoritePlaylistTemplate = document.getElementById('favorite-playlist-template');

// Initialize Ap
function init() {
    loadSavedPlaylists();
    renderFavorites();
    attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
    generateBtn.addEventListener('click', handleGeneratePlaylist);
    savePlaylistBtn.addEventListener('click', handleSavePlaylist);
    
    // Allow Enter key to generate (with Ctrl/Cmd for new line)
    moodPrompt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            handleGeneratePlaylist();
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
    
    let songs = [];
    
    if (moodKeywords.includes('relax') || moodKeywords.includes('calm') || moodKeywords.includes('chill')) {
        songs = [
            { name: 'Weightless', artist: 'Marconi Union', youtubeUrl: 'https://www.youtube.com/watch?v=UfcAVejslrU' },
            { name: 'Sunset Lover', artist: 'Petit Biscuit', youtubeUrl: 'https://www.youtube.com/watch?v=wuCK-oiE3rM' },
            { name: 'Dreams', artist: 'Fleetwood Mac', youtubeUrl: 'https://www.youtube.com/watch?v=mrZRURcb1cM' },
            { name: 'Bloom', artist: 'The Paper Kites', youtubeUrl: 'https://www.youtube.com/watch?v=8inJtTG_DuU' },
            { name: 'Holocene', artist: 'Bon Iver', youtubeUrl: 'https://www.youtube.com/watch?v=TWcyIpul8OE' }
        ];
    } else if (moodKeywords.includes('workout') || moodKeywords.includes('energy') || moodKeywords.includes('upbeat')) {
        songs = [
            { name: 'Till I Collapse', artist: 'Eminem', youtubeUrl: 'https://www.youtube.com/watch?v=ytQ5CYE1VZw' },
            { name: 'Eye of the Tiger', artist: 'Survivor', youtubeUrl: 'https://www.youtube.com/watch?v=btPJPFnesV4' },
            { name: 'Stronger', artist: 'Kanye West', youtubeUrl: 'https://www.youtube.com/watch?v=PsO6ZnUZI0g' },
            { name: 'Remember the Name', artist: 'Fort Minor', youtubeUrl: 'https://www.youtube.com/watch?v=VDvr08sCPOc' },
            { name: 'Lose Yourself', artist: 'Eminem', youtubeUrl: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s' }
        ];
    } else if (moodKeywords.includes('sad') || moodKeywords.includes('melancholy') || moodKeywords.includes('cry')) {
        songs = [
            { name: 'Someone Like You', artist: 'Adele', youtubeUrl: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0' },
            { name: 'The Night We Met', artist: 'Lord Huron', youtubeUrl: 'https://www.youtube.com/watch?v=KtlgYxa6BMU' },
            { name: 'Skinny Love', artist: 'Bon Iver', youtubeUrl: 'https://www.youtube.com/watch?v=ssdgFoHLwnk' },
            { name: 'Hurt', artist: 'Johnny Cash', youtubeUrl: 'https://www.youtube.com/watch?v=8AHCfZTRGiI' },
            { name: 'Mad World', artist: 'Gary Jules', youtubeUrl: 'https://www.youtube.com/watch?v=4N3N1MlvVc4' }
        ];
    } else if (moodKeywords.includes('happy') || moodKeywords.includes('joy') || moodKeywords.includes('celebrate')) {
        songs = [
            { name: 'Happy', artist: 'Pharrell Williams', youtubeUrl: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs' },
            { name: 'Good Vibrations', artist: 'The Beach Boys', youtubeUrl: 'https://www.youtube.com/watch?v=Eab_beh07HU' },
            { name: 'Don\'t Stop Me Now', artist: 'Queen', youtubeUrl: 'https://www.youtube.com/watch?v=HgzGwKwLmgM' },
            { name: 'Walking on Sunshine', artist: 'Katrina and the Waves', youtubeUrl: 'https://www.youtube.com/watch?v=iPUmE-tne5U' },
            { name: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', youtubeUrl: 'https://www.youtube.com/watch?v=eH3giaIzONA' }
        ];
    } else if (moodKeywords.includes('90s') || moodKeywords.includes('nostalg')) {
        songs = [
            { name: 'Smells Like Teen Spirit', artist: 'Nirvana', youtubeUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg' },
            { name: 'Wonderwall', artist: 'Oasis', youtubeUrl: 'https://www.youtube.com/watch?v=bx1Bh8ZvH84' },
            { name: 'No Scrubs', artist: 'TLC', youtubeUrl: 'https://www.youtube.com/watch?v=FrLequ6dUdM' },
            { name: 'Wannabe', artist: 'Spice Girls', youtubeUrl: 'https://www.youtube.com/watch?v=gJLIiF15wjQ' },
            { name: 'Black Hole Sun', artist: 'Soundgarden', youtubeUrl: 'https://www.youtube.com/watch?v=3mbBbFH9fAg' }
        ];
    } else {
        // Default mixed playlist
        songs = [
            { name: 'Blinding Lights', artist: 'The Weeknd', youtubeUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ' },
            { name: 'Levitating', artist: 'Dua Lipa', youtubeUrl: 'https://www.youtube.com/watch?v=TUVcZfQe-Kw' },
            { name: 'Heat Waves', artist: 'Glass Animals', youtubeUrl: 'https://www.youtube.com/watch?v=mRD0-GxqHVo' },
            { name: 'As It Was', artist: 'Harry Styles', youtubeUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q' },
            { name: 'Anti-Hero', artist: 'Taylor Swift', youtubeUrl: 'https://www.youtube.com/watch?v=b1kbLwvqugk' },
            { name: 'Flowers', artist: 'Miley Cyrus', youtubeUrl: 'https://www.youtube.com/watch?v=G7KNmW9a75Y' }
        ];
    }
    
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
    
    return clone;
}

// Save Playlist Handler
function handleSavePlaylist() {
    if (!currentPlaylist) {
        alert('No playlist to save!');
        return;
    }
    
    // Add to saved playlists
    savedPlaylists.unshift(currentPlaylist);
    
    // Save to localStorage
    localStorage.setItem('vibemix-playlists', JSON.stringify(savedPlaylists));
    
    // Re-render favorites
    renderFavorites();
    
    // Show confirmation
    savePlaylistBtn.textContent = 'Saved! ✓';
    savePlaylistBtn.disabled = true;
    
    setTimeout(() => {
        savePlaylistBtn.textContent = 'Save to Favorites';
        savePlaylistBtn.disabled = false;
    }, 2000);
}

// Load Saved Playlists
function loadSavedPlaylists() {
    const saved = localStorage.getItem('vibemix-playlists');
    if (saved) {
        try {
            savedPlaylists = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading saved playlists:', error);
            savedPlaylists = [];
        }
    }
}

// Render Favorites
function renderFavorites() {
    favoritesContainer.innerHTML = '';
    
    if (savedPlaylists.length === 0) {
        favoritesContainer.innerHTML = '<p class="empty-state">No saved playlists yet. Generate and save your favorites!</p>';
        return;
    }
    
    savedPlaylists.forEach((playlist, index) => {
        const playlistElement = createFavoritePlaylistElement(playlist, index);
        favoritesContainer.appendChild(playlistElement);
    });
}

// Create Favorite Playlist Element
function createFavoritePlaylistElement(playlist, index) {
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
    
    // Add songs to the expandable section
    playlist.songs.forEach((song, songIndex) => {
        const songElement = createSongElement(song, songIndex + 1);
        favoriteSongsDiv.appendChild(songElement);
    });
    
    // Expand/Collapse functionality
    const expandBtn = clone.querySelector('.btn-expand');
    expandBtn.addEventListener('click', () => {
        favoriteSongsDiv.classList.toggle('hidden');
        expandBtn.textContent = favoriteSongsDiv.classList.contains('hidden') ? 'Show' : 'Hide';
    });
    
    // Delete functionality
    const deleteBtn = clone.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this playlist?')) {
            deleteFavoritePlaylist(index);
        }
    });
    
    return clone;
}

// Delete Favorite Playlist
function deleteFavoritePlaylist(index) {
    savedPlaylists.splice(index, 1);
    localStorage.setItem('vibemix-playlists', JSON.stringify(savedPlaylists));
    renderFavorites();
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
