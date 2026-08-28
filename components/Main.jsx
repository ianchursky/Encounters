import config from '../config'
import React from 'react'
import Header from './Header/Header'
import Content from './Content/Content'

const Main = () => {
  return (
    <div className={config.prefix}>
      <Header />
      <Content />
    </div>
  )
}

export default Main
