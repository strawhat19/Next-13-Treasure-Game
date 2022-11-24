'use client';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../home';

export default function Contact() {
    const { state, setState } = useContext(StateContext);

    useEffect(() => {
      setState({ page: window.location.pathname.replace(`/`,``) });
    }, [])

    return <div className={`inner`}>
        <h1>Contact</h1>
        <h2>{state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>
    </div>
}