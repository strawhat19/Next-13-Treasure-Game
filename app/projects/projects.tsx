'use client';
import { capitalizeAllWords, StateContext } from '../app';
import { useContext, useEffect } from 'react';

export default function Projects() {
    const { state, setState } = useContext(StateContext);

    useEffect(() => {
        setState({ page: window.location.pathname.replace(`/`, ``)});
    }, []);

    return <>
        <h1>{capitalizeAllWords(state.page)}</h1>
    </>
}