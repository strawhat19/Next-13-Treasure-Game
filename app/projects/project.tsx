export default function Project(props: any) {
    const {project} = props;
    return <div className={`project`}>
      <span className={`name`}>{project.name}</span>
      <span className={`id`}>{project.id}</span>
    </div>
}