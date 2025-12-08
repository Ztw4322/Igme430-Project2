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

const handletoggleListened = async (e, music, onUpdate) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost('/toggleListened', { music }, onUpdate);
    return false;
};

const MusicChecklistItem = ({ musics, triggerReload }) => {

    if(!musics)
    {
        return (<div>No Music Yet</div>);
    }
    
    const isListened = musics.listened;
    const checkboxId = `listened-${musics._id}`;

    return (
        <div className='listenedCheckItem'>
            <label htmlFor={checkboxId}>
                <span>
                    **{musics.albumName}** by {musics.artistName}
                </span>
            </label>
            <input
                type="checkbox"
                id={checkboxId}
                checked={isListened}
                onChange={(e) => handletoggleListened(e, musics, triggerReload)}
            />
        </div>
    );
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
        </form>
    );
};


const PopularGenre = (props) =>
{
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
     <div className="musicList">
                <h3 className="emptymusic">No Songs</h3>
            </div>
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
                <h3 className="musicAge">url: {music.url}</h3>
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

const App = () => {
    const [reloadmusics, setReloadmusics] = useState(false);

    return (
        <div>
            <div id="makemusic" className='parent'>
                <MusicChecklistItem musics={[]} reloadmusics={reloadmusics}/>
                <MusicForm triggerReload={() => setReloadmusics(!reloadmusics)} />
                <PopularGenre reloadmusics={reloadmusics}/>
            </div>
            <div id="musics">
                <MusicList musics={[]} reloadmusics={reloadmusics} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;