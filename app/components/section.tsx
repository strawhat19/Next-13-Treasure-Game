export default function Section(props: any) {
    const { id, className, background, style } = props;
    return <section id={id} className={`section ${className ?? ``}`} style={{...style, background: `${background ?? `none`}`}}>
        <div className="inner">
            <article className="sectionContent">{props.children}</article>
        </div>
    </section>
}