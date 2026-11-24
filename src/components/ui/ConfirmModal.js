import classes from './ConfirmModal.module.css'

/**
 * Common confirmation box for the whole project.
 *
 * Props:
 *  - onCancel    (required) called on Cancel / backdrop click
 *  - onConfirm   (required) called on Confirm
 *  - title       dialog heading        (default "Please Confirm")
 *  - message     body text, "\n" ok    (default delete question)
 *  - confirmText confirm button label  (default "Confirm")
 *  - cancelText  cancel button label   (default "Cancel", pass null to hide)
 *  - variant     "danger" | "primary"  (default "danger")
 */
function ConfirmModal({
  onCancel,
  onConfirm,
  title = 'Please Confirm',
  message = 'Are you sure you want to delete? This cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  const isDanger = variant !== 'primary'

  return (
    <div className={classes.overlay} onClick={onCancel}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <div className={classes.iconWrap}>
          <i
            className={`fas ${
              isDanger ? 'fa-exclamation-triangle ' + classes.iconDanger
                       : 'fa-question-circle ' + classes.iconPrimary
            }`}
          ></i>
        </div>
        <h5 className={classes.title}>{title}</h5>
        <p className={classes.message}>{message}</p>
        <div className={classes.actions}>
          {cancelText && (
            <button
              type="button"
              className={`${classes.btn} ${classes['btn--alt']}`}
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={`${classes.btn} ${isDanger ? classes['btn--danger'] : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
