import { useState, useEffect, Fragment } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import './App.css';
import axios from 'axios'
import { format } from 'timeago.js'
import Register from './components/Register';
import Login from './components/Login';

function App() {
	const mystorage = window.localStorage;
	const [currentUser, setCurrentUser] = useState(mystorage.getItem('user'))
	const [pins, setPins] = useState([])
	const [currentPlaceId, setCurrentPlaceId] = useState(null)
	const [newPlace, setNewPlace] = useState(null)
	const [title, setTitle] = useState(null)
	const [desc, setDesc] = useState(null)
	const [rating, setRating] = useState(0)
	const [showreg, setshowreg] = useState(false)
	const [showlog, setshowlog] = useState(false)
	const [viewport, setViewport] = useState({
		width: "100vw",
		height: "100vh",
		latitude: 22,
		longitude: 87,
		zoom: 4
	});

	useEffect(() => {
		const getPins = async () => {
			try {
				const res = await axios.get('http://localhost:5000/api/pins');
				setPins(res.data);
				// console.log(res.data)

			} catch (error) {
				console.log(error);
			}
		}
		getPins()
	}, [])

	const markerClickHandler = (id, lat, long) => {
		setCurrentPlaceId(id);
		setViewport({...viewport, latitude: lat, longitude: long})
	}

	const addClickHandler = (e) => {
		// console.log(e);
		const [long, lat] = e.lngLat;
		setNewPlace({
			long,
			lat
		})
	}

	const newPlaceSubmit = async (e)=> {
		e.preventDefault();
		try {
			const newPin = {
				username: currentUser,
				title, desc, rating, latitude:  newPlace.lat, long: newPlace.long
			}
			const getValue = await axios.post('http://localhost:5000/api/pins', newPin);
			setPins([...pins, getValue.data])
			setNewPlace(null)
		} catch (error) {
			console.log(error);
		}
	}

	const logoutHandler = () => {
		mystorage.removeItem('user')
		setCurrentUser(null)
	}

	return (
		<div className="App">
			<ReactMapGL
				{...viewport}
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
				onViewportChange={nextViewport => setViewport(nextViewport)}
				mapStyle="mapbox://styles/shahinur-shanto/ckqpzef143u7918leb4ye4rld"
				onDblClick={addClickHandler}
				transitionDuration="200">

				{pins.map((res) => (
					<Fragment key={res._id}>
						<Marker
							latitude={res.latitude}
							longitude={res.long}
							offsetLeft={-viewport.zoom * 3.5}
							offsetTop={-viewport.zoom * 7}>
							<Room
								style={{
									fontSize: viewport.zoom * 7,
									color: res.username === currentUser ? 'green' : 'yellow',
									cursor: 'pointer'
								}}
								onClick={() => markerClickHandler(res._id, res.latitude, res.long)}
							/>
						</Marker>
						{res._id === currentPlaceId && (
							<Popup
								latitude={res.latitude}
								longitude={res.long}
								closeButton={true}
								closeOnClick={false}
								anchor="left"
								onClose={() => setCurrentPlaceId(null)}
							>
								<div className="card">
									<label>Place</label>
									<h4 className="place">{res.title}</h4>
									<label>Review</label>
									<p className="desc">{res.desc}</p>
									<label>Rating</label>
									<div className="stars">
										{Array(res.rating).fill(<Star className="star" />)}
									</div>
									<label>Information</label>
									<span className="username">created by <b>{res.username} </b></span>
									<span className="date">{format(res.createdAt)}</span>
								</div>
							</Popup>
						)}
					</Fragment>
				))}
				{newPlace && (
					<Popup
					latitude={newPlace.lat}
					longitude={newPlace.long}
					closeButton={true}
					closeOnClick={false}
					anchor="left"
					onClose={() => setNewPlace(null)}
					>
						<div>
							<form onSubmit={newPlaceSubmit}>
								<label>Title</label>
								<input placeholder="Please Enter a title" onChange={(e)=> setTitle(e.target.value)}/>
								<label>Review</label>
								<textarea placeholder="Say us something about this place" onChange={(e)=> setDesc(e.target.value)}/>
								<label>Rating</label>
								<select onChange={(e)=> setRating(e.target.value)}>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</select>
								<button className="addPin" type="submit">Add Pin</button>
							</form>
						</div>
					</Popup>
				)}
				{currentUser ? (
					<button className="button logout" onClick={logoutHandler}>Logout</button>
				) : (
					<div className="buttons">
						<button className="button login" onClick={()=> setshowlog(true)}>Login</button>
						<button className="button register" onClick={()=> setshowreg(true)}>Register</button>
					</div>
				)}
				{showlog && (<Login setshowlogin={setshowlog} mystorage={mystorage} setCurrentUser={setCurrentUser}/>)}
				{showreg && (<Register setshowregister={setshowreg}/>)}
				
			</ReactMapGL>
		</div>
	);
}

export default App;
