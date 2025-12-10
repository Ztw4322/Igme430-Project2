const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handlemusic = (e, onmusicAdded) => {
    e.preventDefault();
    helper.hideError();

    // Extract form data
    const musicType = e.target.querySelector('#musicType').value;
    const genre = e.target.querySelector('#genre').value;
    const albumName = e.target.querySelector('#albumName').value;
    const artistName = e.target.querySelector('#artistName').value;
    const url = e.target.querySelector('#url').value;
    const personName = e.target.querySelector('#personName').value;
    console.log({ musicType, genre, albumName, artistName, url, personName,});

    // Client-side validation
    if (!musicType || !genre || !albumName || !artistName || !url || !personName) {
        helper.handleError('All fields are required');
        return false;
    }
    // Submit data to server and trigger reload callback
    helper.sendPost(e.target.action, { musicType, genre, albumName, artistName, url, personName}, onmusicAdded);
    return false;
};

const handleChangePass = (e) =>
{
    e.preventDefault();
    helper.hideError();
    // Extract password change details
    const user = e.target.querySelector('#user').value;
    const oldPass = e.target.querySelector('#pass').value;
    const newPass = e.target.querySelector('#pass2').value;

    // Send password change request
    helper.sendPost(e.target.action, { user, oldPass, newPass});
};

const handleChangeUser = (e) =>
{
    e.preventDefault();
    helper.hideError();
    // Extract username change details
    const user = e.target.querySelector('#user1').value;
    const newuser = e.target.querySelector('#user2').value;
    const password = e.target.querySelector('#pass1').value;

    // Send username change request
    helper.sendPost(e.target.action, { user, newuser, password});
};

const handletoggleListened = (e, music, onUpdate) => {
    e.preventDefault();
    helper.hideError();

    // Send toggle request to server
    helper.sendPost('/toggleListen', { music }, onUpdate);
    return false;
};


const MusicChecklistItem = (props) => {

    const [music, setMusic] = useState(props.musics);

    // Fetch music data on mount and reload trigger
    useEffect(() => {
        const loadmusicsFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadmusicsFromServer();
    }, [props.reloadmusics]);

    // Render placeholder if list is empty
    if(music.length == 0)
    {
        return (<div className='listenedContainer'>
            <h2>Listened vs UnListened</h2>-</div>);
    }

    // Map music array to checklist items
   const ListenvsUnListen = music.map(music => {
    const isListened = music.listened;
    return (
        <div className='listenedCheckItem column' key={music._id}>
            <div  className='boxed'>
            <label htmlFor={music._id}>
                {music.albumName} - {music.artistName}
            </label>
            </div>
            <div className='boxed'>
            <input
                type="checkbox"
                id={music._id}
                checked={isListened}
                // Call toggle handler on change
                onChange={(e) => handletoggleListened(e, music, props.triggerReload)}
            />
            </div>
        </div>
    );});

    // Render the checklist container
    return (<div className='listenedContainer'>
        <h2>Listened vs UnListened</h2>
        {ListenvsUnListen}
    </div>);
};

const MusicForm = (props) => {
    return (
        <form id="musicForm"
            name="musicForm"
            // Submit handler
            onSubmit={(e) => handlemusic(e, props.triggerReload)}
            action="/maker"
            method="POST"
            className="musicForm"
        >
            {/* Form fields for music details */}
            <label htmlFor="musicType">Type of Music Release</label>
            <label htmlFor="genre">Genre:</label>
            <select id="musicType" name="musicType">
                <option value="Album">Album</option>
                <option value="Ep">Ep</option>
                <option value="Song">Song</option>
                <option value="Unreleased">Unreleased</option>
            </select>
            <select id="genre" name="genre">
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Electronic">Electronic</option>
                <option value="Country">Country</option>
                <option value="Jazz">Jazz</option>
            </select>

            <label htmlFor="name">Name of the Work: </label>
            <label htmlFor="artist">Artist Name: </label>
            <input type="text" id='albumName' name='name' placeholder='Name of Work' />
            <input type="text" id='artistName' name='artist' placeholder='Artist Name' />
            <label htmlFor="url">Link To Work: </label>
            <label htmlFor="person">Who recommended this: </label>
            <input type="text" id='url' name='url' placeholder='URL' />
            <input type="text" id='personName' name='person' placeholder="Person's Name" />
            <input type="submit" value="Add" className='makemusicSubmit' />
            <p id='echoMessage' className='hidden'>All Fields Required!</p>
        </form>
    );
};

