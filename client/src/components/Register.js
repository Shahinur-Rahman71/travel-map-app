import { Cancel } from '@material-ui/icons';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import './logRegDesign.css'

const Register = ({setshowregister}) => {
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const newUser = {
                username: nameRef.current.value,
                email: emailRef.current.value,
                password: passRef.current.value
            }
            await axios.post('http://localhost:5000/api/users/register', newUser);
            setFail(false)
            setSuccess(true);

        } catch (error) {
            setFail(true)
        }
    }

    return (
        <div className="registerContainer">
            <div className="logo"></div>
            <form onSubmit={submitHandler}>
                <input type="text" placeholder="Enter your name" ref={nameRef} required/>
                <input type="email" placeholder="Enter your email" ref={emailRef} required/>
                <input type="password" placeholder="Enter your password" ref={passRef} required/>
                <button className="regButton">Register</button>
                {success && (
                    <span className="regSuccess">Registration Done. You can login now</span>
                )}
                {fail && (
                    <span className="regFail">Something went wrong.</span>
                )}
            </form>
            <Cancel className="cancelReg" onClick={ ()=> setshowregister(false)}/>
        </div>
    );
};

export default Register;