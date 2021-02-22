import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Meta from '../components/Meta'
import styles from '../styles/Spacex.module.css'

let API_URL = `https://api.spaceXdata.com/v3/launches?limit=10`

const fetchData = async (api) => {
  const res = await fetch(api)
  const missions = await res.json()
  return missions
}

const spacex = ({ missions }) => {
  const [allMissions, setallMissions] = useState(missions)
  const [launchYears, setLaunchYears] = useState()
  const [appliedFilters, setAppliedFilters] = useState([])
  //   const getAllMissions = useCallback((updatedMission) => {
  //     setallMissions(updatedMission)
  //   }, [])

  //   const getAppliedFilters = useCallback((updatedFilter) => {
  //     setAppliedFilters(updatedFilter)
  //   }, [])

  useEffect(() => {
    const missionYears =
      missions &&
      allMissions.length > 0 &&
      Array.from(new Set(allMissions.map((mission) => mission.launch_year)))
    setLaunchYears(missionYears)
  }, [missions])

  const filterResults = async (filter, filterWith) => {
    if (filter === 'reset') {
      missions = await fetchData(`${API_URL}`)
      setallMissions(missions)
      return
    }
    const sameFilter = appliedFilters.some((appFil) => appFil.filter === filter)
    const newFilter = appliedFilters.filter(
      (appFil) => appFil.filter !== filter
    )
    const combineFilter = sameFilter
      ? [...newFilter, { filter, filterWith }]
      : [...appliedFilters, { filter, filterWith }]
    setAppliedFilters(combineFilter)

    let queryStringsFilters = ''
    combineFilter &&
      combineFilter.map((filters) => {
        queryStringsFilters += `&${filters.filter}=${filters.filterWith}`
      })

    missions = await fetchData(`${API_URL}${queryStringsFilters}`)
    setallMissions(missions)
  }

  const renderMissions = () => {
    return allMissions && allMissions.length === 0 ? (
      <div className={styles.card} key='reset'>
        Please reset the filter.
        <button
          className={styles.button}
          onClick={() => filterResults('reset')}
        >
          Reset
        </button>
      </div>
    ) : (
      allMissions.map((mission) => (
        <div className={styles.card} key={mission.flight_number}>
          <img
            alt={mission.mission_name}
            src={mission.links.mission_patch}
            title={mission.mission_name}
          />
          <div className={styles.content}>
            <span className={styles.contentTitle}>
              {mission.mission_name}&nbsp;
            </span>
            #{mission.flight_number}
          </div>
          <div className={styles.content}>
            <span className={styles.contentTitle}>Mission Ids&nbsp;</span>
            {mission.mission_id.map((id) => id)}
          </div>
          <div className={styles.content}>
            <span className={styles.contentTitle}>Launch Year&nbsp;</span>
            {mission.launch_year}
          </div>
          <div className={styles.content}>
            <span className={styles.contentTitle}>Successful Launch&nbsp;</span>
            {`${mission.launch_success}`}
          </div>
          <div className={styles.content}>
            <span className={styles.contentTitle}>
              Successful Landing&nbsp;
            </span>
            {mission.rocket &&
              mission.rocket.first_stage &&
              mission.rocket.first_stage.cores &&
              mission.rocket.first_stage.cores[0].land_success !== undefined &&
              mission.rocket.first_stage.cores[0].land_success !== null &&
              `${mission.rocket.first_stage.cores[0].land_success}`}
          </div>
        </div>
      ))
    )
  }

  const renderMissionYears = () => {
    if (launchYears && launchYears.length > 0) {
      return launchYears.map((year) => (
        <button
          key={year}
          className={styles.button}
          onClick={() => filterResults('launch_year', year)}
        >
          {year}
        </button>
      ))
    }
  }
  return (
    <div>
      <Meta title='Space-X' />
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Spacex Launch Programs</h1>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.filterWrapper}>
              <h2 className={styles.title}>Filters</h2>
              <h2 className={styles.subtitle}>Launch Year</h2>
              <div className={styles.underline} />
              <div className={styles.row}>
                <div className={styles.buttonDoubleColumn}>
                  {renderMissionYears()}
                </div>
              </div>

              <h2 className={styles.subtitle}>Successful Launch</h2>
              <div className={styles.underline} />
              <div className={styles.row}>
                <div className={styles.buttonDoubleColumn}>
                  <button
                    className={styles.button}
                    onClick={() => filterResults('launch_success', true)}
                  >
                    True
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => filterResults('launch_success', false)}
                  >
                    False
                  </button>
                </div>
              </div>

              <h2 className={styles.subtitle}>Successful Landing</h2>
              <div className={styles.underline} />
              <div className={styles.row}>
                <div className={styles.buttonDoubleColumn}>
                  <button
                    className={styles.button}
                    onClick={() => filterResults('land_success', true)}
                  >
                    True
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => filterResults('land_success', false)}
                  >
                    False
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.doubleColumn}>
            <div className={styles.row}>
              <div className={styles.column}>
                <div className={styles.cardWrapper}>{renderMissions()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.author}>
          <h4>Developed by: Nakul</h4>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const missions = await fetchData(API_URL)
  if (!missions) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      missions,
    },
  }
}

export default spacex