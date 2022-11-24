'use client';
import { StateContext } from '../app';
import { useContext, useEffect } from 'react';

export default function About() {
    const { state, setState } = useContext(StateContext);

    useEffect(() => {
        setState({ page: window.location.pathname.replace(`/`, ``)});
    }, []);

    return <>
        <h1>About</h1>
    </>
}