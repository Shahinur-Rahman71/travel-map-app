import { Cancel } from '@material-ui/icons';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import './logRegDesign.css'

const Login = ({setshowlogin, mystorage, setCurrentUser}) => {
    const [fail, setFail] = useState(false);
    const nameRef = useRef();
    const passRef = useRef();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const user = {
                username: nameRef.current.value,
                password: passRef.current.value
            }
            const res = await axios.post('/users/login', user);
            mystorage.setItem('user', res.data.username);
            setCurrentUser(res.data.username)
            setshowlogin(false)
            setFail(false)

        } catch (error) {
            setFail(true)
        }
    }

    return (
        <div className="loginContainer">
            <div className="logo"></div>
            <form onSubmit={submitHandler}>
                <input type="text" placeholder="Enter your name" ref={nameRef}/>
                <input type="password" placeholder="Enter your password" ref={passRef}/>
                <button className="regButton">Login</button>

                {fail && (
                    <span className="regFail">Something went wrong.</span>
                )}
            </form>
            <Cancel className="cancelReg" onClick={ ()=> setshowlogin(false)}/>
        </div>
    );
};

export default Login;