const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const music1 = e.target.querySelector('#music1').value;
    const music2 = e.target.querySelector('#music2').value;
    const workName = e.target.querySelector('#workName').value;
    const artName = e.target.querySelector('#artName').value;
    const url = e.target.querySelector('#url').value;
    const prsnName = e.target.querySelector('#prsnName').value;

    // if (!music1 || !music2 || !workName || !artName || !url || !prsnName) {
    //     console.log({ music1, music2, workName, artName, url, prsnName,});
    //     helper.handleError('All fields are required');
    //     return false;
    // }
    helper.sendPost(e.target.action, { music1, music2, workName, artName, url, prsnName}, onDomoAdded);
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
            <label htmlFor="music1">Type of Music Release</label>
            <label htmlFor="music2">Genre:</label>
            <select id="music1" name="music1">
                <option value="Album">Album</option>
                <option value="Ep">Ep</option>
                <option value="Song">Song</option>
                <option value="Unreleased">Unreleased</option>
            </select>
            <select id="music2" name="music2">
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Electronic">Electronic</option>
                <option value="Country">Country</option>
                <option value="Jazz">Jazz</option>
            </select>

            <label htmlFor="name">Name of the Work: </label>
            <label htmlFor="artist">Artist Name: </label>
            <input type="text" id='workName' name='name' placeholder='Name of Work' />
            <input type="text" id='artName' name='artist' placeholder='Artist Name' />
            <label htmlFor="url">Link To Work: </label>
            <label htmlFor="person">Who recommended this: </label>
            <input type="text" id='url' name='url' placeholder='URL' />
            <input type="text" id='prsnName' name='person' placeholder="Person's Name" />
            <input type="submit" value="Add" className='makeDomoSubmit' />
        </form>
    );
};

const DomoList = (props) => {
    const [music, setDomos] = useState(props.Musics);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getMusics');
            const data = await response.json();
            setDomos(data.Musics);
            console.log(data.Musics);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    try
    {

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
                <h3 className="domoName">Type: {music.music1}</h3>
                <h3 className="domoAge">Genre: {music.music2}</h3>
                <h3 className="domoAge">Name: {music.workName}</h3>
                <h3 className="domoAge">Artist: {music.artName}</h3>
                <h3 className="domoAge">url: {music.url}</h3>
                <h3 className="domoAge">Recommender: {music.prsnName}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {musicNodes}
        </div>
    );
}
catch
{
    console.log("err");
}
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;