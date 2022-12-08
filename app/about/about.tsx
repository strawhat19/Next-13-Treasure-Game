'use client';
import AuthForm from '../form';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../home';

export default function About() {
    const { state, setState, user,  page, setPage } = useContext(StateContext);

    useEffect(() => {
      setState({ 
        ...state,
        user,
        updates: state.updates+1, 
        page: window.location.pathname.replace(`/`,``),
      });
      setPage(window.location.pathname.replace(`/`,``));
      console.log(`About`, state);
    }, [])

    return <div className={`inner pageInner`}>
        <section className={`topContent`}>
          <div className="inner">
            <h1>About</h1>
            <div className="column rightColumn">
                <h2>Clicks: {state.updates}</h2>
                <h2>State: {capitalizeAllWords(page)}</h2>
                <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>
            </div>
          </div>
        </section>
        <section>
          <div className="inner">
            <article>
              <h2><i>About Auth State</i></h2>
              <div className="flex auth">
                <h3>User is {user ? user?.email : `Signed Out`}</h3>
                <AuthForm />
              </div>
            </article>
          </div>
        </section>
    </div>
}