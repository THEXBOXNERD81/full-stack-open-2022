const Part = ({contents}) => {
  
  const total = contents.reduce((sum, content) => {
    return sum + content.exercises
  }, 0)
  
  return(
    <ul>
      {contents.map((content) => {

        return (
          <li key={content.id}>{content.name + ' ' + content.exercises}</li>
        )
      })}
      <p>total of {total} exercises</p>
    </ul>
  )
}

const Header = ({name}) => {
  return (
    <>
      <h2>{name}</h2>
    </>
  )
}

const Content = ({content}) => {

  return (
    <>
      <Part contents={content}/>
    </>
  )
}

const Course = ({courses}) => {

  return (
    <>
    <h1>Web Development curriculum</h1>
    {courses.map((course) => {
      
      return (
        <div key={course.id}>
          <Header name={course.name}/>
          <Content content={course.parts}/>
        </div>
        )
      })}
    </>
  )

}

export default Course