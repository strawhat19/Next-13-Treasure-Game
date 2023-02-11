export default function Section(props: any) {
    const { id, className, background, style, articleStyle } = props;
    return <section id={id} className={`section ${className ?? ``}`} style={{...style, background: `${background ?? `none`}`}}>
        <div className="inner">
            <article className="sectionContent" style={articleStyle ?? null}>{props.children}</article>
        </div>
    </section>
}