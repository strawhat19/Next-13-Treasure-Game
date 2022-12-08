'use client';
import AuthForm from '../form';
import { StateContext } from '../home';
import { useContext, useEffect } from 'react';

export default function About() {
  const { updates, setUpdates, width, user, setPage } = useContext(StateContext);

    useEffect(() => {
      setPage(`About`);
      setUpdates(updates+1);
    }, [])

    return <div className={`inner pageInner`}>
        <section className={`topContent`}>
          <div className="inner">
            <h1>About</h1>
            <div className={`column rightColumn`}>
              <h2>Updates: {updates}</h2>
              <h2>Width: {width}</h2>
            </div>
          </div>
        </section>
        <section>
          <div className="inner">
            <article>
              <h2><i>User is {user ? user?.email : `Signed Out`}</i></h2>
              <div className="flex auth">
                <AuthForm />
              </div>
            </article>
          </div>
        </section>
    </div>
}