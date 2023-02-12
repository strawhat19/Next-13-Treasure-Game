'use client';
import Project from './project';
import { db } from '../../firebase';
import Banner from '../components/banner';
import AuthForm from '../components/form';
import { doc, getDoc } from 'firebase/firestore';
import { formatDate, StateContext } from '../home';
import { useContext, useEffect, useState, useRef } from 'react';

export default function Projects() {
  const initialLoad = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState<any>([]);
  const [overrideUser, setOverrideUser] = useState(false);
  const { updates, setUpdates, user, setPage, setUser } = useContext(StateContext);

  const getDefaultUser = async () => {
    const defaultUser = await getDoc(doc(db, `users`, `1 Rakib 5:21 AM 12-21-2022`));
    if (defaultUser.exists()) {
      return defaultUser.data();
    }
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
      const gitUser = { id: `1 Rakib 5:21 AM 12-21-2022`, name, url: html_url, bio, projects: repositories.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()), website: blog, avatar: avatar_url, login, repoLink: repos_url, repoNum: public_repos, starred: starred_url, followers, following, lastSignin: formatDate(new Date()) };

      setProjects(gitUser?.projects);
      console.log(`Updated Projects`, gitUser?.projects);
      localStorage.setItem(`projects`, JSON.stringify(gitUser?.projects));
      if (overrideUser) {
        getDefaultUser().then((usr: any) => {
          setUser({...usr, ...user, ...gitUser, projects: gitUser?.projects});
          console.log(`Updated User`, {...usr, ...user, ...gitUser, projects: gitUser?.projects});
          localStorage.setItem(`user`, JSON.stringify({...usr, ...user, ...gitUser, projects: gitUser?.projects}));
        });
      }
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

      if (cachedProjects.length > 0) {
        console.log(`Cached Projects`, cachedProjects);
        setProjects(cachedProjects);
      } else {
        getGithubData();
      };
    }

    return () => {initialLoad.current = true;};
  }, [])

  return <div className={`inner pageInner`}>
    <Banner id={`projectsBanner`} />
    <section id={`projectsAuth`}>
      <div className="inner">
        <article>
          <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
          {!user && <div className="flex auth">
            <AuthForm />
          </div>}
        </article>
      </div>
    </section>
    <section id={`projectsSection`}>
      <div className="inner">
        <article>
          <h2><i>Projects</i></h2>
          <div className="flex projects">
            {projects.length > 0 ? projects.map((project: any, index: any) => <Project key={index} project={project} />) : <div className={`skeleton`}>
              <h4 className={`skeletonItem`}>Loading...</h4>  
            </div>}
          </div>
        </article>
      </div>
    </section>
  </div>
}