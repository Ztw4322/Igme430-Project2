const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handlemusic = (e, onmusicAdded) => {
    e.preventDefault();
    helper.hideError();

    const musicType = e.target.querySelector('#musicType').value;
    const genre = e.target.querySelector('#genre').value;
    const albumName = e.target.querySelector('#albumName').value;
    const artistName = e.target.querySelector('#artistName').value;
    const url = e.target.querySelector('#url').value;
    const personName = e.target.querySelector('#personName').value;
    console.log({ musicType, genre, albumName, artistName, url, personName,});

    if (!musicType || !genre || !albumName || !artistName || !url || !personName) {
        helper.handleError('All fields are required');
        return false;
    }
    helper.sendPost(e.target.action, { musicType, genre, albumName, artistName, url, personName}, onmusicAdded);
    return false;
};

const handleChangePass = (e) =>
{ 
        e.preventDefault();
    helper.hideError();
    const user = e.target.querySelector('#user').value;
    const oldPass = e.target.querySelector('#pass').value;
    const newPass = e.target.querySelector('#pass2').value;

    helper.sendPost(e.target.action, { user, oldPass, newPass});
}

const handleChangeUser = (e) =>
{ 
        e.preventDefault();
    helper.hideError();
    const user = e.target.querySelector('#user1').value;
    const newuser = e.target.querySelector('#user2').value;
    const password = e.target.querySelector('#pass1').value;

    helper.sendPost(e.target.action, { user, newuser, password});
}

const handletoggleListened = (e, music, onUpdate) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost('/toggleListen', { music }, onUpdate);
    return false;
};

const MusicChecklistItem = (props) => {

    const [music, setMusic] = useState(props.musics);

      useEffect(() => {
        const loadmusicsFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadmusicsFromServer();
    }, [props.reloadmusics]);
    
    if(music.length == 0)
    {
        return (<div className='listenedContainer'>
        <h2>Listened vs UnListened</h2>-</div>);
    }

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
                onChange={(e) => handletoggleListened(e, music, props.triggerReload)}
            />
            </div>
        </div>
    );});

    return (<div className='listenedContainer'>
        <h2>Listened vs UnListened</h2>
        {ListenvsUnListen}
    </div>);
};

const MusicForm = (props) => {
    return (
        <form id="musicForm"
            name="musicForm"
            onSubmit={(e) => handlemusic(e, props.triggerReload)}
            action="/maker"
            method="POST"
            className="musicForm"
        >
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

    useEffect(() => {
        const loadmusicFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadmusicFromServer();
    }, [props.reloadmusics]);

   let genreCounts = {
    "Pop": 0,
    "Rock": 0,
    "Hip-Hop": 0,
    "Country": 0,
    "Jazz": 0,
    "Electronic": 0
};

try {
if(music.length == 0)
{       return (
    <div className="GenreBox">
                <h2>Most Listened Genre</h2>
                <h3 className="empty">-</h3>
                </div>
);
}

    for(let i = 0; i < music.length; i++) {
    const genre = music[i].genre;
    if (genreCounts.hasOwnProperty(genre) && music[i].listened) {
        genreCounts[genre]++;
    }
} 

const [mostPopularGenre, maxCount] = Object.entries(genreCounts).reduce(
    (max, current) => {
        
        return current[1] > max[1] ? current : max;
    },
    Object.entries(genreCounts)[0]
);

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

    useEffect(() => {
        const loadmusicFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadmusicFromServer();
    }, [props.reloadmusics]);

   let genreCounts = {
    "Pop": 0,
    "Rock": 0,
    "Hip-Hop": 0,
    "Country": 0,
    "Jazz": 0,
    "Electronic": 0
};

try {
if(music.length == 0)
{       return (
     (<div className="GenreBox">
                <h2>Most Suggested Genre</h2>
                <h3 className="empty">-</h3>
                </div>)
);
}

    for(let i = 0; i < music.length; i++) {
    const genre = music[i].genre;
    if (genreCounts.hasOwnProperty(genre)) {
        genreCounts[genre]++;
    }
} 

const [mostPopularGenre, maxCount] = Object.entries(genreCounts).reduce(
    (max, current) => {
        
        return current[1] > max[1] ? current : max;
    },
    Object.entries(genreCounts)[0]
);

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

    useEffect(() => {
        const loadmusicsFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadmusicsFromServer();
    }, [props.reloadmusics]);


    if (music.length === 0) {
        return (
            <div className="musicList">
                <h3 className="emptymusic">No musics Yet!</h3>
            </div>
        );
    }

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
    const [reloadmusics, setReloadmusics] = useState(false);

    return (
        <div>
            <div id="makemusic" className='parent'>
                <MusicChecklistItem musics={[]} reloadmusics={reloadmusics}/>
                <MusicForm triggerReload={() => setReloadmusics(!reloadmusics)} />
                <div>
                <PopularGenre reloadmusics={reloadmusics} />
                <MostListened reloadmusics={reloadmusics}/>
                </div>
            </div>
            <div id="musics">
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
    
      accountButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<App2 />);
        return false;
      });
    
      songButton.addEventListener('click', (e) => {
        e.preventDefault();
            root.render(<App />);
        return false;
      });
          
    root.render(<App />);
};

window.onload = init;