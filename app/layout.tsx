'use client';
import Link from 'next/link';
import '../styles/global.css';
import Image from 'next/image';
import { StateContext } from './home';
import { useEffect, useState } from 'react';

export default function RootLayout({ children, } : { children: React.ReactNode; }) {

  let [page, setPage] = useState(``);
  let [updates, setUpdates] = useState(0);
  let [devEnv, setDevEnv] = useState(false);
  let [year, setYear] = useState(new Date().getFullYear());
  let [state, setState] = useState({ page: page, updates: updates, devEnv: devEnv });
  
  useEffect(() => {
    setYear(new Date().getFullYear());
    setPage(window.location.pathname.replace(`/`,``));
    setDevEnv(window.location.host.includes(`localhost`));
    setState({ page: page, updates: updates, devEnv: devEnv });
  }, [])

  return (
    <html lang="en">
      <StateContext.Provider value={{state, setState}}>
        <head>
          <title>Next.js 13 | Piratechs</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.css"></link>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        </head>
        <body>
          <header>
            <div className="inner">
              <Link className={`logo hoverLink`} href={`/`}>
                <Image className={`logo reactLogo`} priority src={`/react.svg`} alt={`Logo`} width={`75`} height={`75`} /> Home
              </Link>
              <div className="menu">
                <Link className={`hoverLink`} href={`/about`}>About</Link>
                <Link className={`hoverLink`} href={`/projects`}>Projects</Link>
                <Link className={`hoverLink`} href={`/contact`}>Contact</Link>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer>
            <div className="inner">
              <div className="left">
                  <a href="https://github.com/strawhat19" target="_blank" className="hoverLink" title="GitHub"><i className="fab fa-github"></i> | Rakib Ahmed</a> 
                  <span className="vertical-sep">|</span>
                  <Link className={`hoverLink`} href={`/`}>Home  <i className="fas fa-undo"></i></Link>
              </div>
              <div className="right">Copyright <i className="fas fa-copyright"></i> 
                {year}
              </div>
            </div>
          </footer>
        </body>
      </StateContext.Provider>
    </html>
  );
}
