'use client';
import { StateContext } from '../home';
import Banner from '../components/banner';
import AuthForm from '../components/form';
import { useContext, useEffect } from 'react';

export default function About() {
  const { updates, setUpdates, user, setPage, content } = useContext(StateContext);

    useEffect(() => {
      setPage(`About`);
      setUpdates(updates+1);
    }, [])

    return <div className={`inner pageInner`}>
      <Banner id={`aboutBanner`} />
      <section id={`aboutSection`}>
        <div className="inner">
          <article>
            <p>{user?.bio == `` ? `No bio yet... You can to the Profile Page to sdd one! Click on the link that has the first part of your name!` : content}</p>
          </article>
        </div>
      </section>
      <section id={`aboutAuth`}>
        <div className="inner">
          <article>
            <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
            <div className="flex auth">
              <AuthForm />
            </div>
          </article>
        </div>
      </section>
    </div>
}