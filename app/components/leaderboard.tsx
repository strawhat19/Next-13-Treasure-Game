'use client';
import Section from './section';
import { db } from '../../firebase';
import { StateContext } from '../home';
import { useContext, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';

export default function LeaderBoard(props: any) {
    const loadedRef = useRef(false);
    const { id, className } = props;
    const { user, setUser, users, setUsers } = useContext(StateContext);

    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        if (user) {
            getDocs(collection(db, `users`)).then((snapshot) => {
                let latestUsers = snapshot.docs.map((doc: any) => doc.data()).sort((a: any, b: any) => b?.highScore - a?.highScore);
                let thisUser = latestUsers.filter((usr: any) => usr?.id == user?.id)[0];
                localStorage.setItem(`users`, JSON.stringify(latestUsers));
                setUsers(latestUsers);
                setUser(thisUser);
            });
        } else {
            getDocs(collection(db, `users`)).then((snapshot) => {
                let latestUsers = snapshot.docs.map((doc: any) => doc.data()).sort((a: any, b: any) => b?.highScore - a?.highScore);
                localStorage.setItem(`users`, JSON.stringify(latestUsers));
                setUsers(latestUsers);
            });
        }
    }, [user, users]);

    return <>
        <section id={id} className={`${className} flex`}>
            <div className="inner">
                <h2 className={`flex row`}><i style={{width: 15, color: `var(--gameBlue)`}} className="fas fa-signal"></i><span style={{minWidth: 117, marginLeft: 5}} className="label">High Scores</span></h2>
                <div className={`column rightColumn`}>
                    <h4><span className="emphasis">{users.length > 0 ? users.length : ``}</span>{users.length > 0 ? `Players` : ``}</h4>
                </div>
            </div>
            <div style={{background: `var(--gameBlue)`, width: `100%`, height: 3, borderRadius: 4}}></div>
            <Section className={`leaders ${users?.length > 4 ? `overflow` : ``}`} style={{padding: 5}}>{users.length > 0 ? users.map((usr: any, index: any) => {
                return <div className={`highScoreEntry`} key={usr?.id}>
                    <div className="inner userScore">
                        <div className="scoreField"><span className="emphasis">{index + 1}</span> {usr?.name?.split(` `)[0]}</div>
                        <div className="scoreField score"><span className="emphasis">{parseInt(usr?.highScore).toLocaleString(`en-US`)}</span></div>
                    </div>
                </div>
            }) : <div style={{textAlign: `center`}}>... Loading Highest Scores</div>}</Section>
        </section>
    </>
}