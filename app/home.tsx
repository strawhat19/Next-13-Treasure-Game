'use client';
import { createContext } from "react";
import Banner from './components/banner';
import AuthForm from './components/form';
import { useContext, useEffect } from 'react';

export const StateContext = createContext<any>({});

export const createXML = (xmlString: string) => {
  let div = document.createElement('div');
  div.innerHTML = xmlString.trim();
  return div.firstChild;
}

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
  const { updates, setUpdates, content, setContent, user, setPage, users } = useContext(StateContext);

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
  }, []);

  return <div className={`inner pageInner`}>
    <Banner id={`homeBanner`} />
    <section>
     <div className="inner">
      <article>
          <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
          <div className="flex auth">
            <AuthForm />
          </div>
        </article>
      </div>
    </section>
    <section>
     <div className="inner">
      <article>
      <div className="grid">
            <div className="gridItem">{content ?? `Loading...`}</div>
            <div className="gridItem">{content ?? `Loading...`}</div>
            <div className="grid">
              {users.map((usr: any) => {
                return <div key={usr?.name} className="gridItem"><button onClick={randomize}>Randomize Paragraph {usr?.name}</button></div>
              })}
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
}