const MostListened = (props) =>
{
    const [music, setMusic] = useState(props.musics);

    // Fetch music data on mount/reload
    useEffect(() => {
        const loadmusicFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadmusicFromServer();
    }, [props.reloadmusics]);

    // Genre count initialization
    let genreCounts = {
    "Pop": 0,
    "Rock": 0,
    "Hip-Hop": 0,
    "Country": 0,
    "Jazz": 0,
    "Electronic": 0
};

try {
    // Render placeholder if list is empty
    if(music.length == 0)
    {      return (
        <div className="GenreBox">
                <h2>Most Listened Genre</h2>
                <h3 className="empty">-</h3>
                </div>
    );
    }

    // Count genres, only if music is marked as listened
    for(let i = 0; i < music.length; i++) {
        const genre = music[i].genre;
        if (genreCounts.hasOwnProperty(genre) && music[i].listened) {
            genreCounts[genre]++;
        }
    }

    // Find the genre with the maximum count
    const [mostPopularGenre, maxCount] = Object.entries(genreCounts).reduce(
        (max, current) => {

            return current[1] > max[1] ? current : max;
        },
        Object.entries(genreCounts)[0]
    );

    // Render the result
    return (<div className="GenreBox">
                <h2>Most Listened Genre</h2>
                <h3 className="empty">{mostPopularGenre}</h3>
                </div>);
}
catch
{
}
};

const PopularGenre = (props) =>
{
    const [music, setMusic] = useState(props.musics);

    // Fetch music data on mount/reload
    useEffect(() => {
        const loadmusicFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadmusicFromServer();
    }, [props.reloadmusics]);

    // Genre count initialization
    let genreCounts = {
    "Pop": 0,
    "Rock": 0,
    "Hip-Hop": 0,
    "Country": 0,
    "Jazz": 0,
    "Electronic": 0
};

try {
    // Render placeholder if list is empty
    if(music.length == 0)
    {      return (
        (<div className="GenreBox">
                <h2>Most Suggested Genre</h2>
                <h3 className="empty">-</h3>
                </div>)
    );
    }

    // Count all genres
    for(let i = 0; i < music.length; i++) {
        const genre = music[i].genre;
        if (genreCounts.hasOwnProperty(genre)) {
            genreCounts[genre]++;
        }
    }

    // Find the genre with the maximum count
    const [mostPopularGenre, maxCount] = Object.entries(genreCounts).reduce(
        (max, current) => {

            return current[1] > max[1] ? current : max;
        },
        Object.entries(genreCounts)[0]
    );

    // Render the result
    return (<div className="GenreBox">
                <h2>Most Suggested Genre</h2>
                <h3 className="empty">{mostPopularGenre}</h3>
                </div>);
}
catch
{
}
};

const MusicList = (props) => {
    const [music, setMusic] = useState(props.musics);

    // Fetch music data on mount/reload
    useEffect(() => {
        const loadmusicsFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadmusicsFromServer();
    }, [props.reloadmusics]);


    // Render placeholder if list is empty
    if (music.length === 0) {
        return (
            <div className="musicList">
                <h3 className="emptymusic">No musics Yet!</h3>
            </div>
        );
    }

    // Map music array to display nodes
    const musicNodes = music.map(music => {
        return (
            <div key={music.id} className='music'>
                <img src="/assets/img/SongLogo.png" alt="logo face" className="musicFace" />
                <h3 className="musicName">Type: {music.musicType}</h3>
                <h3 className="musicAge">Genre: {music.genre}</h3>
                <h3 className="musicAge">Name: {music.albumName}</h3>
                <h3 className="musicAge">Artist: {music.artistName}</h3>
                <h3 className="musicAge">url: <a href={music.url}>Open Link</a></h3>
                <h3 className="musicAge">Recommender: {music.personName}</h3>
            </div>
        );
    });

    // Render the list container
    return (
        <div className='musicList'>
            {musicNodes}
        </div>
    );
};

