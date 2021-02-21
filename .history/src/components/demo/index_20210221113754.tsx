import React, { useRef, useEffect } from 'react';


interface DemoProps {
  text?: string
}

const Demo: React.FC<DemoProps> = (props) => {
  const { text} = props
  return (<div>{test}</div>)
}

export default Demo