const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;

    if (!name || !age) {
        helper.handleError('All fields are required');
        return false;
    }
    helper.sendPost(e.target.action, { name, age }, onDomoAdded);
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
            <label htmlFor="music">Type of Music Release</label>
            <select id="music" name="music">
                <option value="Album">Album</option>
                <option value="Ep">Ep</option>
                <option value="Song">Song</option>
                <option value="Unreleased">Unreleased</option>
            </select>
            <label htmlFor="name">Name of the Work: </label>
            <input type="text" id='domoName' name='name' placeholder='Name of Work' />
            <label htmlFor="artist">Artist Name: </label>
            <input type="text" id='domoName' name='artist' placeholder='Artist Name' />
            <label htmlFor="url">Link To Work: </label>
            <input type="text" id='domoName' name='url' placeholder='URL' />
            <label htmlFor="person">Who recommended this: </label>
            <input type="text" id='domoName' name='person' placeholder="Person's Name" />
            <input type="submit" value="Add" className='makeDomoSubmit' />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className='domo'>
                <img src="/assets/img/SongLogo.png" alt="logo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
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