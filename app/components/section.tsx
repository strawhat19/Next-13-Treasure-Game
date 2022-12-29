export default function Section(props: any) {
    const { id, className, background } = props;
    return <section id={id} className={`section ${className ?? ``}`} style={{background: `${background ?? `none`}`}}>
        <div className="inner">
            <article>{props.children}</article>
        </div>
    </section>
}