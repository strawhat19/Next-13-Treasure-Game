'use client';
import AuthForm from '../form';
import Project from './project';
import { StateContext } from '../home';
import { useContext, useEffect, useState, useRef } from 'react';

export default function Projects() {
  const initialLoad = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState<any>([]);
  const { updates, setUpdates, width, user, setPage, setUser } = useContext(StateContext);

  function formatDate(date: any) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
  }

  // Github
  const getGithubData = async () => {
    let username = `strawhat19`;
    const repoURL = `https://api.github.com/users/${username}/repos`;
    const githubURL = `https://api.github.com/users/${username}`;
    const repositories = JSON.parse(localStorage.getItem(`repositories`) as string) || [];
    const responseRepos = await fetch(repoURL);
    const response = await fetch(githubURL);

    if (!response.ok || !responseRepos.ok) {
      console.log(`Fetch Error`);
      console.clear();
    } else {
      // Get Github Info
      const github = await response.json();
      const githubRepos = await responseRepos.json();
      const { name, html_url, bio, blog, avatar_url, login, public_repos, repos_url, starred_url, followers, following } = github;
      githubRepos.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((repo: any) => {
        const { name, html_url, created_at, owner, topics, license, updated_at, deployments_url, language, homepage, description } = repo;
        const filteredRepo = { name, owner, url: html_url, topics, date: created_at, license, updated: updated_at, homepage, language, deployment: deployments_url, description };
        repositories.push(filteredRepo);
      });
      const gitUser = { name, url: html_url, bio, projects: repositories.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()), website: blog, avatar: avatar_url, login, repoLink: repos_url, repoNum: public_repos, starred: starred_url, followers, following, lastUpdated: formatDate(new Date()) };

      setUser({...user, ...gitUser});
      setProjects(gitUser.projects);
      console.log(`Updated User`, gitUser);
      console.log(`Updated Projects`, gitUser.projects);
      localStorage.setItem(`user`, JSON.stringify({...user, ...gitUser}));
      localStorage.setItem(`projects`, JSON.stringify(gitUser.projects));
    };
  }

  useEffect(() => {
    let firstLoad = !initialLoad.current;
    let updated = initialLoad.current;
    let cachedUser = JSON.parse(localStorage.getItem(`user`) as any);
    let cachedProjects = JSON.parse(localStorage.getItem(`projects`) as any) || [];

    if (firstLoad) {
      setLoaded(true);
      setPage(`Projects`);
      setUpdates(updates+1);
      if (!cachedUser || cachedProjects.length == 0) {
        getGithubData();
      } else {
        setProjects(cachedProjects);
        setUser({...user, ...cachedUser});
        console.log(`Cached Projects`, cachedProjects);
      };
    }

    if (updated) {
      if (cachedUser) console.log(`Cached User`, cachedUser);
    }

    return () => {initialLoad.current = true;};
  }, [])

  return <div className={`inner pageInner`}>
    <section className={`topContent`}>
      <div className="inner">
        <h1>Projects</h1>
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
          {!user && <div className="flex auth">
            <AuthForm />
          </div>}
        </article>
      </div>
    </section>
    <section>
      <div className="inner">
        <article>
          <h2><i>Projects</i></h2>
          <div className="flex projects">
            {loaded && projects && projects.length > 0 ? projects.map((project: any, index: any) => <Project key={index} project={project} />) : <div className={`skeleton`}>
              <h4>Loading...</h4>  
            </div>}
          </div>
        </article>
      </div>
    </section>
  </div>
}