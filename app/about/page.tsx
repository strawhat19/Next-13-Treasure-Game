'use client';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../app';

export default function About() {
    const { state, setState } = useContext(StateContext);

    useEffect(() => {
        setState({ page: window.location.pathname.replace(`/`, ``)});
    }, []);

    return <>
        <h1>{capitalizeAllWords(state.page)}</h1>
    </>
}