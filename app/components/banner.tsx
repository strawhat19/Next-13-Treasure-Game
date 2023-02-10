'use client';
import { useContext } from 'react';
import { capitalizeAllWords, StateContext } from '../home';
export default function Banner(props: any) {
    const { id } = props;
    const { page, updates } = useContext(StateContext);
    return <section id={id} className={`topContent`}>
        <div className="inner">
            <h1>{page != `` ? capitalizeAllWords(page) : `Home`}</h1>
            <div className={`column rightColumn`}>
                <h2>Updates: {updates}</h2>
                {/* <h2>Width: {width}</h2> */}
            </div>
        </div>
    </section>
}