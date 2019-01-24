import React from 'react'


const Header = (props) => {
  return(
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}
  
const Part = (props) => {
  const {parts} = props
  const namesAndExercises = () =>
    parts.map(part => <li key={part.id}>{part.name} {part.exercises}</li>)  
  return(
    <div>
      {namesAndExercises()}      
    </div>
  )
}
  
const Content = (props) => {
  const {course} = props
  const parts =course.parts
  return(
    <div>
      <Part parts={parts}/>        
    </div>
  )
}
  
  
const Total = (props) => {
  const {parts} = props
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)    
  return(
    <div>
      <p>yhteensä {total} tehtävää</p>
    </div>
  )
}
  
const Course = (props) => {
  const {course} = props
  const parts = course.parts
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total parts={parts}/>
    </div>
  )
}

export default Course