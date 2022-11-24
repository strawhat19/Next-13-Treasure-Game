'use client';
import { StateContext } from '../layout';
import { useContext, useEffect } from 'react';
export default function About() {
    const { state, setState } = useContext(StateContext);

    useEffect(() => {
        setState({ page: window.location.pathname.replace(`/`, ``)});
        console.log(`About`, state);
    }, []);

    return <>
        <h1>About</h1>
    </>
}