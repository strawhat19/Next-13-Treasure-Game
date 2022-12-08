'use client';
import AuthForm from '../form';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../home';

export default function Profile() {
    const { state, user,  page, setPage } = useContext(StateContext);

    useEffect(() => {
      setPage(`profile`);
      console.log(`Profile`, state);
    }, [])

    return <div className={`inner pageInner`}>
        <section className={`topContent`}>
          <div className="inner">
            <h1>Profile</h1>
            <div className="column rightColumn">
                <h2>Clicks: {state.updates}</h2>
                <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>
            </div>
          </div>
        </section>
        <section>
          <div className="inner">
            <article>
              <h2><i>Profile Auth State</i></h2>
              <div className="flex auth">
                <h3>User is {user ? user?.email : `Signed Out`}</h3>
                <AuthForm />
              </div>
            </article>
          </div>
        </section>
    </div>
}