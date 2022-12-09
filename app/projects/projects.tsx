'use client';
import AuthForm from '../form';
import { StateContext } from '../home';
import { useContext, useEffect, useState } from 'react';

export default function Projects() {
  const [loaded, setLoaded] = useState(false);
  const { updates, setUpdates, width, user, setPage } = useContext(StateContext);
  const [projects, setProjects] = useState<any>([]);

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
      const user = { name, url: html_url, bio, projects: repositories.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()), website: blog, avatar: avatar_url, login, repoLink: repos_url, repoNum: public_repos, starred: starred_url, followers, following, lastUpdated: formatDate(new Date()) };

      setProjects(user.projects);
      console.log(`Updated Projects`, user.projects);
      localStorage.setItem(`projects`, JSON.stringify(user.projects));
    };
  }

    useEffect(() => {
      setLoaded(true);
      setPage(`Projects`);
      setUpdates(updates+1);
      setProjects(JSON.parse(localStorage.getItem(`projects`) as any));
      if (loaded) {
        if (projects.length == 0) {
          getGithubData();
        } else {
          console.log(`Projects`, projects);
        };
      }
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
            <div className="flex auth">
              <AuthForm />
            </div>
          </article>
        </div>
      </section>
      <section>
        <div className="inner">
          <article>
            <h2><i>Projects</i></h2>
            <div className="flex projects">
              {loaded ? projects.map((pr: any) => {
                return (
                  <div key={pr.name} className={`project`}>{pr.name}</div>
                )
              }) : <div className={`skeleton`}>
                {
                    projects.map((pr: any) => {
                      return (
                        <div key={pr.name} className={`project`}>{pr.name}</div>
                      )
                    })
                }
                </div>}
            </div>
          </article>
        </div>
      </section>
    </div>
}