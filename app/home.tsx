'use client';
import AuthForm from './form';
import { createContext } from "react";
import { useContext, useEffect } from 'react';

export const StateContext = createContext<any>({});

export const capitalizeAllWords = (string: any) => {
  if (string != null || string != undefined) {
    return string.replace(`  `,` `).split(` `).map((word: any) => word?.charAt(0)?.toUpperCase() + word?.slice(1).toLowerCase()).join();
  }
};

export const getFormValuesFromFields = (formFields: any) => {
  for (let i = 0; i < formFields.length; i++) {
    let field = formFields[i];
    if (field.type != `submit`) {
      console.log(field.type, field.value);
    };
  }
}

export default function Home() {
  const { updates, setUpdates, content, setContent, width, user, setPage } = useContext(StateContext);

  const shuffle = (array: any) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  const randomize = (e?: any) => {
    setUpdates(updates+1);
    setContent(shuffle(content.split(` `)).join(` `));
  }

  useEffect(() => {
    setPage(`Home`);
    setUpdates(updates+1);
  }, [])

  return <div className={`inner pageInner`}>
    <section className={`topContent`}>
      <div className="inner">
        <h1>Home</h1>
        <div className={`column rightColumn`}>
          <h2>Updates: {updates}</h2>
          <h2>Width: {width}</h2>
        </div>
      </div>
    </section>
    <section>
     <div className="inner">
      <article>
          <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
          <div className="grid">
            <div className="gridItem">
              <div className="auth">
                <AuthForm />
              </div>
            </div>
            <div className="gridItem">{content ?? `Loading...`}</div>
            <div className="gridItem">{content ?? `Loading...`}</div>
            <div className="gridItem">{content ?? `Loading...`}</div>
            <div className="gridItem">{content ?? `Loading...`}</div>
            <div className="grid">
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
}