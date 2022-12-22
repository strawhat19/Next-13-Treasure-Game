'use client';
import { StateContext } from '../home';
import AuthForm from '../components/form';
import Banner from '../components/banner';
import { useContext, useEffect } from 'react';

export default function Contact() {
  const { updates, setUpdates, user, setPage } = useContext(StateContext);

    useEffect(() => {
      setPage(`Contact`);
      setUpdates(updates+1);
    }, [])

    return <div className={`inner pageInner`}>
      <Banner id={`contactBanner`} />
      <section id={`contactAuth`}>
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