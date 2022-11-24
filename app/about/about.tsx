'use client';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../home';

export default function About() {
    const { state, setState } = useContext(StateContext);

    useEffect(() => {
      setState({ 
        updates: state.updates++, 
        page: window.location.pathname.replace(`/`,``), 
        devEnv: window.location.host.includes(`localhost`)
      });
    }, [])

    return <div className={`inner`}>
        <h1>About</h1>
        <div className="column rightColumn">
            {state.devEnv && <h2>Clicks: {state.updates}</h2>}
            <h2>Env: {state.devEnv ? `Dev` : `Prod`}</h2>
            {state.devEnv && <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>}
        </div>
    </div>
}