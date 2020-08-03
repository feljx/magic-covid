import styles from './index.module.css'

function Tooltip (props) {
    const data = props.children
    const name = props.name
    const fields = data
        ? [
              [ 'Cases', 'cases' ],
              [ 'Deaths', 'deaths' ],
              [ 'Population', 'pop' ],
              [ 'Datapoints', 'daycount' ]
          ]
        : []
    const other_info = fields.map(([ field, key ]) => (
        <p key={key}>{`${field}: ${data[key]}`}</p>
    ))
    return (
        <div className={styles.tooltip} style={props.style}>
            <p>{name}</p>
            {other_info}
        </div>
    )
}

export default Tooltip
