export default function Header(props: any) {
    const { id, className, title, subtitle, subBanner } = props;
    return subBanner ? <div id={id} className={`header flex row subBanner ${className ?? ``}`}>
        {title && <h2><i>{title}</i></h2>}
        {subtitle && <h4><i>{subtitle}</i></h4>}
    </div> : <div id={id} className={`header flex row ${className ?? ``}`}>
        {title && <h1>{title}</h1>}
            {subtitle && <div className={`column rightColumn`}>
                {subtitle.split(` `).map((sub: any) => {
                    return <h2 key={sub}>{sub}</h2>
                })}
            </div>}
    </div>
}