const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
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
    helper.sendPost(e.target.action, { musicType, genre, albumName, artistName, url, personName}, onDomoAdded);
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            name="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            action="/maker"
            method="POST"
            className="domoForm"
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
            <input type="submit" value="Add" className='makeDomoSubmit' />
        </form>
    );
};

const PopularGenre = (props) =>
{
     const [music, setMusic] = useState(props.musics);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

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
     <div className="domoList">
                <h3 className="emptyDomo">No Songs</h3>
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

return (<div className="GenreList">
                <h3 className="empty">{mostPopularGenre}</h3>
                </div>);
}
catch
{
    console.log("ee");
}
};


const DomoList = (props) => {
    const [music, setMusic] = useState(props.musics);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setMusic(data.Musics);
            console.log(data.Musics);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);


    if (music.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const musicNodes = music.map(music => {
        return (
            <div key={music.id} className='domo'>
                <img src="/assets/img/SongLogo.png" alt="logo face" className="domoFace" />
                <h3 className="domoName">Type: {music.musicType}</h3>
                <h3 className="domoAge">Genre: {music.genre}</h3>
                <h3 className="domoAge">Name: {music.albumName}</h3>
                <h3 className="domoAge">Artist: {music.artistName}</h3>
                <h3 className="domoAge">url: {music.url}</h3>
                <h3 className="domoAge">Recommender: {music.personName}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {musicNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
                <PopularGenre reloadDomos={reloadDomos}/>
            </div>
            <div id="domos">
                <DomoList musics={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;