export default function Project(props: any) {
    const {project} = props;
    return <div id={project?.name} className={`project`}>
      <span className={`name`}>{project.name}</span>
      {/* <span className={`topics`}>{project?.topics}</span> */}
    </div>
}