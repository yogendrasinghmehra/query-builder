import React from 'react'
import CustomQueryBuilder from './queryBuilder/CustomQueryBuilder'

const Dashboard = () => {
  return (
    <>
     <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h2">Client Report</h1>
    </div>
    <CustomQueryBuilder></CustomQueryBuilder>
    </>
  )
}

export default Dashboard
