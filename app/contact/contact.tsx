'use client';
import { StateContext } from '../home';
import AuthForm from '../components/form';
import Banner from '../components/banner';
import Section from '../components/section';
import { useContext, useEffect, useRef } from 'react';

export default function Contact() {
  let loadedRef = useRef(false);
  let { updates, setUpdates, user, setPage } = useContext(StateContext);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setUpdates(updates+1);
    setPage(`Contact`);
  }, [])

  return <div className={`inner pageInner`}>
    <Banner id={`contactBanner`} />
    <Section id={`contactAuth`}>
      <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
      <AuthForm />
    </Section>
  </div>
}