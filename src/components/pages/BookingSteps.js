import { Fragment } from "react";
import classes from "./BookingSteps.module.css";

const steps = [
  { label: "Select Room", icon: "fas fa-bed" },
  { label: "Guest Info", icon: "fas fa-user-edit" },
  { label: "Payment", icon: "fas fa-credit-card" },
  { label: "Confirmed", icon: "fas fa-check-circle" },
];

const BookingSteps = ({ current }) => {
  return (
    <div className={classes.stepper}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const stateClass =
          stepNumber < current
            ? classes.done
            : stepNumber === current
            ? classes.active
            : "";
        return (
          <Fragment key={step.label}>
            <div className={`${classes.step} ${stateClass}`}>
              <span className={classes.circle}>
                {stepNumber < current ? (
                  <i className="fas fa-check"></i>
                ) : (
                  <i className={step.icon}></i>
                )}
              </span>
              <span className={classes.label}>{step.label}</span>
            </div>
            {stepNumber < steps.length && (
              <div
                className={`${classes.connector} ${
                  stepNumber < current ? classes.connectorDone : ""
                }`}
              ></div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default BookingSteps;