import classes from "./Facilities.module.css"

const Facilities = (props) => {

  // facilities come from the rich-text editor (HTML) - normalize them into clean text items
  const toItems = (html) => {
    const text = (html || "")
      .replace(/<\/(li|p|div)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
    return text
      .split(/[\n,;]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  const items = toItems(props.facilities)

  return (
    <div className={classes.modal}>
      <div className={classes.header}>
        <h5 className={classes.title}>
          <i className="fas fa-concierge-bell me-2"></i>
          Guaranteed Amenities
        </h5>
        <button type="button" className={classes.closeBtn} onClick={props.onClose} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className={classes.body}>
        {items.length === 0 ? (
          <p className="text-muted mb-0">No amenities listed for this room type.</p>
        ) : (
          <ul className={classes.amenityList}>
            {items.map((item, index) => (
              <li key={index}>
                <i className={`fas fa-check-circle ${classes.checkIcon}`}></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={classes.footer}>
        <button type="button" className={classes.closeFooterBtn} onClick={props.onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default Facilities