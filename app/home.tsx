'use client';
import Image from 'next/image';
import Banner from './components/banner';
import AuthForm from './components/form';
import Header from "./components/header";
import Section from "./components/section";
import { createContext, useRef } from "react";
import { useContext, useEffect, useState } from 'react';

export const defaultContent = `Hey, I’m Rakib, a Software Engineer @ Mitsubishi Electric Trane HVAC US, or just Mitsubishi Electric for short. Along with my 7 years of experience as a developer, and owner of my own tech and digital media side business, Piratechs. This website is just for me to test out Next.js 13.`;

export const generateUniqueID = (existingIDs?:any) => {
  let newID = Math.random().toString(36).substr(2, 9);
  if (existingIDs && existingIDs.length > 0) {
    while (existingIDs.includes(newID)) {
      newID = Math.random().toString(36).substr(2, 9);
    }
  }
  return newID;
}

export const updateOrAdd = (obj: any, arr: any) => {
  let index = arr.findIndex((item: any) => item.name === obj.name);
  if (index !== -1) {
    arr[index] = obj;
  } else {
    arr.push(obj);
  }
  return arr;
}

export const getNumberFromString = (string: string) => {
  let result: any = string.match(/\d+/);
  let number = parseInt(result[0]);
  return number;
}

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

export const formatDate = (date: any) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime + ` ` + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
}

export const defaultLists: List[] = [
  {id: 1, name: `ProductIVF`, itemName: `Ticket`, items: [
    {id: 1, order: 1, index: 0, item: `Draggable Lists`, complete: false},
    {id: 2, order: 2, index: 1, item: `Complete Item in List`, complete: false},
    {id: 3, order: 3, index: 2, item: `Icon in Tab`, complete: false},
    {id: 4, order: 4, index: 3, item: `Update Lists on Reorder`, complete: false},
    {id: 5, order: 5, index: 4, item: `Corner Draggable`, complete: false},
    {id: 6, order: 6, index: 5, item: `Create List`, complete: false},
    {id: 7, order: 7, index: 6, item: `localStorage if Signed Out`, complete: false},
    {id: 8, order: 8, index: 7, item: `Switch to User`, complete: false},
    {id: 9, order: 9, index: 8, item: `Save User List if Signed In`, complete: false},
    {id: 10, order: 10, index: 9,  item: `Mobile Responsiveness`, complete: false},
  ]},
  {id: 2, name: `To Do List`, itemName: `Task`, items: [
    {id: 1, order: 1, index: 0, item: `Check Calendar`, complete: false},
    {id: 2, order: 2, index: 1, item: `Pay Bills`, complete: false},
    {id: 3, order: 3, index: 2, item: `KOL`, complete: false},
    {id: 4, order: 4, index: 3, item: `YT`, complete: false},
  ]},
  {id: 3, name: `One Piece Strongest 2023`, itemName: `Character`, items: [
    {id: 1, order: 1, index: 0, item: `Imu`, complete: false},
    {id: 2, order: 2, index: 1, item: `Shanks`, complete: false},
    {id: 3, order: 3, index: 2, item: `Dragon`, complete: false},
    {id: 4, order: 4, index: 3, item: `Kaido`, complete: false},
    {id: 5, order: 5, index: 4, item: `Mihawk`, complete: false},
  ]},
];

export const StateContext = createContext<any>({});
export const log = (item: any) => console.log(item);

export default function Home() {
  const loadedRef = useRef(false);
  const { updates, setUpdates, content, setContent, user, setPage, devEnv, width, mobileMenuBreakPoint } = useContext(StateContext);

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
    setContent(shuffle(content?.split(` `)).join(` `));
  }

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setPage(`Home`);
    setUpdates(updates+1);
  }, []);

  return <div className={`inner pageInner`}>
    <Banner id={`homeBanner`} />
    {/* {!user && <Section><div className={`intro flex ${width < mobileMenuBreakPoint ? `` : `row`}`}>
      <span>{user?.bio == `` ? `--` : content}</span>
      <button onClick={randomize}>Randomize Paragraph</button>
    </div></Section>} */}
    {/* <Section><iframe width={`100%`} height={`100%`} style={{border: 0, outline: `none`, minHeight: 400}} src="https://piratechs.com/"></iframe></Section> */}
    <Section id={`homeSection`}>
      <Header title={`User is ${user ? user?.name : `Signed Out`}`} subtitle={`${user?.updated ? `Updated ${user?.updated}` : ``}`} subBanner />
      <div className="flex row start"><p style={{maxWidth: `fit-content`}}>This is just a website where i experiment with code and what not. lately ive been working on a game. Its my first time making a game by myself, so some things probably dont work right, but anyways thank you for playing and have fun!</p>
      <button id="startGame" onClick={(Event: any) => window.location.href = window.location.href + `game`}>Click Here to <span className={`emphasis`}>Play</span></button></div>
      <Image className={`sectionImage`} priority src={`/pirateTreasure.svg`} alt={`Logo`} width={`1000`} height={`888`} />
      {/* {user ? <div className="profile flex">
        <span>Name: {user.name}</span>
        {user?.email && <span>Email: {user?.email}</span>}
        {user?.color && <span>Color: {user?.color}</span>}
        <span>Number: {user?.number == `` ? `--` : user?.number}</span>
        <span>Status: {user?.status == `` ? `--` : user?.status}</span>
        {user?.password && <span className={`flex row start`}>Password: <span className={`flex row contain`}>{user?.password?.split(``).map((char: any, i: any) => {
          return <span key={i} className={`blur`}>X</span>
        })}</span></span>}
        <div className="flex row">
          <span>About You: {user?.bio == `` ? `--` : content}</span>
          <button className="rowButton" onClick={randomize}>Randomize Paragraph</button>  
        </div>
      </div> : ``} */}
    </Section>
    <Section>
      <AuthForm />
    </Section>
    {/* {devEnv && <Section>
      <Header title={`Adapt`} subtitle={`This Section`} />
      This is a new section template im pushing for now and will implement later on.
     
    </Section>} */}
  </div>
}