const ChangePassword = (props) => {
  return (
    <form id="passform"
      name="passform"
      onSubmit={(e) => handleChangePass(e)}
      action="/pass"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id='user' type="text" name='username' placeholder='username' />
      <label htmlFor="pass">Current Password: </label>
      <input id='pass' type="password" name='pass' placeholder='password' />
      <label htmlFor="pass2">New Password: </label>
      <input id='pass2' type="password" name='pass2' placeholder='retype password' />
      <input type="submit" value="Change Password" className='formSubmit' />
      <p id='echoMessage' className='hidden'>All Fields Required!</p>
    </form>
  );
};

const ChangeUser = (props) => {
  return (
    <form id="userform"
      name="userform"
      onSubmit={(e) => handleChangeUser(e)}
      action="/user"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id='user1' type="text" name='username' placeholder='username' />
      <label htmlFor="username2">New Username: </label>
      <input id='user2' type="text" name='user2' placeholder='new username' />
      <label htmlFor="pass">Password: </label>
      <input id='pass1' type="password" name='pass' placeholder='retype password' />
      <input type="submit" value="Change User" className='formSubmit' />
      <p id='echoMessage' className='hidden'>All Fields Required!</p>
    </form>
  );
};

const App = () => {
    // State for triggering reloads and checking premium status
    const [reloadmusics, setReloadmusics] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    // Check premium status on mount
    useEffect(() => {
        const checkPremium = async () => {
            try {
                const response = await fetch('/prem');
                const data = await response.json();
                setIsPremium(data.prem);
            } catch (err) {
                console.error('Error checking premium:', err);
            }
        };
        checkPremium();
    }, []);

    // Premium user view
    if(isPremium == true)
    {

        return (
            <div>
                <div id="makemusic" className='parent'>
                    {/* Checklist, Music Form, and Stats for Premium */}
                    <MusicChecklistItem musics={[]} triggerReload={() => setReloadmusics(!reloadmusics)}  reloadmusics={reloadmusics}/>
                    <MusicForm triggerReload={() => setReloadmusics(!reloadmusics)} />
                    <div>
                    <PopularGenre reloadmusics={reloadmusics} />
                    <MostListened reloadmusics={reloadmusics}/>
                    </div>
                </div>
                <div id="musics">
                    {/* Full Music List */}
                    <MusicList musics={[]} reloadmusics={reloadmusics} />
                </div>
            </div>

        );
    }
    // Standard user view
    return (
        <div>
            <div id="makemusic" className='parent'>
                {/* Music Form and only Popular Genre stat for Standard users */}
                <MusicForm triggerReload={() => setReloadmusics(!reloadmusics)} />
                <div>
                <PopularGenre reloadmusics={reloadmusics} />
                </div>
            </div>
            <div id="musics">
                {/* Full Music List */}
                <MusicList musics={[]} reloadmusics={reloadmusics} />
            </div>
        </div>

    );
};

const App2 = () => {

    return (
        <div>
            <div className='parent2'>
            <ChangePassword />
            <ChangeUser />
            </div>
        </div>
    );
};


const init = () => {
    const songButton = document.getElementById('songAdder');
    const accountButton = document.getElementById('account');

    const root = createRoot(document.getElementById('app'));

    // Event listener to switch to Account View
    accountButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<App2 />);
        return false;
    });

    // Event listener to switch to Music Dashboard View
    songButton.addEventListener('click', (e) => {
        e.preventDefault();
            root.render(<App />);
        return false;
    });

    // Initial render of the Music Dashboard View
    root.render(<App />);
};

window.onload = init;